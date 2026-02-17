import React from 'react';

const Header = ({ currentView, onNavigate, onNewIncident }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-uto-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚨</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Incident Reporter
              </h1>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              UTO Inc.
            </span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-uto-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 一覧
            </button>
            
            <button
              onClick={onNewIncident}
              className="bg-uto-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <span>⚡</span>
              <span>新規報告</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;