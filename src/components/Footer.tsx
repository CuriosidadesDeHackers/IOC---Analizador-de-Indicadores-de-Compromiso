import React from 'react';
import { Github, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-16 animate-module-in" style={{ animationDelay: '0.4s' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="secure-module border-white/5">
          <div className="module-header bg-blue-500/5">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Terminal Connection: Established</span>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">CuriosidadesDeHackers</h3>
                    <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">Secure Intel Dashboard</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-8 leading-relaxed max-w-md text-sm">
                  Plataforma avanzada de monitorización de amenazas. 
                  Extracción y análisis de indicadores de compromiso (IOC) 
                  mediante módulos descentralizados y seguros.
                </p>

                <div className="flex items-center space-x-6">
                  <a
                    href="https://github.com/CuriosidadesDeHackers/IOC---Analizador-de-Indicadores-de-Compromiso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Source Code</span>
                  </a>
                </div>
              </div>

              {/* Secure Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-blue-500 pl-3">Security Ops</h4>
                <ul className="space-y-3">
                  <li className="text-xs text-gray-500 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Bitwise Verification: ON</span>
                  </li>
                  <li className="text-xs text-gray-500 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Data Sanitization: Active</span>
                  </li>
                  <li className="text-xs text-gray-500 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Un-defanging Engine: v2.0</span>
                  </li>
                </ul>
              </div>

              {/* Legal Info */}
              <div className="space-y-4 text-center md:text-left">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider">
                    &copy; {currentYear} CuriosidadesDeHackers. 
                    Authorized monitoring only. 
                    All signatures validated O(N).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;