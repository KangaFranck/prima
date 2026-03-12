import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Send, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { apiClient, invalidateDataCache } from '../../services/apiClient';

type Subscriber = { id: string; email: string; created_at: string };

const MONTH_LABELS: Record<string, string> = {
  '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril', '05': 'Mai', '06': 'Juin',
  '07': 'Juillet', '08': 'Août', '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre',
};

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function getMonthLabel(key: string): string {
  const [, m] = key.split('-');
  const [y] = key.split('-');
  return `${MONTH_LABELS[m] || m} ${y}`;
}

export const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        invalidateDataCache('newsletter');
        const data = await apiClient.newsletter.list();
        if (!cancelled) setSubscribers(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur lors du chargement.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const byMonth = useMemo(() => {
    const map = new Map<string, Subscriber[]>();
    for (const s of subscribers) {
      const key = getMonthKey(s.created_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    return keys.map((key) => ({ key, label: getMonthLabel(key), items: map.get(key)! }));
  }, [subscribers]);

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => setExpandedMonths(new Set(byMonth.map((m) => m.key)));
  const collapseAll = () => setExpandedMonths(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectMonth = (key: string) => {
    const month = byMonth.find((m) => m.key === key);
    if (!month) return;
    const ids = new Set(month.items.map((s) => s.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = month.items.every((s) => next.has(s.id));
      if (allSelected) {
        month.items.forEach((s) => next.delete(s.id));
      } else {
        month.items.forEach((s) => next.add(s.id));
      }
      return next;
    });
  };

  const selectAll = () => {
    const all = subscribers.map((s) => s.id);
    setSelectedIds((prev) => {
      if (prev.size === subscribers.length) return new Set();
      return new Set(all);
    });
  };

  const selectedEmails = subscribers.filter((s) => selectedIds.has(s.id)).map((s) => s.email);

  const handleFaireAnnonce = () => {
    if (selectedEmails.length === 0) return;
    const mailto = `mailto:${selectedEmails.join(',')}`;
    window.open(mailto, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`Supprimer ${ids.length} abonné(s) sélectionné(s) ?`)) return;
    setDeleting(true);
    try {
      await apiClient.newsletter.deleteMany(ids);
      invalidateDataCache('newsletter');
      setSubscribers((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-[#2C2C2C] flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Newsletter
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#2C2C2C] text-[#F5F5DC] hover:bg-[#3D3D3D] transition-colors"
          >
            Tout développer
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#2C2C2C] text-[#F5F5DC] hover:bg-[#3D3D3D] transition-colors"
          >
            Tout réduire
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#2C2C2C] text-[#F5F5DC] hover:bg-[#3D3D3D] transition-colors"
          >
            {selectedIds.size === subscribers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
          <button
            type="button"
            onClick={handleFaireAnnonce}
            disabled={selectedEmails.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            Faire une annonce ({selectedEmails.length})
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer ({selectedIds.size})
          </button>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
          Aucun abonné pour le moment.
        </div>
      ) : (
        <div className="space-y-2">
          {byMonth.map(({ key, label, items }) => {
            const isExpanded = expandedMonths.has(key);
            const monthSelectedCount = items.filter((s) => selectedIds.has(s.id)).length;
            const allMonthSelected = items.length > 0 && monthSelectedCount === items.length;

            return (
              <div key={key} className="rounded-lg border border-[#E8E8D5] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMonth(key)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F5DC]/50 hover:bg-[#F5F5DC]/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#2C2C2C]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#2C2C2C]" />
                    )}
                    <span className="font-medium text-[#2C2C2C]">{label}</span>
                    <span className="text-sm text-gray-500">({items.length} abonné{items.length > 1 ? 's' : ''})</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); selectMonth(key); }}
                    className="px-2 py-1 text-xs rounded bg-[#2C2C2C] text-[#F5F5DC] hover:bg-[#3D3D3D]"
                  >
                    {allMonthSelected ? 'Désélectionner' : 'Sélectionner'} le mois
                  </button>
                </button>
                {isExpanded && (
                  <div className="border-t border-[#E8E8D5] divide-y divide-[#E8E8D5]">
                    {items.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-[#2C2C2C]">{s.email}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(s.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
