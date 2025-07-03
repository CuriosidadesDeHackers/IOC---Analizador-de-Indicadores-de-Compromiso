import React, { useState } from 'react';
import { Search, Filter, X, Sparkles, TrendingUp } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: {
    type?: string;
    severity?: string;
    search?: string;
  }) => void;
  categories: Record<string, number>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, categories }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const handleFilterChange = (newFilters: Partial<{ type: string; severity: string; search: string }>) => {
    const updatedFilters = {
      type: newFilters.type !== undefined ? newFilters.type : selectedType,
      severity: newFilters.severity !== undefined ? newFilters.severity : selectedSeverity,
      search: newFilters.search !== undefined ? newFilters.search : search,
    };

    if (newFilters.type !== undefined) setSelectedType(newFilters.type);
    if (newFilters.severity !== undefined) setSelectedSeverity(newFilters.severity);
    if (newFilters.search !== undefined) setSearch(newFilters.search);

    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedSeverity('all');
    onFilterChange({ type: 'all', severity: 'all', search: '' });
  };

  const hasActiveFilters = search || selectedType !== 'all' || selectedSeverity !== 'all';

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 sticky top-4 sm:top-8 border border-white/10 hover:border-white/20 transition-all duration-500 group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center group-hover:text-blue-200 transition-colors duration-300">
            <div className="relative group/icon mr-2 sm:mr-3">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
              <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover/icon:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="truncate">Filtros</span>
            {hasActiveFilters && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-yellow-400 animate-pulse flex-shrink-0" />}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="group/clear flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover/clear:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>

        {/* Enhanced Search */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
            Buscar
          </label>
          <div className="relative group/search">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within/search:opacity-100 transition duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within/search:text-blue-400 transition-colors duration-200" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Buscar IOCs..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Type Filter */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
            Tipo
          </label>
          <div className="relative group/select">
            <select
              value={selectedType}
              onChange={(e) => handleFilterChange({ type: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300 hover:bg-white/15 focus:bg-white/15 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">Todos los tipos</option>
              {Object.entries(categories).map(([type, count]) => (
                <option key={type} value={type} className="bg-slate-800 text-white">
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count.toLocaleString()})
                </option>
              ))}
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 group-focus-within/select:border-t-blue-400 transition-colors duration-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Severity Filter */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
            Severidad
          </label>
          <div className="relative group/select">
            <select
              value={selectedSeverity}
              onChange={(e) => handleFilterChange({ severity: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300 hover:bg-white/15 focus:bg-white/15 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">Todas las severidades</option>
              <option value="critical" className="bg-slate-800 text-red-300">🔴 Crítico</option>
              <option value="high" className="bg-slate-800 text-orange-300">🟠 Alto</option>
              <option value="medium" className="bg-slate-800 text-yellow-300">🟡 Medio</option>
              <option value="low" className="bg-slate-800 text-green-300">🟢 Bajo</option>
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 group-focus-within/select:border-t-blue-400 transition-colors duration-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Type Distribution */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-colors duration-300">
          <h4 className="text-xs sm:text-sm font-bold text-gray-300 mb-3 sm:mb-4 uppercase tracking-wide flex items-center">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-400" />
            <span className="truncate">Distribución por Tipo</span>
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(categories).map(([type, count]) => {
              const percentage = (count / Object.values(categories).reduce((a, b) => a + b, 0)) * 100;
              return (
                <div key={type} className="group/item">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm text-gray-300 capitalize font-medium group-hover/item:text-white transition-colors duration-200 truncate">
                      {type}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-blue-400 flex-shrink-0 ml-2">
                      {count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div 
                      className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 transform origin-left"
                      style={{ 
                        width: `${percentage}%`,
                        animationDelay: `${Object.keys(categories).indexOf(type) * 0.1}s`
                      }}
                    ></div>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% del total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;