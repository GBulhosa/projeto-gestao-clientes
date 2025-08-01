import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../services/supabaseService';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno na validação do token.' });
    }
};