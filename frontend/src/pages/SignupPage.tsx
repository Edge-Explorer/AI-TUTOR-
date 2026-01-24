import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Mail, User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
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
            await api.post('/auth/signup', { email, username, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Signup failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
            >
                <div className="text-center mb-8">
                    <div className="icon-container mb-4">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-1">Start your personalized learning experience today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="form-group">
                        <label className="label-text">Email Address</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                className="input-field pl-12"
                                placeholder="student@university.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-text">Username</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                className="input-field pl-12"
                                placeholder="choose_a_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-text">Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field pl-12 pr-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="icon-button"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-box text-center">
                            {error}
                        </motion.div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary mt-4">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Register Now</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-slate-500 text-sm">
                        Already have an account?
                        <button onClick={() => navigate('/')} className="link-button">
                            Login here
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
