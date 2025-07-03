const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export class GitHubAPI {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    console.log('GitHub token set:', token ? 'Token configured' : 'No token');
  }

  static async fetchAdocFile(
    owner: string,
    repo: string,
    path: string,
    branch: string = 'main'
  ): Promise<string> {
    console.log(`Fetching: ${owner}/${repo}/${path} from branch ${branch}`);

    // Si hay token, usar la GitHub API autenticada
    if (this.token) {
      try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
        console.log('Fetching via GitHub API with token:', apiUrl);

        const res = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'Authorization': `Bearer ${this.token}`,
            'User-Agent': 'IOC-Dashboard/1.0',
            'Cache-Control': 'no-cache',
          },
        });

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        const content = await res.text();
        if (!content || content.trim().length === 0) {
          throw new Error('Empty file content received.');
        }

        return content;
      } catch (err) {
        console.warn('Fallback to raw URL due to GitHub API error:', err);
      }
    }

    // Si no hay token o falla, usar raw URL
    const rawUrl = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${path}`;
    console.log('Attempting raw URL:', rawUrl);

    try {
      const res = await fetch(rawUrl, {
        headers: {
          'Accept': 'text/plain',
          'User-Agent': 'IOC-Dashboard/1.0',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-cache',
        mode: 'cors',
      });

      if (res.ok) {
        const content = await res.text();
        if (content && content.trim().length > 0) return content;
      }
    } catch (e) {
      console.warn('Direct raw fetch failed, fallback to proxy:', e);
    }

    // Fallback final con proxy
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(rawUrl)}`;
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'IOC-Dashboard/1.0',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`File not found: ${owner}/${repo}/${path}`);
      }
      throw new Error(`Proxy fetch error: ${response.statusText}`);
    }

    const content = await response.text();
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from proxy');
    }

    return content;
  }

  static async checkRateLimit(): Promise<{
    remaining: number;
    limit: number;
    resetTime: Date;
  }> {
    try {
      const headers: HeadersInit = {
        'User-Agent': 'IOC-Dashboard/1.0',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`https://api.github.com/rate_limit`, {
        headers,
      });

      if (!response.ok) throw new Error('Failed to check rate limit');

      const data = await response.json();
      return {
        remaining: data.rate.remaining,
        limit: data.rate.limit,
        resetTime: new Date(data.rate.reset * 1000),
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return {
        remaining: 0,
        limit: 5000,
        resetTime: new Date(Date.now() + 3600000),
      };
    }
  }
}
