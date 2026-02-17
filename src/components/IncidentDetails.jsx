import React, { useState } from 'react';

const IncidentDetails = ({ incident, onEdit, onDelete, onBack, onUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(incident.status);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '田中太郎',
      content: '調査を開始しました。サーバーログを確認中です。',
      createdAt: new Date('2026-02-17T10:30:00'),
      type: 'comment'
    },
    {
      id: 2,
      author: 'システム',
      content: 'ステータスが「未対応」から「対応中」に変更されました。',
      createdAt: new Date('2026-02-17T10:45:00'),
      type: 'system'
    }
  ]);

  const getPriorityBadge = (priority) => {
    const config = {
      high: { emoji: '🔴', label: '高', class: 'bg-red-100 text-red-800' },
      medium: { emoji: '🟡', label: '中', class: 'bg-yellow-100 text-yellow-800' },
      low: { emoji: '🟢', label: '低', class: 'bg-green-100 text-green-800' }
    };
    
    const { emoji, label, class: className } = config[priority];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
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
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeDiff = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };

  const handleStatusUpdate = () => {
    const updatedIncident = {
      ...incident,
      status: newStatus,
      updatedAt: new Date()
    };

    onUpdate(updatedIncident);

    // コメント追加
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: '現在のユーザー', // 実際の実装では認証ユーザー名
        content: comment,
        createdAt: new Date(),
        type: 'comment'
      };
      setComments([...comments, newComment]);
      setComment('');
    }

    // システムメッセージ追加
    const systemMessage = {
      id: Date.now() + 1,
      author: 'システム',
      content: `ステータスが「${getStatusLabel(incident.status)}」から「${getStatusLabel(newStatus)}」に変更されました。`,
      createdAt: new Date(),
      type: 'system'
    };
    setComments(prev => [...prev, systemMessage]);

    setIsUpdatingStatus(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: '未対応',
      'in-progress': '対応中',
      resolved: '解決済み',
      closed: '終了'
    };
    return labels[status];
  };

  const statusOptions = [
    { value: 'open', label: '未対応', emoji: '🆘' },
    { value: 'in-progress', label: '対応中', emoji: '⚡' },
    { value: 'resolved', label: '解決済み', emoji: '✅' },
    { value: 'closed', label: '終了', emoji: '✔️' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>←</span>
          <span>一覧に戻る</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onEdit(incident)}
            className="px-4 py-2 bg-uto-blue text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>編集</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('このインシデントを削除しますか？')) {
                onDelete(incident.id);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <span>🗑️</span>
            <span>削除</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メイン詳細 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg text-gray-500 font-mono">#{incident.id}</span>
                {getPriorityBadge(incident.priority)}
                {getStatusBadge(incident.status)}
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                📂 {incident.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {incident.title}
            </h1>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span>📄</span>
                <span>詳細説明</span>
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {incident.description}
                </p>
              </div>
            </div>
          </div>

          {/* タイムライン・コメント */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <span>💬</span>
              <span>タイムライン</span>
            </h3>

            <div className="space-y-4 mb-6">
              {comments.map(comment => (
                <div key={comment.id} className={`flex space-x-4 ${
                  comment.type === 'system' ? 'opacity-70' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    comment.type === 'system' ? 'bg-gray-200' : 'bg-uto-blue'
                  }`}>
                    {comment.type === 'system' ? '🤖' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)} ({getTimeDiff(comment.createdAt)})
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* コメント追加 */}
            <div className="border-t pt-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="コメントを入力してください..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => {
                    if (comment.trim()) {
                      const newComment = {
                        id: Date.now(),
                        author: '現在のユーザー',
                        content: comment,
                        createdAt: new Date(),
                        type: 'comment'
                      };
                      setComments([...comments, newComment]);
                      setComment('');
                    }
                  }}
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-uto-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  💬 コメント追加
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* ステータス更新 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>ステータス更新</span>
            </h3>

            {!isUpdatingStatus ? (
              <button
                onClick={() => setIsUpdatingStatus(true)}
                className="w-full px-4 py-2 bg-uto-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ステータス変更
              </button>
            ) : (
              <div className="space-y-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="変更理由やコメント（任意）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent resize-none"
                  rows={3}
                />

                <div className="flex space-x-2">
                  <button
                    onClick={handleStatusUpdate}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    更新
                  </button>
                  <button
                    onClick={() => {
                      setIsUpdatingStatus(false);
                      setNewStatus(incident.status);
                      setComment('');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 詳細情報 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>ℹ️</span>
              <span>詳細情報</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-500 block">報告者</span>
                <span className="text-gray-900 font-medium">👤 {incident.reporter}</span>
              </div>
              
              {incident.assignee && (
                <div>
                  <span className="text-gray-500 block">担当者</span>
                  <span className="text-gray-900 font-medium">👨‍💼 {incident.assignee}</span>
                </div>
              )}

              <div>
                <span className="text-gray-500 block">作成日時</span>
                <span className="text-gray-900 font-medium">📅 {formatDate(incident.createdAt)}</span>
              </div>

              <div>
                <span className="text-gray-500 block">最終更新</span>
                <span className="text-gray-900 font-medium">🔄 {formatDate(incident.updatedAt)}</span>
              </div>

              <div>
                <span className="text-gray-500 block">経過時間</span>
                <span className="text-gray-900 font-medium">⏱️ {getTimeDiff(incident.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;