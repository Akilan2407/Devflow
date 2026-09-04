import type { ReactElement } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';

export const OrganizationSettingsPage = (): ReactElement => {
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const save = async (): Promise<void> => {
    await apiClient.patch(`/organizations/${id}`, { description });
    setSaved(true);
  };
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Organization settings</h1>
        <textarea
          className="input mt-6 min-h-32"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button className="button mt-4 max-w-fit" onClick={() => void save()}>
          Save settings
        </button>
        {saved && <p className="mt-3 text-sm text-emerald-700">Settings saved.</p>}
      </div>
    </main>
  );
};
