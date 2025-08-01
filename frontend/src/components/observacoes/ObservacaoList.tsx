import React from 'react';
import type { Observacao } from '../../types';

interface Props {
    observacoes: Observacao[];
}

const ObservacaoList: React.FC<Props> = ({ observacoes }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Contato realizado': return 'bg-blue-100 text-blue-800';
            case 'Retornar': return 'bg-yellow-100 text-yellow-800';
            case 'Venda concluída': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-h-96 overflow-y-auto">
            {observacoes.length > 0 ? (
                <ul className="space-y-3">
                    {observacoes.map(obs => (
                        <li key={obs.id} className="border-b pb-3 last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(obs.status)}`}>
                                    {obs.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(obs.created_at!).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{obs.observacao}</p>
                            {obs.data_retorno && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Retorno: {new Date(obs.data_retorno).toLocaleDateString()}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Nenhuma observação registrada.</p>
            )}
        </div>
    );
};

export default ObservacaoList;