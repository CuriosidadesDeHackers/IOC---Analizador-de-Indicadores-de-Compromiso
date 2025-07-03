import React, { useState, useEffect } from 'react';
import { IOC, ParsedData } from '../types';
import { GitHubAPI } from '../utils/githubApi';
import { AdocParser } from '../utils/adocParser';
import IOCCard from './IOCCard';
import StatsPanel from './StatsPanel';
import FilterPanel from './FilterPanel';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Github } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredIOCs, setFilteredIOCs] = useState<IOC[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState<string | null>(null);

  // Initialize GitHub API with token from environment variables
  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    console.log('Environment variables check:');
    console.log('VITE_GITHUB_TOKEN exists:', !!token);
    console.log('VITE_GITHUB_TOKEN length:', token ? token.length : 0);
    
    if (token) {
      GitHubAPI.setToken(token);
      console.log('GitHub token configured successfully');
    } else {
      console.warn('No GitHub token provided, using public access (rate limited)');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching IOC data from GitHub...');
      
      const content = await GitHubAPI.fetchAdocFile(
        'cibervengadores',
        'IOCs',
        'peticiones.adoc',
        'main'
      );
      
      console.log('Content fetched successfully, length:', content.length);
      console.log('First 500 characters:', content.substring(0, 500));
      
      const parsedData = AdocParser.parseAdocContent(content);
      console.log('Parsed data:', parsedData);
      
      if (parsedData.totalCount === 0) {
        console.warn('No IOCs found in the document. This might indicate a parsing issue.');
      }
      
      setData(parsedData);
      setFilteredIOCs(parsedData.iocs);
      setLastUpdate(new Date());
      
      // Set next update time (10 minutes from now)
      const nextUpdateTime = new Date(Date.now() + 10 * 60 * 1000);
      setNextUpdate(nextUpdateTime);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refresh triggered');
      fetchData();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Cargando IOCs...</h2>
          <p className="text-gray-300 text-sm sm:text-base">Extrayendo datos de ciberseguridad desde GitHub</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400">
            <Github className="w-4 h-4" />
            <span>cibervengadores/IOCs/peticiones.adoc</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Error de Conexión</h2>
          <p className="text-gray-300 mb-4 text-sm sm:text-base">{error}</p>
          <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Github className="w-4 h-4" />
              <span>cibervengadores/IOCs/peticiones.adoc</span>
            </div>
            <p>Si el repositorio es privado, configura VITE_GITHUB_TOKEN en las variables de entorno.</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>Token configurado: {import.meta.env.VITE_GITHUB_TOKEN ? 'Sí' : 'No'}</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:h-16 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">IOC Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-300">Cybersecurity Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                <Github className="w-4 h-4" />
                <span className="truncate">cibervengadores/IOCs</span>
              </div>
              
              {lastUpdate && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              )}
              
              {timeUntilUpdate && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Próxima actualización: {timeUntilUpdate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {data && (
          <>
            <StatsPanel data={data} filteredCount={filteredIOCs.length} />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
              <div className="lg:col-span-1">
                <FilterPanel onFilterChange={handleFilterChange} categories={data.categories} />
              </div>
              
              <div className="lg:col-span-3">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Indicators of Compromise
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Mostrando {filteredIOCs.length.toLocaleString()} de {data.totalCount.toLocaleString()} IOCs extraídos del repositorio
                  </p>
                  {data.fileStats && (
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Procesadas {data.fileStats.nonEmptyLines.toLocaleString()} líneas del archivo
                    </p>
                  )}
                </div>
                
                <div className="grid gap-4 sm:gap-6">
                  {filteredIOCs.map((ioc) => (
                    <IOCCard key={ioc.id} ioc={ioc} />
                  ))}
                </div>
                
                {filteredIOCs.length === 0 && data.totalCount === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No se encontraron IOCs
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base">
                      El archivo no contiene IOCs válidos o el formato no es reconocido
                    </p>
                    <div className="text-xs sm:text-sm text-gray-500">
                      <p>Verificando: cibervengadores/IOCs/peticiones.adoc</p>
                      {data.fileStats && (
                        <p className="mt-1">Líneas procesadas: {data.fileStats.nonEmptyLines.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {filteredIOCs.length === 0 && data.totalCount > 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No se encontraron IOCs con los filtros aplicados
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Ajusta los filtros para ver más resultados
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
