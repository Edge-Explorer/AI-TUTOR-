import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/signup', {
                email,
                username,
                password
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Signup failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass glass-card"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-text-muted">Join the AI learning revolution</p>
                </div>

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-error text-sm mb-4 text-center">{error}</p>
                    )}

                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <UserPlus size={20} />
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-text-muted">
                    Already have an account?
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary ml-2 hover:underline"
                    >
                        Sign In
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default SignupPage;
