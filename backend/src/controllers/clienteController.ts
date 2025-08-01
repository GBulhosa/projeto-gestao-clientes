import { Response } from 'express';
import { AuthenticatedRequest } from '../api/middlewares/authMiddleware';
import { querySqlite } from '../services/sqliteService';
import { getVendedorPrincipalPorMarca, gerarSugestoesDeProdutos } from '../services/businessLogicService';
import { Cliente, Venda } from '../types';
import { supabase } from '../services/supabaseService';

export const getClientes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const clientes = await querySqlite<Cliente>(
            'SELECT * FROM Dim_Cliente ORDER BY DTA_ULTIMA_VENDA DESC LIMIT 100'
        );
        res.status(200).json(clientes);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar clientes.', error: error.message });
    }
};

export const getClienteDetalhes = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        const clienteInfo = await querySqlite<Cliente>(
            'SELECT * FROM Dim_Cliente WHERE CLIENTE = ?', 
            [id]
        );
        
        if (clienteInfo.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        const vendas = await querySqlite<Venda>(
            'SELECT * FROM Fato_Vendas WHERE CLIENTE = ? ORDER BY DTA_ENTRADA_SAIDA DESC', 
            [id]
        );
        
        const vendedoresPrincipais = await getVendedorPrincipalPorMarca(id);

        res.status(200).json({
            info: clienteInfo[0],
            vendas,
            vendedoresPrincipais
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar detalhes do cliente.', error: error.message });
    }
};

export const getClientesAgenda = async (req: AuthenticatedRequest, res: Response) => {
    const vendedor_id = req.user?.id;
    const hoje = new Date().toISOString().split('T')[0];

    try {
        const { data, error } = await supabase
            .from('observacoes')
            .select('cliente_id, data_retorno')
            .eq('vendedor_id', vendedor_id)
            .eq('status', 'Retornar')
            .gte('data_retorno', hoje)
            .order('data_retorno', { ascending: true });

        if (error) throw error;

        const clienteIds = [...new Set(data.map(obs => obs.cliente_id))];

        if (clienteIds.length === 0) {
            return res.status(200).json([]);
        }

        const placeholders = clienteIds.map(() => '?').join(',');
        const clientes = await querySqlite<Cliente>(
            `SELECT * FROM Dim_Cliente WHERE CLIENTE IN (${placeholders})`,
            clienteIds
        );

        res.status(200).json(clientes);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar agenda de clientes.', error: error.message });
    }
};

export const getSugestoesCliente = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        const sugestoes = await gerarSugestoesDeProdutos(id);
        res.status(200).json(sugestoes);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao gerar sugestões.', error: error.message });
    }
};