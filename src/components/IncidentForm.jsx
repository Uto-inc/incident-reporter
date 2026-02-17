import React, { useState } from 'react';

const IncidentForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    assignee: initialData?.assignee || '',
    reporter: initialData?.reporter || '',
    category: initialData?.category || '',
    status: initialData?.status || 'open'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '詳細説明は必須です';
    }
    
    if (!formData.reporter.trim()) {
      newErrors.reporter = '報告者は必須です';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'カテゴリーは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = isEditing 
      ? { ...initialData, ...formData }
      : formData;

    onSubmit(submitData);
  };

  const priorityOptions = [
    { value: 'low', label: '低', color: 'text-green-600', emoji: '🟢' },
    { value: 'medium', label: '中', color: 'text-yellow-600', emoji: '🟡' },
    { value: 'high', label: '高', color: 'text-red-600', emoji: '🔴' }
  ];

  const statusOptions = [
    { value: 'open', label: '未対応', color: 'text-red-600' },
    { value: 'in-progress', label: '対応中', color: 'text-yellow-600' },
    { value: 'resolved', label: '解決済み', color: 'text-green-600' },
    { value: 'closed', label: '終了', color: 'text-gray-600' }
  ];

  const categories = [
    'システム障害',
    '決済問題',
    'メール問題',
    'UI/UX問題',
    'パフォーマンス',
    'セキュリティ',
    'その他'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <span>⚡</span>
            <span>{isEditing ? 'インシデント編集' : '新規インシデント報告'}</span>
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* タイトル */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 インシデントタイトル *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="例: サーバーダウン - 本番環境"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* 優先度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 優先度
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 カテゴリー *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">カテゴリーを選択</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* 報告者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 報告者 *
              </label>
              <input
                type="text"
                name="reporter"
                value={formData.reporter}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent ${
                  errors.reporter ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="例: 田中太郎"
              />
              {errors.reporter && <p className="text-red-500 text-sm mt-1">{errors.reporter}</p>}
            </div>

            {/* 担当者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👨‍💼 担当者
              </label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
                placeholder="例: 佐藤花子"
              />
            </div>

            {/* ステータス（編集時のみ） */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 ステータス
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 詳細説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 詳細説明 *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-uto-blue focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="インシデントの詳細、影響範囲、再現手順などを詳しく記載してください..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-uto-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <span>💾</span>
              <span>{isEditing ? '更新' : '報告'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;