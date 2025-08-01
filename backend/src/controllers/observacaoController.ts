import { Response } from 'express';
import { AuthenticatedRequest } from '../api/middlewares/authMiddleware';
import { supabase } from '../services/supabaseService';
import { Observacao } from '../types';

export const addObservacao = async (req: AuthenticatedRequest, res: Response) => {
    const { cliente_id, observacao, status, data_retorno }: Observacao = req.body;
    const vendedor_id = req.user?.id;

    if (!vendedor_id) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    if (!cliente_id || !observacao || !status) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    try {
        const { data, error } = await supabase
            .from('observacoes')
            .insert([{ 
                cliente_id, 
                vendedor_id, 
                observacao, 
                status, 
                data_retorno: data_retorno || null 
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao adicionar observação.', error: error.message });
    }
};

export const getObservacoesPorCliente = async (req: AuthenticatedRequest, res: Response) => {
    const { clienteId } = req.params;
    
    try {
        const { data, error } = await supabase
            .from('observacoes')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar observações.', error: error.message });
    }
};