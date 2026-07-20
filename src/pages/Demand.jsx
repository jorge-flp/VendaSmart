import React, { useState } from 'react';
import { Sparkles, Bot, Send } from 'lucide-react';

export default function Demand() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Olá! Sou o VendaSmart IA. Como posso ajudar na previsão da sua produção de amanhã?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Analisando os registros: Recomendamos aumentar a produção em 15% para o lote de amanhã.'
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          VendaSmart IA <Sparkles className="w-5 h-5 text-green-400" />
        </h1>
        <p className="text-slate-400 text-sm">Assistente de previsão de demanda.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-green-600/20 text-green-400 border border-green-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-4 rounded-xl text-sm max-w-md ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-slate-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Quanto devo produzir amanhã?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}