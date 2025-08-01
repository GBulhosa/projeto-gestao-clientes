import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import apiClient from '../api/apiClient';
import type { Cliente } from '../types';

const Dashboard: React.FC = () => {
    const [clientesAgenda, setClientesAgenda] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get<Cliente[]>('/clientes/agenda')
            .then(res => setClientesAgenda(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Diário</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card title="Clientes na Agenda">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            <p className="text-4xl font-bold text-blue-600">
                                {clientesAgenda.length}
                            </p>
                            <p className="text-gray-500">Contatos com retorno agendado</p>
                        </>
                    )}
                </Card>
                
                <Card title="Meta Diária">
                    <p className="text-4xl font-bold text-green-600">75%</p>
                    <p className="text-gray-500">Progresso das metas</p>
                </Card>
                
                <Card title="Vendas do Mês">
                    <p className="text-4xl font-bold text-purple-600">R$ 45.230</p>
                    <p className="text-gray-500">Total vendido</p>
                </Card>
            </div>

            <Card title="Agenda de Retornos">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <ul className="max-h-96 overflow-y-auto">
                        {clientesAgenda.length > 0 ? (
                            clientesAgenda.map(cliente => (
                                <li key={cliente.CLIENTE} className="py-2 border-b last:border-b-0">
                                    <Link 
                                        to={`/clientes/${cliente.CLIENTE}`} 
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {cliente.NOME}
                                    </Link>
                                    <p className="text-sm text-gray-600">
                                        {cliente.CIDADE} - {cliente.ESTADO}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum retorno agendado para hoje.</p>
                        )}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;