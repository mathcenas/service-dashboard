import React, { useState } from 'react';
import { ExternalLink, Server, Check, X, Cloud, ChevronDown, ChevronUp, Briefcase, HeartHandshake, Edit2 } from 'lucide-react';
import type { Service } from '../types';
import { timeAgo } from '../utils/timeAgo';

interface ServiceCardProps {
  service: Service;
  onCheck: (id: string) => void;
  onEdit: (service: Service) => void;
  isAdmin: boolean;
  darkMode: boolean;
}

export function ServiceCard({ service, onCheck, onEdit, isAdmin, darkMode }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`rounded-lg shadow-sm hover:shadow-md transition-shadow ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Server className="w-4 h-4 text-blue-500" />
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {service.name}
            </h3>
            <p className={`text-xs flex items-center gap-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Briefcase className="w-3 h-3" />
              {service.projectName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            service.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {service.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
          {isExpanded ? (
            <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className={`px-4 pb-4 pt-4 space-y-3 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className={`flex items-center gap-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span className="font-medium">IP:</span>
                {service.ip}
              </p>
            </div>
            <div className={`flex items-center justify-end gap-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Cloud className="w-4 h-4" />
              {service.cloudProvider}
            </div>
          </div>

          <div className="text-sm">
            <p className={`flex items-center gap-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="font-medium">URL:</span>
              <a 
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                {service.url} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {service.description}
            </p>
            <span className="font-medium text-emerald-500">
              ${service.monthlyCost}/mo
            </span>
          </div>

          <div className={`flex items-center gap-2 text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <HeartHandshake className="w-4 h-4 text-purple-500" />
            <span className="font-medium">Supported by:</span>
            {service.supportedBy}
          </div>

          <div className={`flex items-center justify-between text-sm pt-3 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Last checked: {timeAgo(new Date(service.lastCheck))}
            </span>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(service);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheck(service.id);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    darkMode
                      ? 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Check Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}