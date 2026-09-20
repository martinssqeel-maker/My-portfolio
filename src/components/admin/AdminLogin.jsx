import React, { useState } from 'react';
import { adminLogin } from '../../services/api';
import { Lock, Mail, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(email, password);
      if (response && response.user) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or login failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-[#101217] border border-[#1f222c] p-8 shadow-2xl">
        
        {/* Back Link */}
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Portfolio</span>
        </button>

        {/* Lock Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-bold text-[#f4f5f8] tracking-tight">
            Administrator Access
          </h1>
          <p className="text-xs font-mono text-[#9ca3af] mt-1">
            Sign in to manage projects, messages &amp; content
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#9ca3af] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-[#5b6270]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="martinssqeel@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#14161f] border border-[#202430] text-sm text-white placeholder-[#5b6270] focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#9ca3af] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-[#5b6270]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#14161f] border border-[#202430] text-sm text-white placeholder-[#5b6270] focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-lg text-sm font-semibold bg-[#f4f5f8] text-[#090a0d] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Authenticate Session</span>
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-5 border-t border-[#181b24] text-center">
          <p className="text-[11px] font-mono text-[#5b6270]">
            Protected by bcrypt hashing &amp; signed JWT tokens.
          </p>
        </div>

      </div>
    </div>
  );
}
