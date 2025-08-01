import { Router } from 'express';
import * as clienteController from '../../controllers/clienteController';
import * as observacaoController from '../../controllers/observacaoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplica autenticação a todas as rotas
router.use(authMiddleware);

// Rotas de clientes
router.get('/clientes', clienteController.getClientes);
router.get('/clientes/agenda', clienteController.getClientesAgenda);
router.get('/clientes/:id', clienteController.getClienteDetalhes);
router.get('/clientes/:id/sugestoes', clienteController.getSugestoesCliente);

// Rotas de observações
router.post('/observacoes', observacaoController.addObservacao);
router.get('/clientes/:clienteId/observacoes', observacaoController.getObservacoesPorCliente);

export default router;