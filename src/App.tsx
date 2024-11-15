import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, UserPlus, Moon, Sun } from 'lucide-react';
import { ServiceCard } from './components/ServiceCard';
import { AddServiceModal } from './components/AddServiceModal';
import { AddUserModal } from './components/AddUserModal';
import { LoginPage } from './components/LoginPage';
import type { Service } from './types';

const DEMO_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Main API Server',
    projectName: 'E-commerce Platform',
    url: 'https://api.example.com',
    ip: '10.0.0.1',
    description: 'Primary API server handling all e-commerce transactions',
    cloudProvider: 'UpCloud',
    monthlyCost: 99.99,
    supportedBy: 'DevOps Team',
    lastCheck: new Date(),
    isActive: true
  },
  {
    id: '2',
    name: 'Database Cluster',
    projectName: 'E-commerce Platform',
    url: 'https://db.example.com',
    ip: '10.0.0.2',
    description: 'PostgreSQL database cluster for e-commerce data',
    cloudProvider: 'Netuy.net',
    monthlyCost: 199.99,
    supportedBy: 'Database Team',
    lastCheck: new Date(),
    isActive: true
  }
];

export function App() {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : DEMO_SERVICES;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedPreference = localStorage.getItem('darkMode');
      if (savedPreference === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('');
  };

  const addService = (newService: Omit<Service, 'id' | 'lastCheck' | 'isActive'>) => {
    const service: Service = {
      ...newService,
      id: crypto.randomUUID(),
      lastCheck: new Date(),
      isActive: true,
    };
    setServices([...services, service]);
  };

  const updateService = (updatedService: Service) => {
    setServices(services.map(s => 
      s.id === updatedService.id ? updatedService : s
    ));
    setEditingService(null);
  };

  const checkService = async (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive, lastCheck: new Date() } : s
    ));
  };

  const checkAllServices = () => {
    setServices(services.map(s => ({ ...s, lastCheck: new Date() })));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Service Monitor
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and monitor your services in one place
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-md border ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Logout
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </button>
            )}
            <button
              onClick={checkAllServices}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Check All
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            )}
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No services added yet
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Add your first service to start monitoring
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onCheck={checkService}
                onEdit={setEditingService}
                isAdmin={userRole === 'admin'}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}

        {userRole === 'admin' && (
          <>
            <AddServiceModal
              isOpen={isModalOpen || !!editingService}
              onClose={() => {
                setIsModalOpen(false);
                setEditingService(null);
              }}
              onAdd={addService}
              onUpdate={updateService}
              editingService={editingService}
              darkMode={darkMode}
            />
            <AddUserModal
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
              darkMode={darkMode}
            />
          </>
        )}
      </div>
    </div>
  );
}