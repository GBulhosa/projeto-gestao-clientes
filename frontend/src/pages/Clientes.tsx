import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import type { Cliente } from '../types';
import { Card } from '../components/common/Card';

const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient.get<Cliente[]>('/clientes')
            .then(res => setClientes(res.data))
            .catch(err => {
                setError('Erro ao carregar clientes');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Carregando clientes...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Clientes</h1>
            
            <Card>
                <ul className="divide-y divide-gray-200">
                    {clientes.map(cliente => (
                        <li key={cliente.CLIENTE} className="py-3">
                            <Link 
                                to={`/clientes/${cliente.CLIENTE}`} 
                                className="block hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                                <p className="font-semibold text-blue-700">{cliente.NOME}</p>
                                <p className="text-sm text-gray-600">
                                    {cliente.CIDADE} - {cliente.ESTADO}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Última venda: {new Date(cliente.DTA_ULTIMA_VENDA).toLocaleDateString()}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default Clientes;