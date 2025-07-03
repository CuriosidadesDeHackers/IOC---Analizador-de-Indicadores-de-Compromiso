import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { GitHubAPI } from '../utils/githubApi';
import { AdocParser } from '../utils/adocParser';
import IOCCard from './IOCCard';
import StatsPanel from './StatsPanel';
import FilterPanel from './FilterPanel';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Github } from 'lucide-react';
const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredIOCs, setFilteredIOCs] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [nextUpdate, setNextUpdate] = useState(null);
    const [timeUntilUpdate, setTimeUntilUpdate] = useState(null);
    // Initialize GitHub API with token from environment variables
    useEffect(() => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        console.log('Environment variables check:');
        console.log('VITE_GITHUB_TOKEN exists:', !!token);
        console.log('VITE_GITHUB_TOKEN length:', token ? token.length : 0);
        if (token) {
            GitHubAPI.setToken(token);
            console.log('GitHub token configured successfully');
        }
        else {
            console.warn('No GitHub token provided, using public access (rate limited)');
        }
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching IOC data from GitHub...');
            const content = await GitHubAPI.fetchAdocFile('cibervengadores', 'IOCs', 'peticiones.adoc', 'main');
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error fetching data:', err);
        }
        finally {
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
            if (!nextUpdate)
                return;
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
    const handleFilterChange = (filters) => {
        if (!data)
            return;
        let filtered = data.iocs;
        if (filters.type && filters.type !== 'all') {
            filtered = filtered.filter(ioc => ioc.type === filters.type);
        }
        if (filters.severity && filters.severity !== 'all') {
            filtered = filtered.filter(ioc => ioc.severity === filters.severity);
        }
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(ioc => ioc.value.toLowerCase().includes(searchTerm) ||
                ioc.description.toLowerCase().includes(searchTerm) ||
                ioc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                (ioc.tableData?.hash && ioc.tableData.hash.toLowerCase().includes(searchTerm)) ||
                (ioc.tableData?.archivo && ioc.tableData.archivo.toLowerCase().includes(searchTerm)) ||
                (ioc.tableData?.deteccion && ioc.tableData.deteccion.toLowerCase().includes(searchTerm)) ||
                (ioc.tableData?.descripcion && ioc.tableData.descripcion.toLowerCase().includes(searchTerm)));
        }
        setFilteredIOCs(filtered);
    };
    if (loading && !data) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center text-white max-w-md", children: [_jsx(RefreshCw, { className: "w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" }), _jsx("h2", { className: "text-xl sm:text-2xl font-bold mb-2", children: "Cargando IOCs..." }), _jsx("p", { className: "text-gray-300 text-sm sm:text-base", children: "Extrayendo datos de ciberseguridad desde GitHub" }), _jsxs("div", { className: "mt-4 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400", children: [_jsx(Github, { className: "w-4 h-4" }), _jsx("span", { children: "cibervengadores/IOCs/peticiones.adoc" })] })] }) }));
    }
    if (error && !data) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center text-white max-w-md", children: [_jsx(AlertCircle, { className: "w-12 h-12 mx-auto mb-4 text-red-400" }), _jsx("h2", { className: "text-xl sm:text-2xl font-bold mb-2", children: "Error de Conexi\u00F3n" }), _jsx("p", { className: "text-gray-300 mb-4 text-sm sm:text-base", children: error }), _jsxs("div", { className: "text-xs sm:text-sm text-gray-400 mb-4 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(Github, { className: "w-4 h-4" }), _jsx("span", { children: "cibervengadores/IOCs/peticiones.adoc" })] }), _jsx("p", { children: "Si el repositorio es privado, configura VITE_GITHUB_TOKEN en las variables de entorno." }), _jsx("div", { className: "text-xs text-gray-500 mt-2", children: _jsxs("p", { children: ["Token configurado: ", import.meta.env.VITE_GITHUB_TOKEN ? 'Sí' : 'No'] }) })] }), _jsxs("button", { onClick: fetchData, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto", children: [_jsx(RefreshCw, { className: "w-5 h-5" }), _jsx("span", { children: "Reintentar" })] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-cyber-dark via-slate-900 to-cyber-blue", children: [_jsx("header", { className: "bg-white/10 backdrop-blur-md border-b border-white/20", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:h-16 space-y-4 sm:space-y-0", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-600 rounded-lg", children: _jsx(AlertCircle, { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg sm:text-xl font-bold text-white", children: "IOC Dashboard" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-300", children: "CiberVengadores Intelligence Platform" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-xs sm:text-sm text-gray-300", children: [_jsx(Github, { className: "w-4 h-4" }), _jsx("span", { className: "truncate", children: "cibervengadores/IOCs" })] }), lastUpdate && (_jsxs("div", { className: "flex items-center space-x-2 text-xs sm:text-sm text-gray-300", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-400" }), _jsxs("span", { children: ["Actualizado: ", lastUpdate.toLocaleTimeString()] })] })), timeUntilUpdate && (_jsxs("div", { className: "flex items-center space-x-2 text-xs sm:text-sm text-gray-300", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-400" }), _jsxs("span", { children: ["Pr\u00F3xima actualizaci\u00F3n: ", timeUntilUpdate] })] }))] })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8", children: data && (_jsxs(_Fragment, { children: [_jsx(StatsPanel, { data: data, filteredCount: filteredIOCs.length }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx(FilterPanel, { onFilterChange: handleFilterChange, categories: data.categories }) }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "mb-4 sm:mb-6", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-white mb-2", children: "Indicators of Compromise" }), _jsxs("p", { className: "text-gray-300 text-sm sm:text-base", children: ["Mostrando ", filteredIOCs.length.toLocaleString(), " de ", data.totalCount.toLocaleString(), " IOCs extra\u00EDdos del repositorio"] }), data.fileStats && (_jsxs("p", { className: "text-gray-400 text-xs sm:text-sm mt-1", children: ["Procesadas ", data.fileStats.nonEmptyLines.toLocaleString(), " l\u00EDneas del archivo"] }))] }), _jsx("div", { className: "grid gap-4 sm:gap-6", children: filteredIOCs.map((ioc) => (_jsx(IOCCard, { ioc: ioc }, ioc.id))) }), filteredIOCs.length === 0 && data.totalCount === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No se encontraron IOCs" }), _jsx("p", { className: "text-gray-400 mb-4 text-sm sm:text-base", children: "El archivo no contiene IOCs v\u00E1lidos o el formato no es reconocido" }), _jsxs("div", { className: "text-xs sm:text-sm text-gray-500", children: [_jsx("p", { children: "Verificando: cibervengadores/IOCs/peticiones.adoc" }), data.fileStats && (_jsxs("p", { className: "mt-1", children: ["L\u00EDneas procesadas: ", data.fileStats.nonEmptyLines.toLocaleString()] }))] })] })), filteredIOCs.length === 0 && data.totalCount > 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No se encontraron IOCs con los filtros aplicados" }), _jsx("p", { className: "text-gray-400 text-sm sm:text-base", children: "Ajusta los filtros para ver m\u00E1s resultados" })] }))] })] })] })) })] }));
};
export default Dashboard;
