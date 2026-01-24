import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Sparkles, Mail, User, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("🚀 Attempting signup for:", { email, username });
            const response = await api.post('/auth/signup', {
                email,
                username,
                password
            });
            console.log("✅ Signup successful:", response.data);
            navigate('/');
        } catch (err: any) {
            console.error("❌ Signup error details:", err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail[0].msg || 'Validation error');
            } else {
                setError(detail || 'Connection failed. Is the backend running?');
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
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="inline-block p-4 bg-primary/20 rounded-2xl mb-4"
                    >
                        <Sparkles className="text-primary" size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-2 gradient-text">BEAST MODE</h1>
                    <p className="text-text-muted font-medium">Create your tutor account</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="label-text">Email Address</label>
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
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
                                <UserPlus size={22} />
                                Create Account
                                <span className="shimmer"></span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-glass-border text-center">
                    <p className="text-text-muted text-sm font-medium">
                        Already a member?
                        <button
                            onClick={() => navigate('/')}
                            className="text-primary ml-2 hover:text-secondary transition-colors font-bold"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
