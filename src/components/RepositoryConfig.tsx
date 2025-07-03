import React, { useState } from 'react';
import { Settings, Github, FileText, RefreshCw, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

interface RepositoryConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: {
    owner: string;
    repo: string;
    path: string;
    branch: string;
  }) => void;
  currentConfig: {
    owner: string;
    repo: string;
    path: string;
    branch: string;
  };
  onRefresh: () => void;
  isLoading: boolean;
}

const RepositoryConfig: React.FC<RepositoryConfigProps> = ({
  isOpen,
  onClose,
  onConfigChange,
  currentConfig,
  onRefresh,
  isLoading
}) => {
  const [config, setConfig] = useState(currentConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setHasChanges(JSON.stringify(newConfig) !== JSON.stringify(currentConfig));
  };

  const handleSave = () => {
    onConfigChange(config);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(currentConfig);
    setHasChanges(false);
  };

  const presetConfigs = [
    {
      name: 'CiberVengadores IOCs',
      owner: 'cibervengadores',
      repo: 'IOCs',
      path: 'peticiones.adoc',
      branch: 'main'
    },
    {
      name: 'CiberVengadores IOCs (develop)',
      owner: 'cibervengadores',
      repo: 'IOCs',
      path: 'peticiones.adoc',
      branch: 'develop'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Configuración del Repositorio</h2>
                <p className="text-xs sm:text-sm text-gray-300">Configura la fuente de datos de IOCs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Presets */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
              Configuraciones Predefinidas
            </h3>
            <div className="space-y-2">
              {presetConfigs.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setConfig(preset);
                    setHasChanges(JSON.stringify(preset) !== JSON.stringify(currentConfig));
                  }}
                  className="w-full text-left p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Github className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-xs sm:text-sm">{preset.name}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {preset.owner}/{preset.repo}/{preset.path} ({preset.branch})
                      </div>
                    </div>
                    {JSON.stringify(preset) === JSON.stringify(currentConfig) && (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Configuration */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
              Configuración Manual
            </h3>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Propietario del Repositorio
              </label>
              <input
                type="text"
                value={config.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="cibervengadores"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Nombre del Repositorio
              </label>
              <input
                type="text"
                value={config.repo}
                onChange={(e) => handleInputChange('repo', e.target.value)}
                placeholder="IOCs"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Ruta del Archivo
              </label>
              <input
                type="text"
                value={config.path}
                onChange={(e) => handleInputChange('path', e.target.value)}
                placeholder="peticiones.adoc"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Rama
              </label>
              <input
                type="text"
                value={config.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                placeholder="main"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
          </div>

          {/* Preview URL */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-xl border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-blue-300">URL del Archivo:</span>
            </div>
            <code className="text-xs text-blue-200 break-all block leading-relaxed">
              https://github.com/{config.owner}/{config.repo}/blob/{config.branch}/{config.path}
            </code>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-yellow-400 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Cambios sin guardar</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Resetear
              </button>
              
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Guardar</span>
              </button>
              
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryConfig;