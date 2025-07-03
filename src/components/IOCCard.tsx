import React, { useState } from 'react';
import { IOC } from '../types';
import {
  Shield, Hash, Globe, Mail, FileText, Database, Link,
  Copy, Check, Calendar, Tag, Info, ChevronDown, ChevronUp, ExternalLink,
  Search, AlertOctagon, File as FileIcon
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
        return <Hash className="w-4 h-4" />;
      case 'ip':
        return <Globe className="w-4 h-4" />;
      case 'domain':
        return <Globe className="w-4 h-4" />;
      case 'url':
        return <Link className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'registry':
        return <Database className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: IOC['severity']) => {
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

  const getSeverityBorder = (severity: IOC['severity']) => {
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className={`bg-white rounded-lg border-l-4 ${getSeverityBorder(ioc.severity)} shadow-cyber hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden`}>
      <div className="p-3 sm:p-4">
        {/* Header Section - Completamente móvil */}
        <div className="flex flex-col space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="p-1.5 bg-cyber-blue/10 rounded-lg text-cyber-blue flex-shrink-0">
                {getTypeIcon(ioc.type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {getTypeText(ioc.type)}
                </h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${getSeverityColor(ioc.severity)} flex-shrink-0`}></span>
                  <span className="text-xs text-gray-600 font-medium">
                    {getSeverityText(ioc.severity)}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(ioc.status)} flex-shrink-0 ml-2`}>
              {getStatusText(ioc.status)}
            </span>
          </div>
        </div>

        {/* IOC Value Section - Completamente móvil */}
        <div className="mb-3">
          <div className="bg-gray-50 rounded-lg p-2 border">
            <div className="space-y-2">
              <div className="overflow-hidden">
                <code className="text-xs font-mono text-gray-800 break-all leading-relaxed block">
                  {ioc.value}
                </code>
              </div>
              <div className="flex items-center justify-end space-x-1 pt-1 border-t border-gray-200">
                {canOpenExternal && (
                  <button
                    onClick={openExternal}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Abrir"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Copiar"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Data Section - Completamente móvil */}
        {hasTableData && (
          <div className="mb-3">
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center text-sm">
                <Database className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate">Datos estructurados</span>
              </h4>
              <div className="space-y-2">
                {ioc.tableData?.hash && (
                  <div className="bg-white rounded p-2 border">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Hash className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-800">Hash:</span>
                    </div>
                    <div className="overflow-hidden">
                      <code className="text-xs text-blue-900 break-all block leading-relaxed">
                        {ioc.tableData.hash}
                      </code>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.archivo && (
                  <div className="bg-white rounded p-2 border">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <FileIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-800">Archivo:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-blue-900 break-all block leading-relaxed">
                        {ioc.tableData.archivo}
                      </span>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.deteccion && (
                  <div className="bg-white rounded p-2 border">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Search className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-800">Detección:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-blue-900 break-words block leading-relaxed">
                        {ioc.tableData.deteccion}
                      </span>
                    </div>
                  </div>
                )}
                
                {ioc.tableData?.descripcion && (
                  <div className="bg-white rounded p-2 border">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-800">Descripción:</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-blue-900 break-words block leading-relaxed">
                        {ioc.tableData.descripcion}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description - Completamente móvil */}
        <div className="mb-3">
          <div className="overflow-hidden">
            <p className="text-xs text-gray-700 leading-relaxed break-words">
              {ioc.description}
            </p>
          </div>
        </div>

        {/* Tags - Completamente móvil */}
        {ioc.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Etiquetas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ioc.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-cyber-blue/10 text-cyber-blue text-xs rounded-full font-medium border border-cyber-blue/20 break-all max-w-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Details Section - Completamente móvil */}
        <div className="border-t pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-1.5 min-w-0 flex-1">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs truncate">Información técnica</span>
            </div>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {/* IOC Details Grid - Una columna en móvil */}
              <div className="bg-gray-50 rounded-lg p-2 space-y-2">
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">ID:</span>
                  <div className="overflow-hidden">
                    <p className="text-gray-800 font-mono text-xs break-all">{ioc.id}</p>
                  </div>
                </div>
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">Tipo:</span>
                  <p className="text-gray-800 text-xs">{getTypeText(ioc.type)}</p>
                </div>
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">Estado:</span>
                  <p className="text-gray-800 text-xs">{getStatusText(ioc.status)}</p>
                </div>
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">Severidad:</span>
                  <p className="text-gray-800 text-xs">{getSeverityText(ioc.severity)}</p>
                </div>
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">Fuente:</span>
                  <div className="overflow-hidden">
                    <p className="text-gray-800 text-xs break-words">{ioc.source}</p>
                  </div>
                </div>
                <div className="bg-white rounded p-2 border">
                  <span className="font-medium text-gray-600 text-xs block mb-1">Fecha:</span>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <p className="text-gray-800 text-xs">{ioc.dateAdded.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information - Completamente móvil */}
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1.5 text-xs">Contexto</h4>
                <ul className="text-blue-800 text-xs space-y-0.5 leading-relaxed">
                  <li>• IOC del repositorio CiberVengadores</li>
                  <li>• Clasificación automática</li>
                  <li>• Etiquetas auto-generadas</li>
                  {ioc.type === 'hash' && <li>• MD5/SHA1/SHA256/SHA512</li>}
                  {ioc.type === 'ip' && <li>• Incluye notación CIDR</li>}
                  {ioc.type === 'domain' && <li>• Validado RFC</li>}
                  {ioc.type === 'url' && <li>• HTTP/HTTPS verificado</li>}
                  {hasTableData && <li>• Datos estructurados</li>}
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
