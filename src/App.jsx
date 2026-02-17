import React, { useState, useEffect } from 'react';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';
import IncidentDetails from './components/IncidentDetails';
import Header from './components/Header';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [editingIncident, setEditingIncident] = useState(null);

  // サンプルデータを初期化
  useEffect(() => {
    const sampleIncidents = [
      {
        id: '001',
        title: 'サーバーダウン - 本番環境',
        description: '本番サーバーが午前10時頃から応答しなくなりました。ユーザーがサービスにアクセスできない状態です。',
        priority: 'high',
        status: 'open',
        assignee: '田中太郎',
        reporter: '佐藤花子',
        createdAt: new Date('2026-02-17T10:00:00'),
        updatedAt: new Date('2026-02-17T10:00:00'),
        category: 'システム障害'
      },
      {
        id: '002',
        title: '支払い処理エラー',
        description: '一部のクレジットカード決済が失敗している報告があります。決済代行会社との連携に問題がある可能性があります。',
        priority: 'medium',
        status: 'in-progress',
        assignee: '山田次郎',
        reporter: '鈴木一郎',
        createdAt: new Date('2026-02-17T14:30:00'),
        updatedAt: new Date('2026-02-17T15:00:00'),
        category: '決済問題'
      },
      {
        id: '003',
        title: 'メール送信遅延',
        description: '通知メールの送信に遅延が発生しています。ユーザーへの自動通知が30分程度遅れています。',
        priority: 'low',
        status: 'resolved',
        assignee: '高橋三郎',
        reporter: '伊藤美咲',
        createdAt: new Date('2026-02-16T16:00:00'),
        updatedAt: new Date('2026-02-17T09:00:00'),
        category: 'メール問題'
      }
    ];
    setIncidents(sampleIncidents);
  }, []);

  const handleCreateIncident = (newIncident) => {
    const incident = {
      ...newIncident,
      id: Date.now().toString(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setIncidents([incident, ...incidents]);
    setCurrentView('list');
  };

  const handleUpdateIncident = (updatedIncident) => {
    setIncidents(incidents.map(incident => 
      incident.id === updatedIncident.id 
        ? { ...updatedIncident, updatedAt: new Date() }
        : incident
    ));
    setSelectedIncident({ ...updatedIncident, updatedAt: new Date() });
    setEditingIncident(null);
  };

  const handleDeleteIncident = (incidentId) => {
    setIncidents(incidents.filter(incident => incident.id !== incidentId));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(null);
      setCurrentView('list');
    }
  };

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setCurrentView('details');
  };

  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setCurrentView('form');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return (
          <IncidentForm
            onSubmit={editingIncident ? handleUpdateIncident : handleCreateIncident}
            onCancel={() => {
              setCurrentView('list');
              setEditingIncident(null);
            }}
            initialData={editingIncident}
            isEditing={!!editingIncident}
          />
        );
      case 'details':
        return (
          <IncidentDetails
            incident={selectedIncident}
            onEdit={handleEditIncident}
            onDelete={handleDeleteIncident}
            onBack={() => setCurrentView('list')}
            onUpdate={handleUpdateIncident}
          />
        );
      default:
        return (
          <IncidentList
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onEditIncident={handleEditIncident}
            onDeleteIncident={handleDeleteIncident}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewIncident={() => {
          setEditingIncident(null);
          setCurrentView('form');
        }}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 UTO Inc. Incident Reporter System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;