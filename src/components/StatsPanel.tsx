import React from 'react';
import { ParsedData } from '../types';
import { Shield, AlertTriangle, AlertOctagon, AlertCircle, Info, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  data: ParsedData;
  filteredCount: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ data, filteredCount }) => {
  const severityStats = data.iocs.reduce((acc, ioc) => {
    acc[ioc.severity] = (acc[ioc.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: 'Total',
      value: data.totalCount,
      filtered: filteredCount !== data.totalCount ? filteredCount : undefined,
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
      description: 'Total IOCs',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Crítico',
      value: severityStats.critical || 0,
      icon: AlertOctagon,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-400',
      description: 'Severidad crítica',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    {
      title: 'Alto',
      value: severityStats.high || 0,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-400',
      description: 'Severidad alta',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      title: 'Medio',
      value: severityStats.medium || 0,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-400',
      description: 'Severidad media',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700'
    },
    {
      title: 'Bajo',
      value: severityStats.low || 0,
      icon: Info,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-400',
      description: 'Severidad baja',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="group bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 animate-fade-in-up hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 transform hover:scale-105 hover:shadow-3xl"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
          
          <div className="relative flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="relative group/icon">
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl blur opacity-75 group-hover/icon:opacity-100 transition duration-300`}></div>
              <div className={`relative p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} ${stat.hoverColor} flex-shrink-0 transform group-hover/icon:scale-110 transition-all duration-300 shadow-lg`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
              </div>
              {stat.value > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
              )}
            </div>
            
            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-300 mb-1 truncate group-hover:text-white transition-colors duration-300">
                {stat.title}
              </p>
              
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  <p className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.value > 0 && (
                    <TrendingUp className={`absolute -top-1 -right-3 sm:-right-4 w-2 h-2 sm:w-3 sm:h-3 ${stat.textColor} opacity-50 animate-pulse`} />
                  )}
                </div>
                
                {stat.filtered !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">
                      ({stat.filtered.toLocaleString()})
                    </span>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">filtrado</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                {stat.description}
              </p>
            </div>
          </div>

          {/* Subtle hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl sm:rounded-b-2xl"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;