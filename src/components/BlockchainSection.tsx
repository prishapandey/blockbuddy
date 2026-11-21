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
    <div className="w-full h-1.5 rounded-full bg-[#202115]">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: '#D96846' }}
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
        stroke="#D96846"
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
          <stop offset="0%" stopColor="#D96846" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D96846" stopOpacity="0" />
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
              backgroundColor: isLast ? '#D96846' : '#596235',
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
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(() => generateTransactions(20));
  const [events, setEvents] = useState<SmartContractEvent[]>(() => generateContractEvents(8));

  // "live" counter — adds a new simulated tx every 8 s
  useEffect(() => {
    const id = setInterval(() => setTicking((n) => n + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const wallet = useMemo(() => generateWalletStats(), [ticking]);
  const activityRaw = useMemo(() => generateActivityFeed(24), [ticking]);

  // Simulate an on-chain transaction interactively
  const handleSimulateAction = (actionType: 'escrow_lock' | 'escrow_release') => {
    const randomHex = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
    ).join('');
    const blockNum = 18_501_000 + ticking + 1;
    const isLock = actionType === 'escrow_lock';

    const newTx: BlockchainTransaction = {
      hash: `0x${randomHex}92a87bc12d`,
      blockNumber: blockNum,
      fromAddress: '0x3F8a...9B1c (Student)',
      toAddress: isLock ? '0x7F2e...b491 (RentalEscrow)' : '0x9D4a...f055 (DepositVault)',
      type: isLock ? 'escrow_deposit' : 'escrow_release',
      amountInr: isLock ? 150 : 150,
      gasFeeInr: 0.12,
      status: 'confirmed',
      confirmations: 1,
      timestamp: new Date().toISOString(),
    };

    const newEvent: SmartContractEvent = {
      id: `evt-${Date.now()}`,
      contractName: 'RentalEscrow',
      contractAddress: '0x7F2e0a29C77F5B6e21E42aB34b07172dB285b491',
      eventName: isLock ? 'DepositLocked' : 'DepositReleased',
      blockNumber: blockNum,
      timestamp: new Date().toISOString(),
      summary: isLock
        ? 'Security deposit of ₹150 locked in escrow for Calculator rental.'
        : 'Escrow settlement completed. Security deposit of ₹150 released back to renter.',
      severity: 'success',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setEvents((prev) => [newEvent, ...prev]);
    setTicking((n) => n + 1);
    setSimFeedback(isLock ? '⚡ Escrow deposit locked on-chain!' : '✅ Escrow deposit released!');
    setTimeout(() => setSimFeedback(null), 3000);
  };

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
    <section id="blockchain" className="space-y-6 text-[#CDCBD6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#D96846] tracking-wide uppercase">On-chain layer</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Blockchain Activity
          </h2>
          <p className="text-sm text-[#9fa293] mt-1 max-w-xl">
            Real-time transaction tracking, smart contract monitoring, and wallet analytics for every campus trade.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {simFeedback && (
            <span className="text-xs font-semibold text-white bg-[#596235] border border-[#596235] px-2.5 py-1 rounded-md shadow">
              {simFeedback}
            </span>
          )}
          <button
            type="button"
            onClick={() => handleSimulateAction('escrow_lock')}
            className="flex items-center gap-1.5 text-xs bg-[#26271a] hover:bg-[#353826] text-[#D96846] border border-[#D96846]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Simulate locking a new security deposit in RentalEscrow"
          >
            <Zap className="w-3.5 h-3.5 text-[#D96846]" />
            Simulate Deposit Lock
          </button>
          <button
            type="button"
            onClick={() => handleSimulateAction('escrow_release')}
            className="flex items-center gap-1.5 text-xs bg-[#26271a] hover:bg-[#353826] text-[#CDCBD6] border border-[#596235] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Simulate releasing escrow deposit upon successful return"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#596235]" />
            Simulate Release
          </button>
          <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#596235]/30 text-[#CDCBD6] border border-[#596235]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D96846] animate-pulse" />
            Live · Block #{(18_501_000 + ticking).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Volume', value: `₹${totalVolume.toLocaleString()}`, icon: TrendingUp, color: '#D96846' },
          { label: 'Confirmed Txs', value: confirmedCount, icon: CheckCircle2, color: '#596235' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: '#D96846' },
          { label: 'Gas Used (est.)', value: `₹${totalGas.toFixed(1)}`, icon: Zap, color: '#CDCBD6' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-[#26271a] border border-[#434630] rounded-xl p-4 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#9fa293] font-medium">{kpi.label}</span>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
              <Sparkline data={activityRaw.map((a) => a.volumeInr).slice(-12)} width={80} height={20} />
            </div>
          );
        })}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-[#202115] border border-[#434630] rounded-lg w-full overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === key
                ? 'bg-[#D96846] text-white shadow'
                : 'text-[#CDCBD6] hover:text-white hover:bg-[#2b2d1e]'
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
            <span className="text-[11px] text-[#9fa293]">Filter:</span>
            {(['all', 'confirmed', 'pending', 'failed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTxFilter(s)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer capitalize ${
                  txFilter === s
                    ? 'bg-[#D96846]/20 border-[#D96846] text-[#D96846]'
                    : 'border-[#434630] text-[#9fa293] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-[#9fa293]">{filteredTxs.length} records</span>
          </div>

          {/* Transaction rows */}
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {filteredTxs.map((tx) => (
              <div key={tx.hash} className="bg-[#26271a] border border-[#434630] rounded-lg overflow-hidden shadow">
                <button
                  type="button"
                  onClick={() => setExpandedTx(expandedTx === tx.hash ? null : tx.hash)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#2b2d1e] transition-colors cursor-pointer"
                >
                  <StatusDot status={tx.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white truncate">{tx.type}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#202115] border border-[#434630] text-[#CDCBD6] whitespace-nowrap">
                        {TX_TYPE_LABELS[tx.type]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9fa293] font-mono">{tx.hash}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-white">₹{tx.amountInr}</p>
                    <p className="text-[10px] text-[#9fa293]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-[#9fa293] shrink-0 transition-transform ${
                      expandedTx === tx.hash ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedTx === tx.hash && (
                  <div className="border-t border-[#434630] p-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] bg-[#202115]">
                    {[
                      ['Block', tx.blockNumber.toLocaleString()],
                      ['Confirmations', tx.confirmations],
                      ['Gas Fee', `₹${tx.gasFeeInr}`],
                      ['From', tx.fromAddress],
                      ['To', tx.toAddress],
                      ['Status', tx.status.toUpperCase()],
                    ].map(([k, v]) => (
                      <div key={String(k)}>
                        <p className="text-[#9fa293] mb-0.5">{k}</p>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                name: 'RentalEscrow',
                address: '0x7F2e...b491',
                desc: 'Locks security deposits for campus rental gear. Settles on mutual sign-off.',
                events: events.filter((e) => e.contractName === 'RentalEscrow').length,
                color: '#D96846',
              },
              {
                name: 'MarketplaceTrade',
                address: '0x5678...EFGH',
                desc: 'Atomically swaps buyer funds and seller handoff delivery confirmation.',
                events: events.filter((e) => e.contractName === 'MarketplaceTrade').length,
                color: '#596235',
              },
              {
                name: 'DepositVault',
                address: '0xABC9...0012',
                desc: 'Multi-sig vault holding refundable collateral during active rentals.',
                events: events.filter((e) => e.contractName === 'DepositVault').length,
                color: '#CDCBD6',
              },
            ].map((c) => (
              <div key={c.name} className="bg-[#26271a] border border-[#434630] rounded-xl p-4 space-y-2 shadow">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" style={{ color: c.color }} />
                  <span className="text-sm font-semibold text-white">{c.name}</span>
                </div>
                <p className="text-[11px] text-[#CDCBD6]/80 leading-relaxed">{c.desc}</p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#434630]">
                  <span className="font-mono text-[#9fa293]">{c.address}</span>
                  <span className="text-[#D96846] font-semibold">{c.events} events</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-semibold text-white pt-1">Recent Contract Events</h3>
          <div className="space-y-1.5">
            {events.map((ev) => {
              const icon =
                ev.severity === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596235] shrink-0" />
                ) : ev.severity === 'warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D96846] shrink-0" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-[#D96846] shrink-0" />
                );
              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 bg-[#26271a] border border-[#434630] rounded-lg p-3 text-xs"
                >
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{ev.eventName}</span>
                      <span className="text-[10px] text-[#9fa293]">{ev.contractName}</span>
                      <span className="text-[10px] font-mono text-[#9fa293]">#{ev.blockNumber}</span>
                    </div>
                    <p className="text-[#CDCBD6]/80 text-[11px] mt-0.5">{ev.summary}</p>
                  </div>
                  <span className="text-[10px] text-[#9fa293] whitespace-nowrap shrink-0">
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
          <div className="bg-[#26271a] border border-[#434630] rounded-xl p-5 space-y-4 shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D96846]/20 border border-[#D96846]/40 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#D96846]" />
              </div>
              <div>
                <p className="text-xs text-[#9fa293]">Wallet Address</p>
                <p className="text-sm font-mono text-white">{wallet.address}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[11px] text-[#9fa293]">Trust Score</p>
                <p className="text-2xl font-bold text-[#596235]">{wallet.trustScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Total Sent', value: `₹${wallet.totalSent.toLocaleString()}`, color: '#D96846' },
                { label: 'Total Received', value: `₹${wallet.totalReceived.toLocaleString()}`, color: '#596235' },
                { label: 'Active Deposits', value: wallet.activeLocks, color: '#D96846' },
                { label: 'Transactions', value: wallet.txCount, color: '#CDCBD6' },
              ].map((s) => (
                <div key={s.label} className="bg-[#202115] border border-[#434630] rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-[#9fa293]">{s.label}</p>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#9fa293]">Trust Score Progress</span>
                <span className="text-[#596235] font-semibold">{wallet.trustScore}/100</span>
              </div>
              <div className="h-2 bg-[#202115] rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${wallet.trustScore}%`,
                    backgroundColor: '#596235',
                  }}
                />
              </div>
              <p className="text-[10px] text-[#9fa293]">Active campus trader since {new Date(wallet.activeSince).toLocaleDateString()}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#434630]">
              <p className="text-[11px] font-medium text-white">Transaction Breakdown</p>
              {Object.entries(TX_TYPE_LABELS).map(([type, label]) => {
                const count = transactions.filter((t) => t.type === type).length;
                return (
                  <div key={type} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-[#CDCBD6]">
                      <span>{label}</span>
                      <span>{count} tx</span>
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
        <div className="bg-[#26271a] border border-[#434630] rounded-xl p-5 space-y-4 shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-white">Live Activity Volume (Last 24 min)</p>
              <p className="text-[11px] text-[#9fa293]">Visualizes INR throughput across hostel corridors</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#596235]/30 border border-[#596235] text-[#CDCBD6]">
              Auto-refreshes every 8s
            </span>
          </div>

          <ActivityChart data={activityRaw} />

          <div className="space-y-1 max-h-48 overflow-y-auto pt-2 border-t border-[#434630]">
            {activityRaw.slice(-8).reverse().map((a) => (
              <div key={a.minute} className="flex justify-between text-xs py-1 border-b border-[#434630]/40">
                <span className="font-mono text-[#9fa293]">{a.minute}</span>
                <span className="text-[#D96846] font-semibold">₹{a.volumeInr.toLocaleString()}</span>
                <span className="text-[#CDCBD6]">{a.txCount} tx</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
