import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Sparkles, User, Database, Brain, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Message {
    message: string;
    response: string;
    created_at: string;
}

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState('Science');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/chat/history');
            setMessages(res.data);
        } catch (err) {
            if ((err as any).response?.status === 401) navigate('/');
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/', {
                message: userMsg,
                topic: topic.toLowerCase()
            });
            setMessages(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#020617] overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-[#0f172a]/50 border-r border-white/5 flex flex-col p-6 hidden md:flex">
                <div className="flex items-center gap-3 mb-12">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Brain className="text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">AI TUTOR</h2>
                        <span className="text-primary text-xs font-black tracking-widest uppercase">Beast v2.0</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Focus Area</p>
                    {['Science', 'Mathematics', 'Physics', 'History'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setTopic(item)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${topic === item ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-white/5 text-text-muted'
                                }`}
                        >
                            <span className="font-semibold">{item}</span>
                            <ChevronRight size={16} opacity={topic === item ? 1 : 0} />
                        </button>
                    ))}
                </div>

                <button onClick={handleLogout} className="mt-auto flex items-center gap-3 p-4 rounded-xl hover:bg-error/10 text-text-muted hover:text-error transition-all duration-300">
                    <LogOut size={20} />
                    <span className="font-bold">Log Out</span>
                </button>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                {/* Header */}
                <header className="p-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent/20 rounded-full animate-pulse">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                        </div>
                        <h1 className="font-bold text-xl flex items-center gap-2">
                            Session: <span className="text-accent">{topic}</span>
                        </h1>
                    </div>
                    <button className="md:hidden" onClick={handleLogout}><LogOut /></button>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col text-center space-y-6">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20"
                            >
                                <Sparkles size={40} className="text-primary" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-black mb-2">Hello, Beast!</h1>
                                <p className="text-text-muted max-w-sm">I'm initialized and ready to crush some {topic} problems. What's on your mind?</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <div key={i} className="max-w-4xl mx-auto space-y-6">
                                {/* User Message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-end pr-4"
                                >
                                    <div className="bg-[#1e293b] p-4 rounded-3xl rounded-tr-none shadow-xl border border-white/5 max-w-[80%]">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase tracking-tighter">
                                            <User size={12} /> Master Karan
                                        </div>
                                        <p className="font-medium text-slate-200 leading-relaxed">{m.message}</p>
                                    </div>
                                </motion.div>

                                {/* AI Response */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start pl-4"
                                >
                                    <div className="glass-panel p-6 rounded-3xl rounded-tl-none border-primary/20 bg-primary/5 max-w-[90%] shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                        <div className="flex items-center gap-2 mb-3 text-accent font-black text-[10px] uppercase tracking-tighter">
                                            <Sparkles size={12} /> AI Beast Engine
                                        </div>
                                        <p className="text-slate-100 whitespace-pre-wrap leading-relaxed font-normal">{m.response}</p>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-8 z-10">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                        <div className="relative">
                            <input
                                className="beast-input w-full pr-16 py-5 bg-[#0f172a] border-white/10"
                                placeholder={`Ask me a ${topic} question...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                disabled={loading || !input.trim()}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${loading ? 'bg-accent/20 text-accent' : 'bg-primary text-white hover:scale-110 active:scale-95'
                                    }`}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <Database size={20} />
                                    </motion.div>
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-text-muted mt-4 font-bold tracking-widest uppercase opacity-50">
                        Ollama Engine Running Local • Phi3 / Gemma Ready
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
