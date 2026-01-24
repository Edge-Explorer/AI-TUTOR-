import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass glass-card"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">AI Tutor 2.0</h1>
                    <p className="text-text-muted">Master Math & Science with AI</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="input-field"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-error text-sm mb-4 text-center">{error}</p>
                    )}

                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <LogIn size={20} />
                        Enter Beast Mode
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-text-muted">
                    Don't have an account?
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-primary ml-2 hover:underline"
                    >
                        Sign Up
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
