import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Sparkles, Mail, User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("🚀 Attempting signup...");
            const response = await api.post('/auth/signup', {
                email,
                username,
                password
            });
            console.log("✅ Signup successful");
            navigate('/');
        } catch (err: any) {
            console.error("❌ Signup error details:", err);
            if (!err.response) {
                setError(`Network Error. Double check if Backend is running at 127.0.0.1:8000`);
            } else {
                setError(err.response?.data?.detail || 'Signup failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-screen">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel beast-card"
            >
                <div className="text-center mb-6">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="inline-block p-4 bg-primary/20 rounded-2xl mb-4"
                    >
                        <Sparkles className="text-primary" size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-black mb-1 gradient-text uppercase tracking-tight">Beast Mode</h1>
                    <p className="text-text-muted text-sm uppercase tracking-widest font-bold">New Recruit</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="label-text">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="email"
                                className="beast-input pl-12"
                                placeholder="karan@beast.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                type={showPassword ? "text" : "password"}
                                className="beast-input pl-12 pr-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="error-text"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="beast-btn beast-btn-primary w-full mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <span>Create Account</span>}
                        <span className="shimmer"></span>
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-glass-border text-center">
                    <p className="text-text-muted text-xs font-bold uppercase tracking-wider">
                        Already a member?
                        <button
                            onClick={() => navigate('/')}
                            className="text-primary ml-2 hover:text-secondary transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
