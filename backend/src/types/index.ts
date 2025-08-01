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
    EMPRESA: number;
    REVENDA: number;
    CLIENTE: string;
    VENDEDOR: string;
    ITEM_ESTOQUE: string;
    QTDE: number;
    VAL_TOTAL: number;
    DTA_ENTRADA_SAIDA: string;
}

export interface Observacao {
    id?: number;
    cliente_id: string;
    vendedor_id: string;
    observacao: string;
    status: 'Contato realizado' | 'Retornar' | 'Venda concluída';
    data_contato?: string;
    data_retorno?: string | null;
    created_at?: string;
}

export interface SugestaoProduto {
    item: string;
    quantidadeTotal: number;
}

export interface VendedorPrincipal {
    ford: string | null;
    volkswagen: string | null;
}