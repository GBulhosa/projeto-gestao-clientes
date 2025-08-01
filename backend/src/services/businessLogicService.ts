import { querySqlite } from './sqliteService';
import { Venda, SugestaoProduto, VendedorPrincipal } from '../types';

// Mapeamento de empresas e revendas para as marcas
const VW_MAP: { [empresa: number]: number[] } = { 
    5: [1, 2, 3], 
    7: [1, 2] 
};

const FORD_MAP: { [empresa: number]: number[] } = { 
    5: [4, 5] 
};

const isBrandSale = (sale: Venda, brandMap: typeof VW_MAP): boolean => {
    return brandMap[sale.EMPRESA]?.includes(sale.REVENDA) ?? false;
};

export const getVendedorPrincipalPorMarca = async (clienteId: string): Promise<VendedorPrincipal> => {
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
    const dataFormatada = umAnoAtras.toISOString().split('T')[0];

    const vendas = await querySqlite<Venda>(
        `SELECT * FROM Fato_Vendas WHERE CLIENTE = ? AND DTA_ENTRADA_SAIDA >= ?`,
        [clienteId, dataFormatada]
    );

    const quatroMesesAtras = new Date();
    quatroMesesAtras.setMonth(quatroMesesAtras.getMonth() - 4);

    const vendasRecentes = vendas.filter(v => new Date(v.DTA_ENTRADA_SAIDA) >= quatroMesesAtras);

    const calcularVendedorPrincipal = (vendas: Venda[], brandMap: typeof VW_MAP): string | null => {
        const vendasPorVendedor: { [vendedor: string]: number } = {};

        vendas.forEach(venda => {
            if (isBrandSale(venda, brandMap)) {
                vendasPorVendedor[venda.VENDEDOR] = (vendasPorVendedor[venda.VENDEDOR] || 0) + venda.VAL_TOTAL;
            }
        });

        if (Object.keys(vendasPorVendedor).length === 0) return null;

        return Object.entries(vendasPorVendedor).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    };

    const vendedorFord = calcularVendedorPrincipal(vendasRecentes, FORD_MAP);
    const vendedorVolkswagen = calcularVendedorPrincipal(vendasRecentes, VW_MAP);

    return { ford: vendedorFord, volkswagen: vendedorVolkswagen };
};

export const gerarSugestoesDeProdutos = async (clienteId: string): Promise<SugestaoProduto[]> => {
    const vendas = await querySqlite<Venda>(
        `SELECT ITEM_ESTOQUE, QTDE FROM Fato_Vendas WHERE CLIENTE = ?`,
        [clienteId]
    );

    const contagemItens: { [item: string]: number } = {};

    for (const venda of vendas) {
        contagemItens[venda.ITEM_ESTOQUE] = (contagemItens[venda.ITEM_ESTOQUE] || 0) + venda.QTDE;
    }

    return Object.entries(contagemItens)
        .map(([item, quantidadeTotal]) => ({ item, quantidadeTotal }))
        .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal)
        .slice(0, 5);
};