import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import type { ClienteDetalheData, Observacao, SugestaoProduto } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import ObservacaoList from '../components/observacoes/ObservacaoList';
import ObservacaoForm from '../components/observacoes/ObservacaoForm';

const ClienteDetalhe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [detalhes, setDetalhes] = useState<ClienteDetalheData | null>(null);
    const [observacoes, setObservacoes] = useState<Observacao[]>([]);
    const [sugestoes, setSugestoes] = useState<SugestaoProduto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        
        try {
            const [detalhesRes, observacoesRes, sugestoesRes] = await Promise.all([
                apiClient.get<ClienteDetalheData>(`/clientes/${id}`),
                apiClient.get<Observacao[]>(`/clientes/${id}/observacoes`),
                apiClient.get<SugestaoProduto[]>(`/clientes/${id}/sugestoes`)
            ]);
            
            setDetalhes(detalhesRes.data);
            setObservacoes(observacoesRes.data);
            setSugestoes(sugestoesRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados do cliente", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleNovaObservacao = (novaObservacao: Observacao) => {
        setObservacoes([novaObservacao, ...observacoes]);
    };

    const handleWhatsAppClick = () => {
        if (!detalhes) return;
        const telefone = detalhes.info.DDD_TELEFONE + detalhes.info.TELEFONE;
        const nomeCliente = detalhes.info.NOME.split(' ')[0];
        const mensagem = encodeURIComponent(`Olá ${nomeCliente}, tudo bem? Entrando em contato sobre...`);
        window.open(`https://wa.me/55${telefone}?text=${mensagem}`, '_blank');
    };

    if (loading) return <div>Carregando detalhes do cliente...</div>;
    if (!detalhes) return <div>Cliente não encontrado.</div>;

    return (
        <div className="space-y-6">
            {/* Cabeçalho do Cliente */}
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{detalhes.info.NOME}</h1>
                        <p className="text-gray-600">{detalhes.info.CIDADE} - {detalhes.info.ESTADO}</p>
                        <div className="mt-4 flex space-x-4 text-sm">
                            <p>
                                <strong>Vendedor Ford:</strong> {detalhes.vendedoresPrincipais.ford || 'N/A'}
                            </p>
                            <p>
                                <strong>Vendedor VW:</strong> {detalhes.vendedoresPrincipais.volkswagen || 'N/A'}
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant="success"
                        onClick={handleWhatsAppClick}
                        className="flex items-center space-x-2"
                    >
                        <span>📱</span>
                        <span>WhatsApp</span>
                    </Button>
                </div>
            </Card>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-6">
                    <Card title="Nova Observação">
                        <ObservacaoForm clienteId={id!} onNovaObservacao={handleNovaObservacao} />
                    </Card>
                    
                    <Card title="Sugestões de Produtos">
                        {sugestoes.length > 0 ? (
                            <ul className="space-y-2">
                                {sugestoes.map(s => (
                                    <li key={s.item} className="flex justify-between py-1 border-b last:border-b-0">
                                        <strong>{s.item}</strong>
                                        <span className="text-gray-600">({s.quantidadeTotal} un.)</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Sem histórico de compras para gerar sugestões.</p>
                        )}
                    </Card>
                </div>
                
                {/* Coluna Direita */}
                <div className="space-y-6">
                    <Card title="Histórico de Contatos">
                        <ObservacaoList observacoes={observacoes} />
                    </Card>
                    
                    <Card title="Histórico de Vendas">
                        <ul className="max-h-96 overflow-y-auto space-y-2">
                            {detalhes.vendas.length > 0 ? (
                                detalhes.vendas.map((venda, index) => (
                                    <li key={index} className="py-2 border-b last:border-b-0">
                                        <div className="flex justify-between">
                                            <span>Data: {new Date(venda.DTA_ENTRADA_SAIDA).toLocaleDateString()}</span>
                                            <span className="font-semibold">R$ {venda.VAL_TOTAL.toFixed(2)}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">Nenhuma venda registrada.</p>
                            )}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClienteDetalhe;