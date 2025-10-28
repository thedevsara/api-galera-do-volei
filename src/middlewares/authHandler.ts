import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../exceptions/apiException';

const ID_ADMINISTRADOR = 99; 

export const authorizeOrganizer = (req: Request, res: Response, next: NextFunction) => { 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedException("Token de autorização ausente."));
    }

    const token = authHeader.split(' ')[1]; 
    const userId = parseInt(token); 

    if (isNaN(userId)) {
         return next(new UnauthorizedException("Token inválido."));
    }
        //Verificação da Permissão
    if (userId !== ID_ADMINISTRADOR) { 
        return next(new UnauthorizedException("Acesso negado. Apenas o administrador pode realizar esta ação.")); 
    }
    
    next();
};