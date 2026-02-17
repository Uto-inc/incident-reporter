import React, { useState, useMemo } from 'react';

const IncidentList = ({ incidents, onSelectIncident, onEditIncident, onDeleteIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // フィルタリングとソート
  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = incidents.filter(incident => {
      const matchesSearch = 
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.assignee?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // ソート
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [incidents, searchTerm, filterStatus, filterPriority, sortBy, sortOrder]);

  const getPriorityBadge = (priority) => {
    const config = {
      high: { emoji: '🔴', label: '高', class: 'bg-red-100 text-red-800' },
      medium: { emoji: '🟡', label: '中', class: 'bg-yellow-100 text-yellow-800' },
      low: { emoji: '🟢', label: '低', class: 'bg-green-100 text-green-800' }
    };
    
    const { emoji, label, class: className } = config[priority];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        <span className="mr-1">{emoji}</span>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      open: { emoji: '🆘', label: '未対応', class: 'bg-red-100 text-red-800' },
      'in-progress': { emoji: '⚡', label: '対応中', class: 'bg-yellow-100 text-yellow-800' },
      resolved: { emoji: '✅', label: '解決済み', class: 'bg-green-100 text-green-800' },
      closed: { emoji: '✔️', label: '終了', class: 'bg-gray-100 text-gray-800' }
    };
    
    const { emoji, label, class: className } = config[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        <span className="mr-1">{emoji}</span>
        {label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIncidentCardClass = (priority) => {
    const baseClass = 'incident-card cursor-pointer transition-all duration-200 hover:scale-[1.02]';
    switch (priority) {
      case 'high':
        return `${baseClass} border-l-4 border-l-red-500 priority-high`;
      case 'medium':
        return `${baseClass} border-l-4 border-l-yellow-500 priority-medium`;
      case 'low':
        return `${baseClass} border-l-4 border-l-green-500 priority-low`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <span>📋</span>
            <span>インシデント一覧</span>
          </h2>
          <p className="text-gray-600 mt-2">
            総件数: {incidents.length} / 表示中: {filteredAndSortedIncidents.length}
          </p>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 検索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
              placeholder="タイトル、内容、担当者..."
            />
          </div>

          {/* ステータスフィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 ステータス
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="open">未対応</option>
              <option value="in-progress">対応中</option>
              <option value="resolved">解決済み</option>
              <option value="closed">終了</option>
            </select>
          </div>

          {/* 優先度フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 優先度
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          {/* ソート */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 並び順
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
            >
              <option value="createdAt-desc">作成日(新しい順)</option>
              <option value="createdAt-asc">作成日(古い順)</option>
              <option value="updatedAt-desc">更新日(新しい順)</option>
              <option value="updatedAt-asc">更新日(古い順)</option>
              <option value="priority-desc">優先度(高い順)</option>
              <option value="priority-asc">優先度(低い順)</option>
            </select>
          </div>
        </div>
      </div>

      {/* インシデント一覧 */}
      <div className="space-y-4">
        {filteredAndSortedIncidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              インシデントが見つかりません
            </h3>
            <p className="text-gray-600">
              検索条件を変更するか、新しいインシデントを報告してください。
            </p>
          </div>
        ) : (
          filteredAndSortedIncidents.map(incident => (
            <div
              key={incident.id}
              className={getIncidentCardClass(incident.priority)}
              onClick={() => onSelectIncident(incident)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm text-gray-500 font-mono">
                      #{incident.id}
                    </span>
                    {getPriorityBadge(incident.priority)}
                    {getStatusBadge(incident.status)}
                    <span className="text-sm text-gray-500">
                      📂 {incident.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {incident.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {incident.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>👤 {incident.reporter}</span>
                    {incident.assignee && (
                      <span>👨‍💼 {incident.assignee}</span>
                    )}
                    <span>📅 {formatDate(incident.createdAt)}</span>
                    {incident.updatedAt !== incident.createdAt && (
                      <span>🔄 {formatDate(incident.updatedAt)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditIncident(incident);
                    }}
                    className="p-2 text-gray-400 hover:text-uto-blue hover:bg-blue-50 rounded-lg transition-colors"
                    title="編集"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('このインシデントを削除しますか？')) {
                        onDeleteIncident(incident.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="削除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentList;