import React, { useState } from 'react';
import { Check, Copy, Database, ExternalLink, RefreshCw, X } from 'lucide-react';
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
  if (!isOpen) return null;

  const currentConfig = getCurrentSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const sqlSchemaSnippet = `-- BlockBuddy Supabase Database Schema
CREATE TABLE IF NOT EXISTS blockbuddy_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'rental', 'urgent', 'marketplace'
  price_display TEXT,
  price_value NUMERIC DEFAULT 0,
  price_unit TEXT,
  secondary_price TEXT,
  deposit TEXT,
  location_tag TEXT,
  hostel TEXT,
  wing_or_room TEXT,
  seller_name TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'available',
  badge_note TEXT,
  quick_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockbuddy_pings (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  item_title TEXT,
  seller_name TEXT,
  sender_name TEXT,
  sender_hostel TEXT,
  message TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockbuddy_bookings (
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
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read & insert for campus peer exchange
ALTER TABLE blockbuddy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockbuddy_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockbuddy_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read blockbuddy_items" ON blockbuddy_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_items" ON blockbuddy_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read blockbuddy_pings" ON blockbuddy_pings FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_pings" ON blockbuddy_pings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert blockbuddy_bookings" ON blockbuddy_bookings FOR INSERT WITH CHECK (true);
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
          setTestStatus(`Supabase responded with message: ${error.message}`);
        }
      } else {
        setTestStatus(`Success! Connected to Supabase table. Retrieved ${data?.length || 0} sample rows.`);
        onRefreshData();
      }
    } catch (e: any) {
      setTestStatus(`Connection notice: ${e?.message || 'Check project URL connectivity'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-lg rounded-xl p-6 space-y-4 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Supabase Integration</h3>
              <p className="text-[11px] text-[#94a3b8]">Live database &amp; instant local storage fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* API Key Status */}
        <div className="bg-[#0a0a0c] border border-[#22252b] rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8] font-medium">Publishable API Key:</span>
            <span className="px-2 py-0.5 rounded bg-[#3ecf8e]/15 text-[#3ecf8e] text-[10px] font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="font-mono text-[11px] text-white bg-[#121316] p-2 rounded border border-[#22252b] break-all select-all">
            {currentConfig.publishableKey}
          </div>
        </div>

        {/* Project URL */}
        <div className="space-y-1.5 text-xs">
          <label className="text-[#94a3b8] font-medium block">Supabase Project URL:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="flex-1 bg-[#0a0a0c] border border-[#22252b] rounded text-white p-2 text-xs focus:outline-none focus:border-[#4d8eff]"
            />
            <button
              type="button"
              onClick={handleSaveUrl}
              className="bg-[#1a1c22] hover:bg-[#252830] text-white px-3 py-2 rounded text-xs transition-colors cursor-pointer"
            >
              Save URL
            </button>
          </div>
        </div>

        {/* Test Connection Button & Status */}
        <div className="space-y-2 text-xs">
          <button
            type="button"
            disabled={isTesting}
            onClick={testConnection}
            className="w-full bg-[#3ecf8e] hover:bg-[#34b27b] text-[#0a0a0c] font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Supabase Connection'}</span>
          </button>

          {testStatus && (
            <div className="p-2.5 rounded bg-[#0a0a0c] border border-[#22252b] text-[11px] text-[#94a3b8] leading-relaxed">
              {testStatus}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1">
            <span>
              Active Data Engine:{' '}
              <span className="text-white font-medium capitalize">{sourceType}</span>
            </span>
            <span className="text-[#3ecf8e]">Safe Zero-Downtime Cache</span>
          </div>
        </div>

        {/* SQL Schema Copy Section */}
        <div className="space-y-2 pt-2 border-t border-[#22252b] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Supabase Table Schema:</span>
            <button
              type="button"
              onClick={handleCopySql}
              className="text-[#4d8eff] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3 h-3 text-[#3ecf8e]" />
                  <span className="text-[#3ecf8e]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy SQL Query</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-[#94a3b8]">
            Paste this SQL into your{' '}
            <span className="text-white">Supabase Dashboard &gt; SQL Editor</span> to provision the
            listings, pings, and bookings tables.
          </p>
          <pre className="bg-[#0a0a0c] p-2.5 rounded border border-[#22252b] text-[10px] text-[#94a3b8] font-mono overflow-x-auto max-h-32">
            {sqlSchemaSnippet}
          </pre>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#1a1c22] hover:bg-[#252830] text-white text-xs font-medium py-2 rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
