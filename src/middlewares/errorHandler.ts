import { Request, Response, NextFunction } from 'express';
import { ApiException } from '../exceptions/apiException';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Verifica se é uma exceção da nossa API
    if (err instanceof ApiException) {
        return res.status(err.statusCode).json({
            error: err.message,
            statusCode: err.statusCode
        });
    }

    // 2. Trata qualquer outro erro inesperado (erro 500)
    console.error(err.stack); 
    return res.status(500).json({
        error: "Ocorreu um erro interno e inesperado no servidor.",
        statusCode: 500
    });
};