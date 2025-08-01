import React from 'react';
import { Card } from '../components/common/Card';

const Relatorios: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Relatórios</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Relatórios Disponíveis">
                    <p className="text-gray-600 mb-4">
                        A estrutura para a página de relatórios está pronta.
                        Aqui você poderá adicionar gráficos e tabelas com os indicadores de desempenho.
                    </p>
                    
                    <h4 className="font-semibold mb-2">Próximas implementações:</h4>
                    <ul className="list-disc list-inside text-gray-500 space-y-1">
                        <li>Total de ligações por mês</li>
                        <li>Rentabilidade por cliente</li>
                        <li>Desempenho por vendedor</li>
                        <li>Produtos mais vendidos</li>
                        <li>Análise de recência de clientes</li>
                    </ul>
                </Card>
                
                <Card title="Métricas Rápidas">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Clientes ativos:</span>
                            <span className="font-bold">1,234</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Vendas este mês:</span>
                            <span className="font-bold">R$ 45.230</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Meta atingida:</span>
                            <span className="font-bold text-green-600">75%</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Relatorios;