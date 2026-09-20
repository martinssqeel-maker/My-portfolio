import React, { useState } from 'react';
import { Check, Zap, RefreshCw } from 'lucide-react';

export default function InteractiveZapdataDemo() {
  const [network, setNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('08031234567');
  const [selectedPlan, setSelectedPlan] = useState('1GB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);

  const networks = [
    { id: 'MTN', name: 'MTN', color: '#eab308', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    { id: 'Airtel', name: 'Airtel', color: '#ef4444', bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
    { id: 'Glo', name: 'Glo', color: '#22c55e', bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
    { id: '9mobile', name: '9mobile', color: '#10b981', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  ];

  const dataPlans = {
    MTN: [
      { id: '1GB', label: '1.0 GB SME', validity: '30 Days', price: 290 },
      { id: '2GB', label: '2.0 GB SME', validity: '30 Days', price: 580 },
      { id: '5GB', label: '5.0 GB SME', validity: '30 Days', price: 1450 },
      { id: '10GB', label: '10.0 GB Corporate', validity: '30 Days', price: 2850 },
    ],
    Airtel: [
      { id: '1.5GB', label: '1.5 GB Direct', validity: '30 Days', price: 480 },
      { id: '3GB', label: '3.0 GB Direct', validity: '30 Days', price: 950 },
      { id: '5GB', label: '5.0 GB Direct', validity: '30 Days', price: 1480 },
    ],
    Glo: [
      { id: '1.25GB', label: '1.25 GB Special', validity: '14 Days', price: 340 },
      { id: '2.5GB', label: '2.5 GB Direct', validity: '30 Days', price: 680 },
      { id: '5.8GB', label: '5.8 GB Direct', validity: '30 Days', price: 1400 },
    ],
    '9mobile': [
      { id: '1.5GB', label: '1.5 GB SME', validity: '30 Days', price: 420 },
      { id: '3GB', label: '3.0 GB SME', validity: '30 Days', price: 840 },
    ],
  };

  // Automatic carrier prefix detection for Nigerian networks
  const detectCarrier = (num) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('0803') || clean.startsWith('0806') || clean.startsWith('0703') || clean.startsWith('0706') || clean.startsWith('0813') || clean.startsWith('0816') || clean.startsWith('0810') || clean.startsWith('0814') || clean.startsWith('0903') || clean.startsWith('0906') || clean.startsWith('0913') || clean.startsWith('0916')) {
      return 'MTN';
    }
    if (clean.startsWith('0802') || clean.startsWith('0808') || clean.startsWith('0708') || clean.startsWith('0812') || clean.startsWith('0701') || clean.startsWith('0902') || clean.startsWith('0901') || clean.startsWith('0904') || clean.startsWith('0907') || clean.startsWith('0912')) {
      return 'Airtel';
    }
    if (clean.startsWith('0805') || clean.startsWith('0807') || clean.startsWith('0705') || clean.startsWith('0815') || clean.startsWith('0811') || clean.startsWith('0905') || clean.startsWith('0915')) {
      return 'Glo';
    }
    if (clean.startsWith('0809') || clean.startsWith('0817') || clean.startsWith('0818') || clean.startsWith('0909') || clean.startsWith('0908')) {
      return '9mobile';
    }
    return null;
  };

  const handlePhoneChange = (val) => {
    setPhoneNumber(val);
    const detected = detectCarrier(val);
    if (detected && detected !== network) {
      setNetwork(detected);
      setSelectedPlan(dataPlans[detected][0].id);
    }
  };

  const currentPlans = dataPlans[network] || dataPlans.MTN;
  const activePlanObj = currentPlans.find((p) => p.id === selectedPlan) || currentPlans[0];

  const handleSimulateTopup = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsProcessing(true);
    setStatus(null);

    setTimeout(() => {
      setIsProcessing(false);
      setStatus({
        success: true,
        message: `Top-up simulated: ${activePlanObj.label} sent to ${phoneNumber} (${network})!`,
      });
    }, 700);
  };

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] overflow-hidden text-left shadow-2xl">
      {/* App Bar */}
      <div className="px-4 py-3 bg-[#12141a] border-b border-[#1f222c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs font-bold text-[#f4f5f8]">
            Zapdata · VTU Purchase Flow
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#9ca3af]">
          Wallet: <span className="text-emerald-400 font-semibold">₦8,450.00</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Step 1: Select Network */}
        <div>
          <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-2">
            1. Select Network Carrier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {networks.map((net) => {
              const isSelected = network === net.id;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => {
                    setNetwork(net.id);
                    setSelectedPlan(dataPlans[net.id][0].id);
                    setStatus(null);
                  }}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition-all border ${
                    isSelected
                      ? `${net.bg} ring-2 ring-blue-500/40 shadow-xs`
                      : 'bg-[#14161f] border-[#202430] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {net.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Phone Input with Carrier Auto-detection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="zap-phone" className="text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider">
              2. Recipient Phone Number
            </label>
            <span className="text-[10px] font-mono text-emerald-400">
              Auto-detects network prefix
            </span>
          </div>
          <div className="relative">
            <input
              id="zap-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="e.g. 08031234567"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#14161f] border border-[#202430] text-sm font-mono text-white placeholder-[#5b6270] focus:border-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c202a] text-[#9ca3af]">
              {network}
            </span>
          </div>
        </div>

        {/* Step 3: Bundle Selector */}
        <div>
          <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-2">
            3. Choose Data Package
          </label>
          <div className="grid grid-cols-2 gap-2">
            {currentPlans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setStatus(null);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40 text-white'
                      : 'bg-[#14161f] border-[#202430] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">
                      {plan.id}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      ₦{plan.price}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#5b6270] mt-0.5">
                    {plan.validity} · {plan.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top-up Simulation Trigger */}
        <button
          type="button"
          onClick={handleSimulateTopup}
          disabled={isProcessing}
          className="w-full py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#f4f5f8] text-[#090a0d] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Simulating VTU Dispatch...</span>
            </>
          ) : (
            <>
              <Zap size={13} className="text-blue-600 fill-blue-600" />
              <span>
                Simulate Instant Purchase (₦{activePlanObj.price})
              </span>
            </>
          )}
        </button>

        {/* Status notification */}
        {status && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-start gap-2">
            <Check size={14} className="shrink-0 mt-0.5" />
            <span>{status.message}</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#181b24] flex items-center justify-between text-[10px] font-mono text-[#5b6270]">
          <span>Project: Zapdata Frontend Interface</span>
          <span className="text-blue-400">Interactive live prototype</span>
        </div>
      </div>
    </div>
  );
}
