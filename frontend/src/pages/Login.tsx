import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <Card title="Login no Sistema">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;