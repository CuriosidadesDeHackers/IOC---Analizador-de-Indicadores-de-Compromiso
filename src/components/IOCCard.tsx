import React, { useState } from 'react';
import { IOC } from '../types';
import {
  Shield, Hash, Globe, Mail, FileText, Database, Link,
  Copy, Check, Calendar, Tag, Info, ChevronDown, ChevronUp, ExternalLink,
  Search, AlertOctagon, File as FileIcon, Sparkles
} from 'lucide-react';

interface IOCCardProps {
  ioc: IOC;
}

const IOCCard: React.FC<IOCCardProps> = ({ ioc }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = (type: IOC['type']) => {
    switch (type) {
      case 'hash':
        return <Hash className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'ip':
        return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'domain':
        return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'url':
        return <Link className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'email':
        return <Mail className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'file':
        return <FileText className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'registry':
        return <Database className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Shield className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getSeverityColor = (severity: IOC['severity']) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      case 'low':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityBorder = (severity: IOC['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500 shadow-red-500/25';
      case 'high':
        return 'border-l-orange-500 shadow-orange-500/25';
      case 'medium':
        return 'border-l-yellow-500 shadow-yellow-500/25';
      case 'low':
        return 'border-l-green-500 shadow-green-500/25';
      default:
        return 'border-l-gray-500 shadow-gray-500/25';
    }
  };

  const getSeverityText = (severity: IOC['severity']) => {
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

  const getStatusColor = (status: IOC['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: IOC['status']) => {
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

  const getTypeText = (type: IOC['type']) => {
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
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isUrl = ioc.type === 'url';
  const isDomain = ioc.type === 'domain';
  const canOpenExternal = isUrl || isDomain;

  const openExternal = () => {
    if (isUrl) {
      window.open(ioc.value, '_blank', 'noopener,noreferrer');
    } else if (isDomain) {
      window.open(`https://${ioc.value}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Check if we have structured table data
  const hasTableData = ioc.tableData && Object.keys(ioc.tableData).some(key => 
    ioc.tableData![key] && ioc.tableData![key]!.trim().length > 0
  );

  return (
    <div className={`group bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border-l-4 ${getSeverityBorder(ioc.severity)} shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in overflow-hidden border border-white/10 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] transform`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-3 sm:p-4 lg:p-6">
        {/* Enhanced Header Section */}
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="relative group/icon">
                <div className={`absolute -inset-1 bg-gradient-to-r ${getSeverityColor(ioc.severity)} rounded-lg sm:rounded-xl blur opacity-75 group-hover/icon:opacity-100 transition duration-300`}></div>
                <div className={`relative p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br ${getSeverityColor(ioc.severity)} rounded-lg sm:rounded-xl text-white transform group-hover/icon:scale-110 transition-transform duration-300`}>
                  {getTypeIcon(ioc.type)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2 truncate">
                  <span>{getTypeText(ioc.type)}</span>
                  {ioc.severity === 'critical' && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse flex-shrink-0" />}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${getSeverityColor(ioc.severity)} animate-pulse`}></div>
                  <span className="text-xs sm:text-sm text-gray-300 font-medium">
                    {getSeverityText(ioc.severity)}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl border backdrop-blur-sm ${getStatusColor(ioc.status)} flex-shrink-0 ml-2 sm:ml-3 transform hover:scale-105 transition-transform duration-200`}>
              {getStatusText(ioc.status)}
            </span>
          </div>
        </div>

        {/* Enhanced IOC Value Section */}
        <div className="mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 group-hover:border-white/20 transition-colors duration-300">
            <div className="space-y-3">
              <div className="overflow-hidden">
                <code className="text-xs sm:text-sm font-mono text-gray-200 break-all leading-relaxed block group-hover:text-white transition-colors duration-300">
                  {ioc.value}
                </code>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
                {canOpenExternal && (
                  <button
                    onClick={openExternal}
                    className="group/btn p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Abrir"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  className="group/btn p-1.5 sm:p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Copiar"
                >
                  {copied ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 animate-bounce" />
                  ) : (
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table Data Section */}
        {hasTableData && (
          <div className="mb-4">
            <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20 group-hover:border-blue-500/30 transition-colors duration-300">
              <h4 className="font-bold text-blue-200 mb-3 flex items-center text-xs sm:text-sm">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Datos estructurados</span>
                <div className="ml-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full animate-ping"></div>
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {ioc.tableData?.hash && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10 hover:border-blue-500/30 transition-colors duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Hash:</span>
                    </div>
                    <div className="overflow-hidden">
                      <code className="text-xs sm:text-sm text-blue-100 break-all block leading-relaxed">
                        {ioc.tableData.hash}
                      </code>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.archivo && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10 hover:border-blue-500/30 transition-colors duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Archivo:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs sm:text-sm text-blue-100 break-all block leading-relaxed">
                        {ioc.tableData.archivo}
                      </span>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.deteccion && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10 hover:border-blue-500/30 transition-colors duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <Search className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Detección:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs sm:text-sm text-blue-100 break-words block leading-relaxed">
                        {ioc.tableData.deteccion}
                      </span>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.descripcion && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10 hover:border-blue-500/30 transition-colors duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertOctagon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Descripción:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs sm:text-sm text-blue-100 break-words block leading-relaxed">
                        {ioc.tableData.descripcion}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Description */}
        <div className="mb-4">
          <div className="overflow-hidden">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words group-hover:text-gray-200 transition-colors duration-300">
              {ioc.description}
            </p>
          </div>
        </div>

        {/* Enhanced Tags */}
        {ioc.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Etiquetas</span>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {ioc.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-500/30 break-all max-w-full backdrop-blur-sm hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 transform transition-all duration-200 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Expandable Details Section */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-300 hover:text-white transition-all duration-300 group/expand p-2 rounded-lg hover:bg-white/5"
          >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 group-hover/expand:rotate-12 transition-transform duration-300" />
              <span className="text-xs sm:text-sm truncate">Información técnica</span>
            </div>
            <div className="transform transition-transform duration-300 group-hover/expand:scale-110">
              {expanded ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              )}
            </div>
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 animate-slide-down">
              {/* Enhanced IOC Details Grid */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 border border-white/10">
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                  <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-2">ID:</span>
                  <div className="overflow-hidden">
                    <p className="text-gray-200 font-mono text-xs break-all">{ioc.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                    <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-1">Tipo:</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{getTypeText(ioc.type)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                    <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-1">Estado:</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{getStatusText(ioc.status)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                    <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-1">Severidad:</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{getSeverityText(ioc.severity)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                    <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-1">Fecha:</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-gray-200 text-xs sm:text-sm">{ioc.dateAdded.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/10">
                  <span className="font-bold text-gray-300 text-xs uppercase tracking-wide block mb-2">Fuente:</span>
                  <div className="overflow-hidden">
                    <p className="text-gray-200 text-xs sm:text-sm break-words">{ioc.source}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Additional Information */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20">
                <h4 className="font-bold text-blue-200 mb-3 text-xs sm:text-sm flex items-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-pulse" />
                  Contexto
                </h4>
                <ul className="text-blue-100 text-xs sm:text-sm space-y-1.5 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <span>IOC del repositorio CiberVengadores</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <span>Clasificación automática</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <span>Etiquetas auto-generadas</span>
                  </li>
                  {ioc.type === 'hash' && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>MD5/SHA1/SHA256/SHA512</span>
                    </li>
                  )}
                  {ioc.type === 'ip' && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>Incluye notación CIDR</span>
                    </li>
                  )}
                  {ioc.type === 'domain' && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>Validado RFC</span>
                    </li>
                  )}
                  {ioc.type === 'url' && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>HTTP/HTTPS verificado</span>
                    </li>
                  )}
                  {hasTableData && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>Datos estructurados disponibles</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IOCCard;