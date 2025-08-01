import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Button } from '../common/Button';

const Layout: React.FC = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">
                    Gestão CRM
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link 
                        to="/" 
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/clientes" 
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Clientes
                    </Link>
                    <Link 
                        to="/relatorios" 
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Relatórios
                    </Link>
                </nav>
                
                <div className="p-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300 mb-2">
                        {user?.email}
                    </p>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={handleLogout}
                        className="w-full"
                    >
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;