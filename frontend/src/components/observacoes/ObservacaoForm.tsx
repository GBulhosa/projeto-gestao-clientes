import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import type { Observacao } from '../../types';
import { Button } from '../common/Button';

interface Props {
    clienteId: string;
    onNovaObservacao: (obs: Observacao) => void;
}

type Status = 'Contato realizado' | 'Retornar' | 'Venda concluída';

const ObservacaoForm: React.FC<Props> = ({ clienteId, onNovaObservacao }) => {
    const [observacao, setObservacao] = useState('');
    const [status, setStatus] = useState<Status>('Contato realizado');
    const [dataRetorno, setDataRetorno] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                cliente_id: clienteId,
                observacao,
                status,
                data_retorno: status === 'Retornar' ? dataRetorno : null,
            };

            const response = await apiClient.post<Observacao>('/observacoes', payload);
            onNovaObservacao(response.data);

            // Limpa o formulário
            setObservacao('');
            setDataRetorno('');
            setStatus('Contato realizado');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erro ao salvar observação:", error.message);
            } else {
                console.error("Erro desconhecido ao salvar observação.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
                    Observação
                </label>
                <textarea
                    id="observacao"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="Contato realizado">Contato realizado</option>
                    <option value="Retornar">Retornar</option>
                    <option value="Venda concluída">Venda concluída</option>
                </select>
            </div>

            {status === 'Retornar' && (
                <div>
                    <label htmlFor="dataRetorno" className="block text-sm font-medium text-gray-700">
                        Data de Retorno
                    </label>
                    <input
                        type="date"
                        id="dataRetorno"
                        value={dataRetorno}
                        onChange={(e) => setDataRetorno(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? 'Salvando...' : 'Salvar Observação'}
            </Button>
        </form>
    );
};

export default ObservacaoForm;
