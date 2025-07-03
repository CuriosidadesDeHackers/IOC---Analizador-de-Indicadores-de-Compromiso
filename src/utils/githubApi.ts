const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

export class GitHubAPI {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    console.log('🔑 GitHub token configured successfully');
  }

  static async fetchAdocFile(
    owner: string,
    repo: string,
    path: string,
    branch: string = 'main'
  ): Promise<string> {
    console.log(`🔍 Fetching: ${owner}/${repo}/${path} from branch ${branch}`);

    // Strategy 1: GitHub API with authentication (PRIORITARIO)
    if (this.token) {
      try {
        console.log('🔑 Using GitHub API with authentication...');
        const content = await this.fetchViaGitHubAPI(owner, repo, path, branch);
        if (content) {
          console.log('✅ GitHub API authentication successful');
          return content;
        }
      } catch (err) {
        console.warn('❌ GitHub API with auth failed:', err);
      }
    }

    // Strategy 2: GitHub API without authentication (fallback)
    try {
      console.log('🌐 Trying GitHub API without authentication...');
      const content = await this.fetchViaGitHubAPIPublic(owner, repo, path, branch);
      if (content) {
        console.log('✅ GitHub API public access successful');
        return content;
      }
    } catch (err) {
      console.warn('❌ GitHub API public access failed:', err);
    }

    // Strategy 3: JSDelivr CDN (muy confiable)
    try {
      console.log('📦 Trying JSDelivr CDN...');
      const content = await this.fetchViaJSDelivr(owner, repo, path, branch);
      if (content) {
        console.log('✅ JSDelivr CDN successful');
        return content;
      }
    } catch (err) {
      console.warn('❌ JSDelivr CDN failed:', err);
    }

    // Strategy 4: Raw GitHub (último recurso)
    try {
      console.log('🔗 Trying raw GitHub URL...');
      const content = await this.fetchViaRawGitHub(owner, repo, path, branch);
      if (content) {
        console.log('✅ Raw GitHub successful');
        return content;
      }
    } catch (err) {
      console.warn('❌ Raw GitHub failed:', err);
    }

    throw new Error(`❌ Failed to fetch ${owner}/${repo}/${path} after trying all methods.

🔧 Troubleshooting:

1. **GitHub Token**: ${this.token ? '✅ Configured' : '❌ Missing'}
   ${!this.token ? '   Configure VITE_GITHUB_TOKEN in your environment' : ''}

2. **Repository Access**: Verify the repository exists and is accessible
   URL: https://github.com/${owner}/${repo}/blob/${branch}/${path}

3. **Network**: Check your VPS network connectivity
   Test: curl -I https://api.github.com/rate_limit

4. **Rate Limits**: ${this.token ? 'Using authenticated requests (5000/hour)' : 'Using public requests (60/hour)'}

If the problem persists, the repository might be private or the file path might be incorrect.`);
  }

  private static async fetchViaGitHubAPI(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    const apiUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      console.log(`🔗 API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'IOC-Dashboard/1.0',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`File not found: ${owner}/${repo}/${path}`);
        }
        if (response.status === 401) {
          throw new Error('Invalid GitHub token or insufficient permissions');
        }
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
          throw new Error(`Rate limit exceeded. Remaining: ${rateLimitRemaining}`);
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      if (!content || content.trim().length === 0) {
        throw new Error('Empty content received from GitHub API');
      }

      // Log rate limit info
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      console.log(`📊 Rate limit remaining: ${rateLimitRemaining}`);
      
      return content;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  private static async fetchViaGitHubAPIPublic(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    const apiUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'IOC-Dashboard/1.0',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GitHub API public error: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      if (!content || content.trim().length === 0) {
        throw new Error('Empty content received from GitHub API public');
      }

      return content;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  private static async fetchViaJSDelivr(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(jsdelivrUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain, */*',
          'User-Agent': 'IOC-Dashboard/1.0',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const content = await response.text();
        if (content && content.trim().length > 0 && !content.includes('404')) {
          return content;
        }
      }
      
      throw new Error('JSDelivr request failed');
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  private static async fetchViaRawGitHub(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    const rawUrl = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(rawUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'User-Agent': 'IOC-Dashboard/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const content = await response.text();
        if (content && content.trim().length > 0) {
          return content;
        }
      }
      
      throw new Error('Raw GitHub request failed');
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  static async checkRateLimit(): Promise<{
    remaining: number;
    limit: number;
    resetTime: Date;
    isAuthenticated: boolean;
  }> {
    try {
      const headers: HeadersInit = {
        'User-Agent': 'IOC-Dashboard/1.0',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
        headers,
      });

      if (!response.ok) throw new Error('Failed to check rate limit');

      const data = await response.json();
      return {
        remaining: data.rate.remaining,
        limit: data.rate.limit,
        resetTime: new Date(data.rate.reset * 1000),
        isAuthenticated: !!this.token
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return {
        remaining: this.token ? 5000 : 60,
        limit: this.token ? 5000 : 60,
        resetTime: new Date(Date.now() + 3600000),
        isAuthenticated: !!this.token
      };
    }
  }

  static async validateToken(): Promise<boolean> {
    if (!this.token) return false;
    
    try {
      const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'IOC-Dashboard/1.0',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}