import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle, ArrowLeft, Github, ExternalLink } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center text-white max-w-2xl relative z-10 animate-fade-in-up">
        {/* 404 Icon */}
        <div className="relative mb-8">
          <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl backdrop-blur-sm border border-red-500/20 inline-block">
            <AlertTriangle className="w-20 h-20 mx-auto text-red-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-ping"></div>
        </div>

        {/* 404 Title */}
        <h1 className="text-6xl sm:text-8xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          Página No Encontrada
        </h2>
        
        <p className="text-gray-300 mb-8 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          La ruta que intentas acceder no existe en el IOC Dashboard. 
          Verifica la URL o regresa a la página principal.
        </p>

        {/* Current URL Display */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-8 border border-red-500/20 inline-block">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Search className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-medium">URL solicitada:</span>
          </div>
          <div className="mt-2 overflow-hidden">
            <code className="text-red-300 font-mono text-sm break-all">
              {window.location.href}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span>Ir al Dashboard</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 border border-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Volver Atrás</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-left">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Rutas Disponibles
          </h3>
          
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-mono text-green-300">/</div>
                <div className="text-xs text-gray-400">Dashboard principal de IOCs</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-mono text-green-300">/dashboard</div>
                <div className="text-xs text-gray-400">Acceso alternativo al dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-red-500/20">
              <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-mono text-red-300">Cualquier otra ruta</div>
                <div className="text-xs text-gray-400">Mostrará esta página 404</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            ¿Crees que esto es un error? Reporta el problema:
          </p>
          <a
            href="https://github.com/cibervengadores/IOCs/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Reportar en GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;