import React from 'react';
import { Heart, Github, Globe, Shield, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-16 bg-gradient-to-br from-slate-950/90 to-blue-950/90 backdrop-blur-xl border-t border-white/10">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">IOC Dashboard</h3>
                <p className="text-sm text-gray-400">Cybersecurity Intelligence Platform</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Dashboard profesional para visualizar y gestionar Indicators of Compromise (IOCs) 
              de ciberseguridad extraídos del repositorio CiberVengadores.
            </p>

            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/cibervengadores/IOCs"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Repositorio</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              
              <div className="w-px h-6 bg-gray-600"></div>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Open Source</span>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://curiosidadesdehackers.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <span className="text-sm group-hover:underline">Curiosidades De Hackers</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cibervengadores"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <span className="text-sm group-hover:underline">CiberVengadores</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cibervengadores/IOCs/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <span className="text-sm group-hover:underline">Documentación</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cibervengadores/IOCs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <span className="text-sm group-hover:underline">Reportar Issue</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-semibold text-white mb-4">Tecnología</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">React + TypeScript</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">GitHub API</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">AsciiDoc Parser</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-gray-400 leading-relaxed">
                Dashboard optimizado para la visualización de threat intelligence 
                y análisis de indicadores de compromiso.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-fade-in"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-2">
            <p className="text-gray-400 text-sm">
              © {currentYear} 
              <a 
                href="https://curiosidadesdehackers.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-white font-medium hover:text-blue-400 transition-colors duration-200 hover:underline"
              >
                Curiosidades De Hackers
              </a>
            </p>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Contacto disponible en el sitio web</span>
            </div>
          </div>
        </div>

        {/* Additional Credits */}
        <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Desarrollado con ❤️ para la comunidad de ciberseguridad. 
              Los IOCs mostrados provienen del repositorio público 
              <a 
                href="https://github.com/cibervengadores/IOCs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
              >
                CiberVengadores/IOCs
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;