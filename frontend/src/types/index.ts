export interface Cliente {
    CLIENTE: string;
    NOME: string;
    CIDADE: string;
    ESTADO: string;
    DDD_TELEFONE: string;
    TELEFONE: string;
    DTA_ULTIMA_VENDA: string;
}

export interface Venda {
    DTA_ENTRADA_SAIDA: string;
    VAL_TOTAL: number;
}

export interface Observacao {
    id?: number;
    cliente_id: string;
    vendedor_id: string;
    observacao: string;
    status: 'Contato realizado' | 'Retornar' | 'Venda concluída';
    data_retorno?: string | null;
    created_at?: string;
}

export interface SugestaoProduto {
    item: string;
    quantidadeTotal: number;
}

export interface ClienteDetalheData {
    info: Cliente;
    vendas: Venda[];
    vendedoresPrincipais: { ford: string | null; volkswagen: string | null; };
}