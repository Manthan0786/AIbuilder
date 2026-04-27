import React from 'react';
import { Code2, Eye } from 'lucide-react';

export function TabView({ activeTab, onTabChange }) {
  return (
    <div className="mb-4 flex space-x-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
          activeTab === 'code'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white hover:text-slate-700'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
          activeTab === 'preview'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white hover:text-slate-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  );
}