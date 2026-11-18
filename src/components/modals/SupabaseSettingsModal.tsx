import React, { useState } from 'react';
import { Check, Copy, Database, RefreshCw, X } from 'lucide-react';
import {
  getCurrentSupabaseConfig,
  updateSupabaseUrl,
  getSupabaseClient,
} from '../../lib/supabase';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
  sourceType: 'supabase' | 'local';
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  sourceType,
}) => {

  const currentConfig = getCurrentSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const sqlSchemaSnippet = `-- BlockBuddy persistent database schema
-- Run this once in Supabase Dashboard -> SQL Editor.
-- Public insert/read policies are suitable only for a classroom demo. Add auth-based
-- policies before using this with real student personal information.

CREATE TABLE IF NOT EXISTS public.blockbuddy_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('rental', 'urgent', 'marketplace')),
  price_display TEXT NOT NULL DEFAULT '',
  price_value NUMERIC NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT '',
  secondary_price TEXT,
  deposit TEXT,
  location_tag TEXT NOT NULL DEFAULT 'Campus',
  hostel TEXT NOT NULL DEFAULT 'H-12',
  wing_or_room TEXT NOT NULL DEFAULT '',
  seller_name TEXT NOT NULL DEFAULT 'Campus Student',
  image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available',
  badge_note TEXT,
  quick_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blockbuddy_pings (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  item_title TEXT,
  seller_name TEXT,
  sender_name TEXT,
  sender_hostel TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blockbuddy_bookings (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  item_title TEXT,
  renter_name TEXT,
  renter_hostel TEXT,
  renter_room TEXT,
  duration_type TEXT,
  duration_count NUMERIC,
  total_amount NUMERIC,
  deposit_amount NUMERIC,
  pickup_time TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blockbuddy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockbuddy_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockbuddy_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read blockbuddy_items" ON public.blockbuddy_items;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_items" ON public.blockbuddy_items;
DROP POLICY IF EXISTS "Allow public read blockbuddy_pings" ON public.blockbuddy_pings;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_pings" ON public.blockbuddy_pings;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_bookings" ON public.blockbuddy_bookings;

CREATE POLICY "Allow public read blockbuddy_items" ON public.blockbuddy_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_items" ON public.blockbuddy_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read blockbuddy_pings" ON public.blockbuddy_pings FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_pings" ON public.blockbuddy_pings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert blockbuddy_bookings" ON public.blockbuddy_bookings FOR INSERT WITH CHECK (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      updateSupabaseUrl(urlInput.trim());
      testConnection();
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestStatus('Testing Supabase endpoint with publishable key...');
    const client = getSupabaseClient();
    if (!client) {
      setTestStatus('Client not initialized. Check URL formatting.');
      setIsTesting(false);
      return;
    }

    try {
      const { data, error } = await client
        .from('blockbuddy_items')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          setTestStatus(
            'Connected to Supabase! (Note: Table "blockbuddy_items" has not been created yet. Copy and run the SQL schema below in your Supabase SQL Editor).'
          );
        } else {
          setTestStatus('Supabase responded with message: ' + error.message);
        }
      } else {
        setTestStatus('Success! Connected to Supabase table. Retrieved ' + (data?.length || 0) + ' sample rows.');
        onRefreshData();
      }
    } catch (e: any) {
      setTestStatus('Connection notice: ' + (e?.message || 'Check project URL connectivity'));
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="supabase-modal-title">
      <div className="modal-container max-w-lg">
        <header className="flex items-center justify-between border-b border-faint p-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-accent-wash/50 border border-accent/20 flex items-center justify-center text-accent">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 id="supabase-modal-title" className="text-body text-ink">Supabase Integration</h3>
              <p className="text-caption text-muted">Live database & instant local storage fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas hover:bg-faint text-muted hover:text-ink transition-colors cursor-pointer flex items-center justify-center"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="p-5 space-y-5 text-caption">
          {/* API Key Status */}
          <div className="card-elevated p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted">Publishable API Key:</span>
              <span className="px-2 py-0.5 rounded-full bg-accent-wash/50 text-accent text-[10px] font-medium flex items-center gap-1">
                <Check className="w-3 h-3" aria-hidden="true" />
                Configured
              </span>
            </div>
            <div className="font-mono text-[10px] text-ink bg-surface p-2 rounded-inner border border-faint break-all select-all">
              {currentConfig.publishableKey}
            </div>
          </div>

          {/* Project URL */}
          <div className="space-y-2">
            <label className="text-caption text-muted block">Supabase Project URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="input-pill flex-1"
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                className="btn-pill btn-pill-secondary whitespace-nowrap"
              >
                Save URL
              </button>
            </div>
          </div>

          {/* Test Connection Button & Status */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={testConnection}
              className="w-full btn-pill bg-ink hover:opacity-90 text-white py-3 justify-center disabled:opacity-50"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (isTesting ? 'animate-spin' : '')} aria-hidden="true" />
              <span>{isTesting ? 'Testing...' : 'Test Supabase Connection'}</span>
            </button>

            {testStatus && (
              <div className="card-elevated p-3 text-[10px] text-muted leading-relaxed">
                {testStatus}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-muted pt-2 border-t border-faint">
              <span>
                Active Data Engine:{' '}
                <span className="text-ink capitalize">{sourceType}</span>
              </span>
              <span className="text-accent font-medium">Safe Zero-Downtime Cache</span>
            </div>
          </div>

          {/* SQL Schema Copy Section */}
          <div className="space-y-2 pt-2 border-t border-faint">
            <div className="flex items-center justify-between">
              <span className="text-ink font-medium">Supabase Table Schema:</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="text-accent hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-accent" aria-hidden="true" />
                    <span className="text-accent">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    <span>Copy SQL Query</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-muted">
                This idempotent demo schema provisions listings, pings, and bookings. Public listing access is enabled; add authentication and ownership policies before storing real student data.
              </p>
              <pre className="bg-canvas p-3 rounded-inner text-[10px] text-muted font-mono overflow-x-auto max-h-40">
                {sqlSchemaSnippet}
              </pre>
            </div>
          </div>

          <div className="pt-2 border-t border-faint">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-pill btn-pill-secondary py-3 justify-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};