import React from 'react';
import { X, Github, ExternalLink, Key, Wifi, CheckCircle, Clock, Settings, Bug, Shield, Sparkles } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  repoConfig: {
    owner: string;
    repo: string;
    path: string;
    branch: string;
  };
  onShowConfig: () => void;
  onShowDebug: () => void;
  showDebug: boolean;
  lastUpdate: Date | null;
  timeUntilUpdate: string | null;
  rateLimit: {
    remaining: number;
    limit: number;
    resetTime: Date;
    isAuthenticated: boolean;
  } | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  repoConfig,
  onShowConfig,
  onShowDebug,
  showDebug,
  lastUpdate,
  timeUntilUpdate,
  rateLimit
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/10 backdrop-blur-xl border-l border-white/20 z-50 lg:hidden transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>IOC Dashboard</span>
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </h2>
                <p className="text-xs text-gray-300">Menu de navegación</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Repository Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                Repositorio Actual
              </h3>
              <a
                href={`https://github.com/${repoConfig.owner}/${repoConfig.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                onClick={onClose}
              >
                <Github className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">
                    {repoConfig.owner}/{repoConfig.repo}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {repoConfig.path} ({repoConfig.branch})
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </a>
            </div>

            {/* Authentication Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                Estado de Autenticación
              </h3>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  {import.meta.env.VITE_GITHUB_TOKEN ? (
                    <>
                      <Key className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Autenticado</div>
                        <div className="text-xs text-gray-400">Token GitHub configurado</div>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Acceso Público</div>
                        <div className="text-xs text-gray-400">Sin token GitHub</div>
                      </div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>
                {rateLimit && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      Rate limit: {rateLimit.remaining}/{rateLimit.limit}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                Estado del Sistema
              </h3>
              <div className="space-y-2">
                {lastUpdate && (
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Última Actualización</div>
                      <div className="text-xs text-gray-400">{lastUpdate.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                {timeUntilUpdate && (
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
                    <div>
                      <div className="text-sm font-medium text-white">Próxima Actualización</div>
                      <div className="text-xs text-gray-400 font-mono">{timeUntilUpdate}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                Acciones
              </h3>
              <div className="space-y-2">
                <button
                  onClick={onShowConfig}
                  className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left"
                >
                  <Settings className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Configuración</div>
                    <div className="text-xs text-gray-400">Cambiar repositorio y archivo</div>
                  </div>
                </button>
                
                <button
                  onClick={onShowDebug}
                  className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left"
                >
                  <Bug className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-white">
                      Panel de Debug {showDebug ? '(Activo)' : ''}
                    </div>
                    <div className="text-xs text-gray-400">Información técnica detallada</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">
                IOC Dashboard v1.0
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cybersecurity Intelligence Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;