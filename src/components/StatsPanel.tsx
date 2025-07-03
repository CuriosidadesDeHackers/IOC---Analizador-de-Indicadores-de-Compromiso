import React from 'react';
import { ParsedData } from '../types';
import { Shield, AlertTriangle, AlertOctagon, AlertCircle, Info } from 'lucide-react';

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
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Total IOCs'
    },
    {
      title: 'Crítico',
      value: severityStats.critical || 0,
      icon: AlertOctagon,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      description: 'Severidad crítica'
    },
    {
      title: 'Alto',
      value: severityStats.high || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      description: 'Severidad alta'
    },
    {
      title: 'Medio',
      value: severityStats.medium || 0,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      description: 'Severidad media'
    },
    {
      title: 'Bajo',
      value: severityStats.low || 0,
      icon: Info,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Severidad baja'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-cyber p-3 sm:p-4 lg:p-6 animate-fade-in">
          <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
            <div className={`p-2 sm:p-3 rounded-lg ${stat.color} flex-shrink-0`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                {stat.title}
              </p>
              <div className="flex flex-col items-center space-y-1">
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.textColor}`}>
                  {stat.value.toLocaleString()}
                </p>
                {stat.filtered !== undefined && (
                  <span className="text-xs text-gray-500">
                    ({stat.filtered.toLocaleString()})
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;