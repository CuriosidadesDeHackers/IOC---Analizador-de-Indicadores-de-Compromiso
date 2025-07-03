import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-cyber p-4 sm:p-6 sticky top-4 sm:top-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Buscar IOCs..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleFilterChange({ type: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos los tipos</option>
          {Object.entries(categories).map(([type, count]) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} ({count.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      {/* Severity Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Severidad
        </label>
        <select
          value={selectedSeverity}
          onChange={(e) => handleFilterChange({ severity: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todas las severidades</option>
          <option value="critical">Crítico</option>
          <option value="high">Alto</option>
          <option value="medium">Medio</option>
          <option value="low">Bajo</option>
        </select>
      </div>

      {/* Type Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Distribución por Tipo
        </h4>
        <div className="space-y-2">
          {Object.entries(categories).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 capitalize">{type}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">{count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;