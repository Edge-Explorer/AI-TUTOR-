import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Sparkles, User, Database } from 'lucide-react';
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
            console.error("Failed to fetch history");
            // If 401, redirect to login
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
            const res = await api.post('/chat/', { message: userMsg });
            setMessages([...messages, res.data]);
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
        <div className="flex flex-col h-screen bg-bg-dark text-white">
            {/* Header */}
            <header className="glass px-6 py-4 flex justify-between items-center rounded-none border-t-0 border-x-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    <h1 className="text-xl font-bold">AI Tutor 2.0</h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-text-muted hover:text-white transition">
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <div key={i} className="space-y-4">
                            {/* User Message */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-end"
                            >
                                <div className="bg-primary/20 border border-primary/30 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                                    <p className="text-sm text-primary-hover font-semibold mb-1 flex items-center gap-1">
                                        <User size={12} /> You
                                    </p>
                                    <p>{m.message}</p>
                                </div>
                            </motion.div>

                            {/* AI Response */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-start"
                            >
                                <div className="glass p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <p className="text-sm text-accent font-semibold mb-1 flex items-center gap-1">
                                        <Sparkles size={12} /> AI Tutor
                                    </p>
                                    <p className="whitespace-pre-wrap leading-relaxed">{m.response}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 glass rounded-none border-b-0 border-x-0">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
                    <input
                        className="input-field w-full pr-12 py-4"
                        placeholder="Ask anything about Math or Science..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Database size={24} />
                            </motion.div>
                        ) : (
                            <Send size={24} />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
