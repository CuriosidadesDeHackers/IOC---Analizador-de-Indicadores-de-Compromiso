import React, { useState, useEffect } from 'react';
import { IOC, ParsedData } from '../types';
import { GitHubAPI } from '../utils/githubApi';
import { AdocParser } from '../utils/adocParser';
import IOCCard from './IOCCard';
import StatsPanel from './StatsPanel';
import FilterPanel from './FilterPanel';
import Footer from './Footer';
import RepositoryConfig from './RepositoryConfig';
import MobileMenu from './MobileMenu';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Github, Wifi, Shield, Sparkles, ExternalLink, Bug, Settings, Download, FileText, Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredIOCs, setFilteredIOCs] = useState<IOC[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{
    remaining: number;
    limit: number;
    resetTime: Date;
    isAuthenticated: boolean;
  } | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [rawContent, setRawContent] = useState<string>('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Repository configuration
  const [repoConfig, setRepoConfig] = useState({
    owner: 'cibervengadores',
    repo: 'IOCs',
    path: 'peticiones.adoc',
    branch: 'main'
  });

  // Initialize GitHub API with token from environment variables
  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    console.log('🔧 Environment check:');
    console.log('- VITE_GITHUB_TOKEN exists:', !!token);
    console.log('- Token length:', token ? token.length : 0);
    
    if (token) {
      GitHubAPI.setToken(token);
      console.log('✅ GitHub token configured successfully');
      
      // Validate token
      GitHubAPI.validateToken().then(isValid => {
        console.log('🔑 Token validation:', isValid ? 'Valid' : 'Invalid');
      });
      
      // Check rate limit
      GitHubAPI.checkRateLimit().then(limit => {
        setRateLimit(limit);
        console.log('📊 Rate limit:', limit);
      });
    } else {
      console.warn('⚠️ No GitHub token provided, using public access (rate limited)');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting IOC data fetch...');
      console.log('📂 Repository config:', repoConfig);
      
      const content = await GitHubAPI.fetchAdocFile(
        repoConfig.owner,
        repoConfig.repo,
        repoConfig.path,
        repoConfig.branch
      );
      
      console.log('✅ Content fetched successfully');
      console.log('📄 Content length:', content.length);
      console.log('📝 First 1000 characters:', content.substring(0, 1000));
      console.log('📝 Last 1000 characters:', content.substring(content.length - 1000));
      
      // Store raw content for debugging
      setRawContent(content);
      
      const parsedData = AdocParser.parseAdocContent(content);
      console.log('📊 Parsed data summary:', {
        totalIOCs: parsedData.totalCount,
        categories: Object.keys(parsedData.categories),
        fileStats: parsedData.fileStats
      });
      
      if (parsedData.totalCount === 0) {
        console.warn('⚠️ No IOCs found in the document. This might indicate a parsing issue.');
        console.log('🔍 Content sample for debugging:', content.substring(0, 2000));
      }
      
      setData(parsedData);
      setFilteredIOCs(parsedData.iocs);
      setLastUpdate(new Date());
      
      // Set next update time (10 minutes from now)
      const nextUpdateTime = new Date(Date.now() + 10 * 60 * 1000);
      setNextUpdate(nextUpdateTime);
      
      // Update rate limit info
      const limitInfo = await GitHubAPI.checkRateLimit();
      setRateLimit(limitInfo);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [repoConfig]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh triggered');
      fetchData();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [repoConfig]);

  // Update countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextUpdate) return;
      
      const now = new Date();
      const diff = nextUpdate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilUpdate(null);
        return;
      }
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeUntilUpdate(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [nextUpdate]);

  const handleFilterChange = (filters: {
    type?: string;
    severity?: string;
    search?: string;
  }) => {
    if (!data) return;
    
    let filtered = data.iocs;
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(ioc => ioc.type === filters.type);
    }
    
    if (filters.severity && filters.severity !== 'all') {
      filtered = filtered.filter(ioc => ioc.severity === filters.severity);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ioc => 
        ioc.value.toLowerCase().includes(searchTerm) ||
        ioc.description.toLowerCase().includes(searchTerm) ||
        ioc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (ioc.tableData?.hash && ioc.tableData.hash.toLowerCase().includes(searchTerm)) ||
        (ioc.tableData?.archivo && ioc.tableData.archivo.toLowerCase().includes(searchTerm)) ||
        (ioc.tableData?.deteccion && ioc.tableData.deteccion.toLowerCase().includes(searchTerm)) ||
        (ioc.tableData?.descripcion && ioc.tableData.descripcion.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredIOCs(filtered);
  };

  const handleConfigChange = (newConfig: typeof repoConfig) => {
    setRepoConfig(newConfig);
    setShowConfig(false);
    setShowMobileMenu(false);
  };

  const downloadRawContent = () => {
    if (!rawContent) return;
    
    const blob = new Blob([rawContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoConfig.owner}-${repoConfig.repo}-${repoConfig.path}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 -right-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-4 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="text-center text-white max-w-md relative z-10 animate-fade-in-up">
          <div className="relative mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 inline-block">
              <RefreshCw className="w-12 h-12 mx-auto text-blue-400 animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cargando IOCs...
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-6 opacity-90">
            Extrayendo datos de ciberseguridad desde GitHub
          </p>
          
          {/* Enhanced Connection Status */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-300 mb-3">
              <div className="p-1 bg-blue-500/20 rounded-full">
                <Github className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-medium text-xs sm:text-sm break-all">{repoConfig.owner}/{repoConfig.repo}/{repoConfig.path}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-blue-400" />
                <span>Conectado</span>
              </div>
            </div>
          </div>

          {/* Loading progress simulation */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-gray-400">Procesando indicadores de compromiso...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/50 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Error background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 -right-4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center text-white max-w-lg relative z-10 animate-fade-in-up">
          <div className="relative mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-red-500/20 inline-block">
              <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Error de Conexión
          </h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base opacity-90 break-words">{error}</p>
          
          {/* Enhanced Error Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-red-500/20 text-left">
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Github className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="break-all text-xs sm:text-sm">{repoConfig.owner}/{repoConfig.repo}/{repoConfig.path}</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Wifi className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Estado: Verificando conexión...</span>
              </div>
              
              {rateLimit && (
                <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                  <Wifi className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Rate limit: {rateLimit.remaining}/{rateLimit.limit}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mb-6 space-y-2 text-left bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="font-medium text-gray-300 mb-2">🔧 Posibles soluciones:</p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm">Verificar conectividad de red del VPS</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm">Comprobar que el repositorio sea público</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm">Validar el token de GitHub si está configurado</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm">Revisar logs del servidor web (Nginx/Apache)</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchData}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Reintentar</span>
            </button>
            
            <button
              onClick={() => setShowConfig(true)}
              className="group bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 border border-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Configurar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 animate-slide-in-left min-w-0 flex-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center space-x-2">
                  <span className="truncate">IOC Dashboard</span>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse flex-shrink-0" />
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 opacity-90 truncate">
                  Cybersecurity Intelligence Platform
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 animate-slide-in-right">
              <a
                href={`https://github.com/${repoConfig.owner}/${repoConfig.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-sm text-gray-300 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                <Github className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                <span className="truncate max-w-32">{repoConfig.owner}/{repoConfig.repo}</span>
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-3">
                {lastUpdate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-300 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="hidden xl:inline">Actualizado:</span>
                    <span>{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                )}
                
                {timeUntilUpdate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-300 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="hidden xl:inline">Próxima:</span>
                    <span className="font-mono">{timeUntilUpdate}</span>
                  </div>
                )}

                {/* Config Button */}
                <button
                  onClick={() => setShowConfig(true)}
                  className="group flex items-center space-x-2 text-sm text-gray-300 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Settings className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  <span>Config</span>
                </button>

                {/* Debug Button */}
                <button
                  onClick={() => setShowDebug(!showDebug)}
                  className="group flex items-center space-x-2 text-sm text-gray-300 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Bug className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
                  <span>Debug</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Status Bar */}
      <div className="lg:hidden bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-blue-400" />
                <span>Conectado</span>
              </div>
              {lastUpdate && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>{lastUpdate.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            {timeUntilUpdate && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="font-mono">{timeUntilUpdate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && data && (
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
                <Bug className="w-5 h-5 mr-2" />
                Panel de Debug Avanzado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <h4 className="font-bold text-blue-400 mb-2">Configuración del Repositorio</h4>
                  <div className="space-y-1 text-gray-300 text-xs">
                    <p>Owner: {repoConfig.owner}</p>
                    <p>Repo: {repoConfig.repo}</p>
                    <p>Path: {repoConfig.path}</p>
                    <p>Branch: {repoConfig.branch}</p>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <h4 className="font-bold text-green-400 mb-2">Estadísticas del Archivo</h4>
                  <div className="space-y-1 text-gray-300 text-xs">
                    <p>Líneas totales: {data.fileStats?.totalLines || 0}</p>
                    <p>Líneas no vacías: {data.fileStats?.nonEmptyLines || 0}</p>
                    <p>Líneas de contenido: {data.fileStats?.contentLines || 0}</p>
                    <p>Tablas encontradas: {data.fileStats?.tablesFound || 0}</p>
                    <p>Secciones encontradas: {data.fileStats?.sectionsFound || 0}</p>
                    <p>Contenido crudo: {rawContent.length} chars</p>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <h4 className="font-bold text-yellow-400 mb-2">IOCs por Tipo</h4>
                  <div className="space-y-1 text-gray-300 text-xs">
                    {Object.entries(data.categories).map(([type, count]) => (
                      <p key={type}>{type}: {count}</p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <h4 className="font-bold text-purple-400 mb-2">Estado del Sistema</h4>
                  <div className="space-y-1 text-gray-300 text-xs">
                    <p>Total IOCs: {data.totalCount}</p>
                    <p>IOCs filtrados: {filteredIOCs.length}</p>
                    <p>Última actualización: {lastUpdate?.toLocaleString()}</p>
                    <p>Token GitHub: {import.meta.env.VITE_GITHUB_TOKEN ? '✅' : '❌'}</p>
                    {rateLimit && (
                      <p>Rate limit: {rateLimit.remaining}/{rateLimit.limit}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 col-span-full">
                  <h4 className="font-bold text-cyan-400 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Contenido Crudo
                  </h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={downloadRawContent}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </button>
                    <span className="text-xs text-gray-400">
                      {rawContent.length.toLocaleString()} caracteres
                    </span>
                  </div>
                  <div className="bg-black/30 rounded p-2 max-h-40 overflow-y-auto">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                      {rawContent.substring(0, 2000)}
                      {rawContent.length > 2000 && '...\n\n[Contenido truncado - usa el botón de descarga para ver todo]'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {data && (
          <>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <StatsPanel data={data} filteredCount={filteredIOCs.length} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mt-6 sm:mt-8">
              <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <FilterPanel onFilterChange={handleFilterChange} categories={data.categories} />
              </div>
              
              <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Indicators of Compromise
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-base sm:text-lg">
                      Mostrando{' '}
                      <span className="font-bold text-blue-400">{filteredIOCs.length.toLocaleString()}</span>
                      {' '}de{' '}
                      <span className="font-bold text-purple-400">{data.totalCount.toLocaleString()}</span>
                      {' '}IOCs extraídos del repositorio
                    </p>
                    {data.fileStats && (
                      <p className="text-gray-400 text-sm sm:text-base opacity-75">
                        Procesadas {data.fileStats.nonEmptyLines.toLocaleString()} líneas del archivo
                        {data.fileStats.tablesFound > 0 && ` • ${data.fileStats.tablesFound} tablas encontradas`}
                        {data.fileStats.sectionsFound > 0 && ` • ${data.fileStats.sectionsFound} secciones encontradas`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {filteredIOCs.map((ioc, index) => (
                    <div 
                      key={ioc.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${0.4 + (index * 0.05)}s` }}
                    >
                      <IOCCard ioc={ioc} />
                    </div>
                  ))}
                </div>
                
                {filteredIOCs.length === 0 && data.totalCount === 0 && (
                  <div className="text-center py-16 animate-fade-in-up">
                    <div className="relative mb-6">
                      <div className="p-4 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl backdrop-blur-sm border border-gray-500/20 inline-block">
                        <AlertCircle className="w-16 h-16 mx-auto text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      No se encontraron IOCs
                    </h3>
                    <p className="text-gray-400 mb-6 text-base max-w-md mx-auto">
                      El archivo no contiene IOCs válidos o el formato no es reconocido
                    </p>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 inline-block">
                      <div className="text-sm text-gray-300 space-y-1">
                        <p className="font-medium break-all">Verificando: {repoConfig.owner}/{repoConfig.repo}/{repoConfig.path}</p>
                        {data.fileStats && (
                          <p>Líneas procesadas: {data.fileStats.nonEmptyLines.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {filteredIOCs.length === 0 && data.totalCount > 0 && (
                  <div className="text-center py-16 animate-fade-in-up">
                    <div className="relative mb-6">
                      <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/20 inline-block">
                        <AlertCircle className="w-16 h-16 mx-auto text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      No se encontraron IOCs con los filtros aplicados
                    </h3>
                    <p className="text-gray-400 text-base max-w-md mx-auto">
                      Ajusta los filtros para ver más resultados
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        repoConfig={repoConfig}
        onShowConfig={() => {
          setShowConfig(true);
          setShowMobileMenu(false);
        }}
        onShowDebug={() => {
          setShowDebug(!showDebug);
          setShowMobileMenu(false);
        }}
        showDebug={showDebug}
        lastUpdate={lastUpdate}
        timeUntilUpdate={timeUntilUpdate}
        rateLimit={rateLimit}
      />

      {/* Repository Configuration Modal */}
      <RepositoryConfig
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        onConfigChange={handleConfigChange}
        currentConfig={repoConfig}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;