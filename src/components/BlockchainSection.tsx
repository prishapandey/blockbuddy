import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  BlockchainTransaction,
  ChainActivity,
  SmartContractEvent,
  TX_STATUS_COLORS,
  TX_TYPE_LABELS,
  WalletStats,
  generateActivityFeed,
  generateContractEvents,
  generateTransactions,
  generateWalletStats,
} from '../lib/blockchain';

// ---- Sub-components ------------------------------------------------

function StatusDot({ status }: { status: BlockchainTransaction['status'] }) {
  const color = TX_STATUS_COLORS[status];
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function TinyBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-1 rounded-full bg-[#1a1c22]">
      <div
        className="h-1 rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: '#4d8eff' }}
      />
    </div>
  );
}

/** Mini sparkline using SVG — no chart library needed */
function Sparkline({ data, width = 120, height = 32 }: { data: number[]; width?: number; height?: number }) {
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#4d8eff"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Area fill */}
      <polyline
        points={`0,${height} ${points} ${(data.length - 1) * step},${height}`}
        fill="url(#spark-fill)"
        strokeWidth="0"
      />
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d8eff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4d8eff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Big live activity bar chart */
function ActivityChart({ data }: { data: ChainActivity[] }) {
  const max = Math.max(...data.map((d) => d.volumeInr), 1);
  const slice = data.slice(-24);
  return (
    <div className="flex items-end gap-0.5 h-14 w-full">
      {slice.map((d, i) => {
        const pct = Math.max((d.volumeInr / max) * 100, 2);
        const isLast = i === slice.length - 1;
        return (
          <div
            key={d.minute}
            title={`${d.minute} · ₹${d.volumeInr} · ${d.txCount} tx`}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${pct}%`,
              backgroundColor: isLast ? '#4d8eff' : '#1e3a6e',
              opacity: isLast ? 1 : 0.6 + (i / slice.length) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

// ---- Main Section --------------------------------------------------

type SubTab = 'transactions' | 'contracts' | 'wallet' | 'activity';

export const BlockchainSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('transactions');
  const [txFilter, setTxFilter] = useState<'all' | BlockchainTransaction['status']>('all');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [ticking, setTicking] = useState(0); // triggers "live" re-renders

  // "live" counter — adds a new simulated tx every 8 s
  useEffect(() => {
    const id = setInterval(() => setTicking((n) => n + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const transactions = useMemo(() => generateTransactions(20), []);
  const events = useMemo(() => generateContractEvents(8), []);
  const wallet = useMemo(() => generateWalletStats(), []);
  const activityRaw = useMemo(() => generateActivityFeed(24), [ticking]);

  const filteredTxs = useMemo(
    () => (txFilter === 'all' ? transactions : transactions.filter((t) => t.status === txFilter)),
    [transactions, txFilter]
  );

  // Summary stats
  const totalVolume = transactions.reduce((s, t) => s + t.amountInr, 0);
  const confirmedCount = transactions.filter((t) => t.status === 'confirmed').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const totalGas = transactions.reduce((s, t) => s + t.gasFeeInr, 0);

  const tabs: { key: SubTab; label: string; icon: React.ElementType }[] = [
    { key: 'transactions', label: 'Transactions', icon: Zap },
    { key: 'contracts', label: 'Smart Contracts', icon: Code2 },
    { key: 'wallet', label: 'Wallet Analytics', icon: Wallet },
    { key: 'activity', label: 'Live Activity', icon: Activity },
  ];

  return (
    <section id="blockchain" className="space-y-5 border-t border-[#22252b] pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">On-chain layer</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Blockchain Activity
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1 max-w-xl">
            Real-time transaction tracking, smart contract monitoring, and wallet analytics for every campus trade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
            Live · Block #{(18_501_000 + ticking).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Volume', value: `₹${totalVolume.toLocaleString()}`, icon: TrendingUp, color: '#4d8eff' },
          { label: 'Confirmed Txs', value: confirmedCount, icon: CheckCircle2, color: '#3ecf8e' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: '#f59e0b' },
          { label: 'Gas Used (est.)', value: `₹${totalGas.toFixed(1)}`, icon: Zap, color: '#a78bfa' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-[#121316] border border-[#22252b] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748b] font-medium">{kpi.label}</span>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
              <Sparkline data={activityRaw.map((a) => a.volumeInr).slice(-12)} width={80} height={20} />
            </div>
          );
        })}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-[#0f1013] border border-[#22252b] rounded-lg w-full overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === key
                ? 'bg-[#1a1c22] text-white border border-[#22252b]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ---- TAB: TRANSACTIONS ---- */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-[#64748b]">Filter:</span>
            {(['all', 'confirmed', 'pending', 'failed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTxFilter(s)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer capitalize ${
                  txFilter === s
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-[#4d8eff]'
                    : 'border-[#22252b] text-[#64748b] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-[#64748b]">{filteredTxs.length} records</span>
          </div>

          {/* Transaction rows */}
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {filteredTxs.map((tx) => (
              <div key={tx.hash} className="bg-[#121316] border border-[#22252b] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedTx(expandedTx === tx.hash ? null : tx.hash)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#1a1c22] transition-colors cursor-pointer"
                >
                  <StatusDot status={tx.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white truncate">{tx.itemTitle}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1c22] border border-[#22252b] text-[#94a3b8] whitespace-nowrap">
                        {TX_TYPE_LABELS[tx.type]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#64748b] font-mono">{tx.hash}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-white">₹{tx.amountInr}</p>
                    <p className="text-[10px] text-[#64748b]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-[#64748b] shrink-0 transition-transform ${
                      expandedTx === tx.hash ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedTx === tx.hash && (
                  <div className="border-t border-[#22252b] p-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                    {[
                      ['Block', tx.blockNumber.toLocaleString()],
                      ['Confirmations', tx.confirmations],
                      ['Gas Fee', `₹${tx.gasFeeInr}`],
                      ['From', tx.from],
                      ['To', tx.to],
                      ['Status', tx.status.toUpperCase()],
                    ].map(([k, v]) => (
                      <div key={String(k)}>
                        <p className="text-[#64748b] mb-0.5">{k}</p>
                        <p
                          className="font-mono text-white truncate"
                          style={k === 'Status' ? { color: TX_STATUS_COLORS[tx.status] } : {}}
                        >
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- TAB: SMART CONTRACTS ---- */}
      {activeTab === 'contracts' && (
        <div className="space-y-3">
          {/* Contract cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                name: 'RentalEscrow',
                address: '0xABCD...1234',
                desc: 'Locks deposits for rental bookings. Releases on mutual confirmation.',
                events: events.filter((e) => e.contractName === 'RentalEscrow').length,
                color: '#4d8eff',
              },
              {
                name: 'MarketplaceTrade',
                address: '0x5678...EFGH',
                desc: 'Atomically swaps buyer funds and seller delivery confirmation.',
                events: events.filter((e) => e.contractName === 'MarketplaceTrade').length,
                color: '#3ecf8e',
              },
              {
                name: 'DepositVault',
                address: '0xABC9...0012',
                desc: 'Multi-sig vault holding refundable security deposits.',
                events: events.filter((e) => e.contractName === 'DepositVault').length,
                color: '#a78bfa',
              },
            ].map((c) => (
              <div key={c.name} className="bg-[#121316] border border-[#22252b] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" style={{ color: c.color }} />
                  <span className="text-sm font-semibold text-white">{c.name}</span>
                </div>
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">{c.desc}</p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#22252b]">
                  <span className="font-mono text-[#64748b]">{c.address}</span>
                  <span className="text-[#4d8eff]">{c.events} events</span>
                </div>
              </div>
            ))}
          </div>

          {/* Event log */}
          <h3 className="text-xs font-semibold text-white pt-1">Recent Contract Events</h3>
          <div className="space-y-1.5">
            {events.map((ev) => {
              const icon =
                ev.severity === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3ecf8e] shrink-0" />
                ) : ev.severity === 'warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-[#4d8eff] shrink-0" />
                );
              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 bg-[#121316] border border-[#22252b] rounded-lg p-3 text-xs"
                >
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{ev.eventName}</span>
                      <span className="text-[10px] text-[#64748b]">{ev.contractName}</span>
                      <span className="text-[10px] font-mono text-[#64748b]">#{ev.blockNumber}</span>
                    </div>
                    <p className="text-[#94a3b8] text-[11px] mt-0.5">{ev.details}</p>
                  </div>
                  <span className="text-[10px] text-[#64748b] whitespace-nowrap shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- TAB: WALLET ANALYTICS ---- */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <div className="bg-[#121316] border border-[#22252b] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/15 border border-[#4d8eff]/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#4d8eff]" />
              </div>
              <div>
                <p className="text-xs text-[#64748b]">Wallet Address</p>
                <p className="text-sm font-mono text-white">{wallet.address}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[11px] text-[#64748b]">Trust Score</p>
                <p className="text-2xl font-bold text-[#3ecf8e]">{wallet.trustScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Total Sent', value: `₹${wallet.totalSent.toLocaleString()}`, color: '#ef4444' },
                { label: 'Total Received', value: `₹${wallet.totalReceived.toLocaleString()}`, color: '#3ecf8e' },
                { label: 'Active Deposits', value: wallet.activeLocks, color: '#f59e0b' },
                { label: 'Transactions', value: wallet.txCount, color: '#4d8eff' },
              ].map((s) => (
                <div key={s.label} className="bg-[#0f1013] border border-[#22252b] rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-[#64748b]">{s.label}</p>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Trust score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748b]">Trust Score Progress</span>
                <span className="text-[#3ecf8e] font-medium">{wallet.trustScore}/100</span>
              </div>
              <div className="h-2 bg-[#1a1c22] rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${wallet.trustScore}%`,
                    backgroundColor: '#3ecf8e',
                  }}
                />
              </div>
              <p className="text-[10px] text-[#64748b]">Active since {new Date(wallet.activeSince).toLocaleDateString()}</p>
            </div>

            {/* TX breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#22252b]">
              <p className="text-[11px] font-medium text-white">Transaction Breakdown</p>
              {Object.entries(TX_TYPE_LABELS).map(([type, label]) => {
                const count = transactions.filter((t) => t.type === type).length;
                return (
                  <div key={type} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-[#94a3b8]">
                      <span>{label}</span>
                      <span>{count} txs</span>
                    </div>
                    <TinyBar value={count} max={transactions.length} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---- TAB: LIVE ACTIVITY ---- */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="bg-[#121316] border border-[#22252b] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white">Volume (last 24 mins)</p>
              <span className="flex items-center gap-1 text-[10px] text-[#4d8eff]">
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                Updating every 8 s
              </span>
            </div>
            <ActivityChart data={activityRaw} />
            <div className="flex justify-between text-[10px] text-[#64748b]">
              <span>{activityRaw[0]?.minute}</span>
              <span>Now</span>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-white">Live Feed</p>
            {activityRaw
              .slice()
              .reverse()
              .slice(0, 10)
              .map((a, i) => (
                <div
                  key={a.minute + i}
                  className="flex items-center gap-3 text-[11px] text-[#94a3b8] bg-[#121316] border border-[#22252b] rounded-lg px-3 py-2"
                >
                  <span className="font-mono text-[#64748b] w-10 shrink-0">{a.minute}</span>
                  <span className="flex-1">
                    {a.txCount} transaction{a.txCount !== 1 ? 's' : ''} — ₹{a.volumeInr} volume
                  </span>
                  <div className="w-16">
                    <TinyBar value={a.volumeInr} max={500} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};
