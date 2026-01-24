import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Book, LogOut, MessageCircle,
    ChevronRight, Settings, User as UserIcon,
    Sparkles, GraduationCap, BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState('General Learning');
    const [userData, setUserData] = useState<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const topics = [
        { id: 'general', name: 'General Learning', icon: <GraduationCap size={18} /> },
        { id: 'math', name: 'Mathematics', icon: <BrainCircuit size={18} /> },
        { id: 'science', name: 'Science', icon: <Book size={18} /> },
        { id: 'history', name: 'History', icon: <MessageCircle size={18} /> }
    ];

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/chat/me');
            setUserData(res.data);
            setMessages([{
                role: 'ai',
                content: `Hello ${res.data.username}! I'm your AI Tutor. Which subject would you like to explore today?`
            }]);
        } catch (err) {
            navigate('/');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await api.post('/chat/ask', {
                prompt: userMsg,
                focus_area: topic
            });
            setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing your request. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="p-2 bg-primary rounded-xl text-white">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">AI Tutor <span className="text-sm font-medium text-slate-400">v2.0</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Learning Areas</p>
                    {topics.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTopic(t.name)}
                            className={`${topic === t.name ? 'active' : ''} group`}
                        >
                            <span className="transition-all group-hover:scale-110 group-active:scale-95">
                                {t.icon}
                            </span>
                            <span className="flex-1 text-left text-sm">{t.name}</span>
                            {topic === t.name && (
                                <ChevronRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3 px-2 mb-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                            <UserIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{userData?.username || 'Student'}</p>
                            <p className="text-xs text-slate-500 truncate">{userData?.email || 'Premium Plan'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl font-semibold group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <LogOut size={18} className="transition-transform group-hover:rotate-12 group-hover:scale-110" />
                        <span className="text-sm relative z-10">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-medium text-sm">Focus:</span>
                        <span className="font-bold text-slate-800 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">{topic}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 hover:border-emerald-200 transition-all group">
                            <div className="relative">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <span className="group-hover:text-emerald-600 transition-colors">Ollama Running</span>
                        </div>
                    </div>
                </header>

                <div className="chat-container">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`message-bubble ${msg.role === 'user' ? 'message-user' : 'message-ai shadow-sm'}`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">
                                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                    </span>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="message-ai message-bubble shadow-sm">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="input-area">
                    <form onSubmit={handleSendMessage} className="chat-input-wrapper">
                        <input
                            type="text"
                            placeholder={`Ask a question about ${topic}...`}
                            className="input-field pr-24 py-4 text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !w-auto !py-2 !px-4 group"
                        >
                            <Send size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            <span className="hidden sm:inline">Ask AI</span>
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                        Interactive Learning Sessions Powered by Neural Networks
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
