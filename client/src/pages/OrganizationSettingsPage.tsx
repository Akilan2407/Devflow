import type { ReactElement } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';

export const OrganizationSettingsPage = (): ReactElement => {
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (): Promise<void> => {
    setSaving(true);
    try {
      await apiClient.patch(`/organizations/${id}`, { description });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      <div className="border-b border-surface-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="badge-cyan">WORKSPACE CONFIG</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage workspace profile, description, and tenant policies.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 space-y-5">
        <h2 className="text-lg font-bold text-white">General Overview</h2>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Organization Description & Mission
          </label>
          <textarea
            className="input min-h-36 text-xs leading-relaxed"
            placeholder="Describe your organization's engineering charter, focus areas, and guidelines..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-surface-800">
          <div>
            {saved && (
              <span className="badge-emerald text-xs">
                ✓ Settings saved successfully.
              </span>
            )}
          </div>
          <button
            className="button text-xs"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

