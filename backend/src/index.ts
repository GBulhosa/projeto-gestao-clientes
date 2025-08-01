import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './api/routes/dataRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', dataRoutes);

// Rota de saúde
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('API do Sistema de Gestão de Clientes está funcionando!');
});

app.listen(port, () => {
    console.log(`[server]: Servidor rodando em http://localhost:${port}`);
});