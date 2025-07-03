import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
const FilterPanel = ({ onFilterChange, categories }) => {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const handleFilterChange = (newFilters) => {
        const updatedFilters = {
            type: newFilters.type !== undefined ? newFilters.type : selectedType,
            severity: newFilters.severity !== undefined ? newFilters.severity : selectedSeverity,
            search: newFilters.search !== undefined ? newFilters.search : search,
        };
        if (newFilters.type !== undefined)
            setSelectedType(newFilters.type);
        if (newFilters.severity !== undefined)
            setSelectedSeverity(newFilters.severity);
        if (newFilters.search !== undefined)
            setSearch(newFilters.search);
        onFilterChange(updatedFilters);
    };
    const clearFilters = () => {
        setSearch('');
        setSelectedType('all');
        setSelectedSeverity('all');
        onFilterChange({ type: 'all', severity: 'all', search: '' });
    };
    const hasActiveFilters = search || selectedType !== 'all' || selectedSeverity !== 'all';
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-cyber p-4 sm:p-6 sticky top-4 sm:top-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [_jsxs("h3", { className: "text-base sm:text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(Filter, { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2" }), "Filtros"] }), hasActiveFilters && (_jsxs("button", { onClick: clearFilters, className: "text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1", children: [_jsx(X, { className: "w-4 h-4" }), _jsx("span", { children: "Limpiar" })] }))] }), _jsxs("div", { className: "mb-4 sm:mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Buscar" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", value: search, onChange: (e) => handleFilterChange({ search: e.target.value }), placeholder: "Buscar IOCs...", className: "w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] }), _jsxs("div", { className: "mb-4 sm:mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo" }), _jsxs("select", { value: selectedType, onChange: (e) => handleFilterChange({ type: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "all", children: "Todos los tipos" }), Object.entries(categories).map(([type, count]) => (_jsxs("option", { value: type, children: [type.charAt(0).toUpperCase() + type.slice(1), " (", count.toLocaleString(), ")"] }, type)))] })] }), _jsxs("div", { className: "mb-4 sm:mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Severidad" }), _jsxs("select", { value: selectedSeverity, onChange: (e) => handleFilterChange({ severity: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "all", children: "Todas las severidades" }), _jsx("option", { value: "critical", children: "Cr\u00EDtico" }), _jsx("option", { value: "high", children: "Alto" }), _jsx("option", { value: "medium", children: "Medio" }), _jsx("option", { value: "low", children: "Bajo" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-3", children: "Distribuci\u00F3n por Tipo" }), _jsx("div", { className: "space-y-2", children: Object.entries(categories).map(([type, count]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs sm:text-sm text-gray-600 capitalize", children: type }), _jsx("span", { className: "text-xs sm:text-sm font-medium text-gray-900", children: count.toLocaleString() })] }, type))) })] })] }));
};
export default FilterPanel;
