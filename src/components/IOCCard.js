import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Shield, Hash, Globe, Mail, FileText, Database, Link, Copy, Check, Calendar, Tag, Info, ChevronDown, ChevronUp, ExternalLink, File, Search, AlertOctagon } from 'lucide-react';
const IOCCard = ({ ioc }) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const getTypeIcon = (type) => {
        switch (type) {
            case 'hash':
                return _jsx(Hash, { className: "w-4 h-4" });
            case 'ip':
                return _jsx(Globe, { className: "w-4 h-4" });
            case 'domain':
                return _jsx(Globe, { className: "w-4 h-4" });
            case 'url':
                return _jsx(Link, { className: "w-4 h-4" });
            case 'email':
                return _jsx(Mail, { className: "w-4 h-4" });
            case 'file':
                return _jsx(FileText, { className: "w-4 h-4" });
            case 'registry':
                return _jsx(Database, { className: "w-4 h-4" });
            default:
                return _jsx(Shield, { className: "w-4 h-4" });
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getSeverityBorder = (severity) => {
        switch (severity) {
            case 'critical':
                return 'border-l-red-500';
            case 'high':
                return 'border-l-orange-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };
    const getSeverityText = (severity) => {
        switch (severity) {
            case 'critical':
                return 'Crítico';
            case 'high':
                return 'Alto';
            case 'medium':
                return 'Medio';
            case 'low':
                return 'Bajo';
            default:
                return severity;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'pending':
                return 'Pendiente';
            default:
                return status;
        }
    };
    const getTypeText = (type) => {
        switch (type) {
            case 'hash':
                return 'Hash';
            case 'ip':
                return 'Dirección IP';
            case 'domain':
                return 'Dominio';
            case 'url':
                return 'URL';
            case 'email':
                return 'Email';
            case 'file':
                return 'Archivo';
            case 'registry':
                return 'Registro';
            case 'other':
                return 'Otro';
            default:
                return type;
        }
    };
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(ioc.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    const isUrl = ioc.type === 'url';
    const isDomain = ioc.type === 'domain';
    const canOpenExternal = isUrl || isDomain;
    const openExternal = () => {
        if (isUrl) {
            window.open(ioc.value, '_blank', 'noopener,noreferrer');
        }
        else if (isDomain) {
            window.open(`https://${ioc.value}`, '_blank', 'noopener,noreferrer');
        }
    };
    // Check if we have structured table data
    const hasTableData = ioc.tableData && Object.keys(ioc.tableData).some(key => ioc.tableData[key] && ioc.tableData[key].trim().length > 0);
    return (_jsx("div", { className: `bg-white rounded-lg border-l-4 ${getSeverityBorder(ioc.severity)} shadow-cyber hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden`, children: _jsxs("div", { className: "p-3 sm:p-4", children: [_jsx("div", { className: "flex flex-col space-y-2 mb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2 min-w-0 flex-1", children: [_jsx("div", { className: "p-1.5 bg-cyber-blue/10 rounded-lg text-cyber-blue flex-shrink-0", children: getTypeIcon(ioc.type) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 text-sm truncate", children: getTypeText(ioc.type) }), _jsxs("div", { className: "flex items-center space-x-1.5 mt-0.5", children: [_jsx("span", { className: `inline-block w-1.5 h-1.5 rounded-full ${getSeverityColor(ioc.severity)} flex-shrink-0` }), _jsx("span", { className: "text-xs text-gray-600 font-medium", children: getSeverityText(ioc.severity) })] })] })] }), _jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(ioc.status)} flex-shrink-0 ml-2`, children: getStatusText(ioc.status) })] }) }), _jsx("div", { className: "mb-3", children: _jsx("div", { className: "bg-gray-50 rounded-lg p-2 border", children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "overflow-hidden", children: _jsx("code", { className: "text-xs font-mono text-gray-800 break-all leading-relaxed block", children: ioc.value }) }), _jsxs("div", { className: "flex items-center justify-end space-x-1 pt-1 border-t border-gray-200", children: [canOpenExternal && (_jsx("button", { onClick: openExternal, className: "p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors", title: "Abrir", children: _jsx(ExternalLink, { className: "w-3.5 h-3.5" }) })), _jsx("button", { onClick: copyToClipboard, className: "p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors", title: "Copiar", children: copied ? _jsx(Check, { className: "w-3.5 h-3.5" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }) }) }), hasTableData && (_jsx("div", { className: "mb-3", children: _jsxs("div", { className: "bg-blue-50 rounded-lg p-2 border border-blue-200", children: [_jsxs("h4", { className: "font-medium text-blue-900 mb-2 flex items-center text-sm", children: [_jsx(Database, { className: "w-3.5 h-3.5 mr-1.5 flex-shrink-0" }), _jsx("span", { className: "truncate", children: "Datos estructurados" })] }), _jsxs("div", { className: "space-y-2", children: [ioc.tableData?.hash && (_jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsxs("div", { className: "flex items-center space-x-1.5 mb-1", children: [_jsx(Hash, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0" }), _jsx("span", { className: "text-xs font-medium text-blue-800", children: "Hash:" })] }), _jsx("div", { className: "overflow-hidden", children: _jsx("code", { className: "text-xs text-blue-900 break-all block leading-relaxed", children: ioc.tableData.hash }) })] })), ioc.tableData?.archivo && (_jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsxs("div", { className: "flex items-center space-x-1.5 mb-1", children: [_jsx(File, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0" }), _jsx("span", { className: "text-xs font-medium text-blue-800", children: "Archivo:" })] }), _jsx("div", { className: "overflow-hidden", children: _jsx("span", { className: "text-xs text-blue-900 break-all block leading-relaxed", children: ioc.tableData.archivo }) })] })), ioc.tableData?.deteccion && (_jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsxs("div", { className: "flex items-center space-x-1.5 mb-1", children: [_jsx(Search, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0" }), _jsx("span", { className: "text-xs font-medium text-blue-800", children: "Detecci\u00F3n:" })] }), _jsx("div", { className: "overflow-hidden", children: _jsx("span", { className: "text-xs text-blue-900 break-words block leading-relaxed", children: ioc.tableData.deteccion }) })] })), ioc.tableData?.descripcion && (_jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsxs("div", { className: "flex items-center space-x-1.5 mb-1", children: [_jsx(AlertOctagon, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0" }), _jsx("span", { className: "text-xs font-medium text-blue-800", children: "Descripci\u00F3n:" })] }), _jsx("div", { className: "overflow-hidden", children: _jsx("span", { className: "text-xs text-blue-900 break-words block leading-relaxed", children: ioc.tableData.descripcion }) })] }))] })] }) })), _jsx("div", { className: "mb-3", children: _jsx("div", { className: "overflow-hidden", children: _jsx("p", { className: "text-xs text-gray-700 leading-relaxed break-words", children: ioc.description }) }) }), ioc.tags.length > 0 && (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center space-x-1.5 mb-1.5", children: [_jsx(Tag, { className: "w-3.5 h-3.5 text-gray-500 flex-shrink-0" }), _jsx("span", { className: "text-xs font-medium text-gray-600 uppercase tracking-wide", children: "Etiquetas" })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: ioc.tags.map((tag, index) => (_jsx("span", { className: "px-1.5 py-0.5 bg-cyber-blue/10 text-cyber-blue text-xs rounded-full font-medium border border-cyber-blue/20 break-all max-w-full", children: tag }, index))) })] })), _jsxs("div", { className: "border-t pt-3", children: [_jsxs("button", { onClick: () => setExpanded(!expanded), className: "flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-1.5 min-w-0 flex-1", children: [_jsx(Info, { className: "w-3.5 h-3.5 flex-shrink-0" }), _jsx("span", { className: "text-xs truncate", children: "Informaci\u00F3n t\u00E9cnica" })] }), expanded ? _jsx(ChevronUp, { className: "w-3.5 h-3.5 flex-shrink-0" }) : _jsx(ChevronDown, { className: "w-3.5 h-3.5 flex-shrink-0" })] }), expanded && (_jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-2 space-y-2", children: [_jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "ID:" }), _jsx("div", { className: "overflow-hidden", children: _jsx("p", { className: "text-gray-800 font-mono text-xs break-all", children: ioc.id }) })] }), _jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "Tipo:" }), _jsx("p", { className: "text-gray-800 text-xs", children: getTypeText(ioc.type) })] }), _jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "Estado:" }), _jsx("p", { className: "text-gray-800 text-xs", children: getStatusText(ioc.status) })] }), _jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "Severidad:" }), _jsx("p", { className: "text-gray-800 text-xs", children: getSeverityText(ioc.severity) })] }), _jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "Fuente:" }), _jsx("div", { className: "overflow-hidden", children: _jsx("p", { className: "text-gray-800 text-xs break-words", children: ioc.source }) })] }), _jsxs("div", { className: "bg-white rounded p-2 border", children: [_jsx("span", { className: "font-medium text-gray-600 text-xs block mb-1", children: "Fecha:" }), _jsxs("div", { className: "flex items-center space-x-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-gray-500 flex-shrink-0" }), _jsx("p", { className: "text-gray-800 text-xs", children: ioc.dateAdded.toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            }) })] })] })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-2 border border-blue-200", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-1.5 text-xs", children: "Contexto" }), _jsxs("ul", { className: "text-blue-800 text-xs space-y-0.5 leading-relaxed", children: [_jsx("li", { children: "\u2022 IOC del repositorio CiberVengadores" }), _jsx("li", { children: "\u2022 Clasificaci\u00F3n autom\u00E1tica" }), _jsx("li", { children: "\u2022 Etiquetas auto-generadas" }), ioc.type === 'hash' && _jsx("li", { children: "\u2022 MD5/SHA1/SHA256/SHA512" }), ioc.type === 'ip' && _jsx("li", { children: "\u2022 Incluye notaci\u00F3n CIDR" }), ioc.type === 'domain' && _jsx("li", { children: "\u2022 Validado RFC" }), ioc.type === 'url' && _jsx("li", { children: "\u2022 HTTP/HTTPS verificado" }), hasTableData && _jsx("li", { children: "\u2022 Datos estructurados" })] })] })] }))] })] }) }));
};
export default IOCCard;
