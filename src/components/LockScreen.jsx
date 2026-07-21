import React, { useState } from 'react';
import { TrendingUp, Delete, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LockScreen() {
  const { users, login, loginError, setLoginError } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pin, setPin] = useState('');

  const selectUser = (userId) => {
    setSelectedUserId(userId);
    setPin('');
    setLoginError('');
  };

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      // Tenta login automaticamente ao completar 4 dígitos
      setTimeout(() => {
        const success = login(selectedUserId, newPin);
        if (!success) setPin('');
      }, 150);
    }
  };

  const handleClear = () => setPin('');

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-600/30 mb-3">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="font-bold text-2xl text-white tracking-tight">
            Venda<span className="text-green-500">Smart</span>
          </h1>
        </div>

        {!selectedUser ? (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm text-center mb-4">Quem está usando o sistema?</p>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUser(user.id)}
                className="w-full flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-green-500 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-sm shrink-0">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.label}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                {selectedUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedUser.name}</p>
                <button onClick={() => setSelectedUserId(null)} className="text-xs text-green-400 hover:underline">
                  Trocar usuário
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <p className="text-xs text-slate-400">Digite seu PIN</p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 ${
                    i < pin.length ? 'bg-green-500 border-green-500' : 'border-slate-700'
                  }`}
                />
              ))}
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 text-center mb-4">{loginError}</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className="py-4 rounded-lg bg-slate-950 border border-slate-800 text-white font-semibold hover:border-green-500 transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="py-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:border-rose-500 transition-all flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="py-4 rounded-lg bg-slate-950 border border-slate-800 text-white font-semibold hover:border-green-500 transition-all"
              >
                0
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}