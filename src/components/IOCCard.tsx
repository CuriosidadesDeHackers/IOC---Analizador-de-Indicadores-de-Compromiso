import React, { useState } from 'react';
import { IOC } from '../types';
import {
  Shield, FileText, Database,
  Copy, Check, ChevronDown, ExternalLink, Sparkles
} from 'lucide-react';
import IOCLogo from './IOCLogo';

interface IOCCardProps {
  ioc: IOC;
}

const IOCCard: React.FC<IOCCardProps> = React.memo(({ ioc }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity: IOC['severity']) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getSeverityText = (severity: IOC['severity']) => {
    switch (severity) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return severity;
    }
  };

  const getStatusColor = (status: IOC['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusText = (status: IOC['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getTypeText = (type: IOC['type']) => {
    switch (type) {
      case 'hash': return 'Hash';
      case 'ip': return 'Dirección IP';
      case 'domain': return 'Dominio';
      case 'url': return 'URL';
      case 'email': return 'Email';
      case 'file': return 'Archivo';
      case 'registry': return 'Registro';
      default: return 'Indicador';
    }
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const openExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUrl) {
      window.open(ioc.value, '_blank', 'noopener,noreferrer');
    } else if (isDomain) {
      window.open(`https://${ioc.value}`, '_blank', 'noopener,noreferrer');
    }
  };

  const hasTableData = ioc.tableData && Object.keys(ioc.tableData).some(key => 
    ioc.tableData![key] && ioc.tableData![key]!.trim().length > 0
  );

  return (
    <div className={`secure-module group/card transition-all duration-500 ${expanded ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''}`}>
      {/* Background decoration */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700`}></div>
      
      <div className="relative p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Identity Block */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className={`absolute -inset-2 rounded-2xl blur-lg opacity-20 transition-all duration-500 group-hover/card:opacity-40 bg-gradient-to-br ${getSeverityColor(ioc.severity)}`}></div>
            <div className={`relative p-4 rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md flex items-center justify-center transform transition-all duration-500 group-hover/card:scale-105 group-hover/card:rotate-2`}>
              <div className="relative">
                <IOCLogo type={ioc.type} severityColor={getSeverityColor(ioc.severity)} className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  {getTypeText(ioc.type)}
                </h3>
                {ioc.severity === 'critical' && (
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                )}
              </div>
              <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusColor(ioc.status)} inline-block mx-auto sm:mx-0`}>
                {getStatusText(ioc.status)}
              </div>
            </div>

            <div className="bg-slate-950/40 rounded-xl p-3 sm:p-4 border border-white/5 mb-3 group-hover/card:border-blue-500/20 transition-colors">
              <code className="text-sm sm:text-base font-mono text-white break-all leading-relaxed">
                {ioc.value}
              </code>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getSeverityColor(ioc.severity)} animate-pulse`}></div>
                <span>{getSeverityText(ioc.severity)}</span>
              </div>
              {ioc.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] uppercase font-bold tracking-widest text-blue-400/70 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-row md:flex-col items-center justify-center space-x-2 md:space-x-0 md:space-y-2">
            <button
              onClick={copyToClipboard}
              className="p-3 bg-white/5 hover:bg-green-500/10 rounded-xl border border-white/10 hover:border-green-500/20 transition-all group/btn"
              title="Copiar Valor"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />}
            </button>
            {canOpenExternal && (
              <button
                onClick={openExternal}
                className="p-3 bg-white/5 hover:bg-blue-500/10 rounded-xl border border-white/10 hover:border-blue-500/20 transition-all group/btn"
                title="Abrir Destino"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />
              </button>
            )}
            <button
              className={`p-3 bg-white/5 rounded-xl border border-white/10 transition-all transform ${expanded ? 'rotate-180 bg-blue-500/10' : ''}`}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-module-in">
            {/* Description & Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span>Threat Intelligence Description</span>
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "{ioc.description || 'No detailed description available for this indicator.'}"
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                  <Database className="w-3 h-3" />
                  <span>Metadata Summary</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Source</span>
                    <span className="text-xs text-brand-text truncate block">{ioc.source}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Observation Date</span>
                    <span className="text-xs text-brand-text block">{ioc.dateAdded.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Table Data if exists */}
            {hasTableData && (
              <div className="bg-blue-500/5 rounded-2xl border border-blue-500/10 p-6 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Technical Data Structures</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(ioc.tableData || {}).map(([key, val]) => val && (
                    <div key={key} className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-2 font-black">{key}</span>
                      <code className="text-sm text-gray-300 break-all">{val}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default IOCCard;