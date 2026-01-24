import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, User, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("🚀 Attempting login for:", username);
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            localStorage.setItem('token', response.data.access_token);
            console.log("✅ Login successful");
            navigate('/dashboard');
        } catch (err: any) {
            console.error("❌ Login error:", err);
            setError(err.response?.data?.detail || 'Invalid credentials or server offline.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-screen">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel beast-card"
            >
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="inline-block p-4 bg-primary/20 rounded-2xl mb-4"
                    >
                        <Sparkles className="text-primary" size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-2 gradient-text">AI TUTOR 2.0</h1>
                    <p className="text-text-muted font-medium">Welcome Back, Beast!</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="label-text">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                className="beast-input pl-12"
                                placeholder="karan_the_beast"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label-text">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="password"
                                className="beast-input pl-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="error-text"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="beast-btn beast-btn-primary w-full"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <LogIn size={22} />
                                Unleash Beast Mode
                                <span className="shimmer"></span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-glass-border text-center">
                    <p className="text-text-muted text-sm font-medium">
                        New to AI Tutor?
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary ml-2 hover:text-secondary transition-colors font-bold"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
