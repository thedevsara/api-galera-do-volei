import { Request, Response, NextFunction } from 'express';
import { AvaliacaoService } from '../services/avaliacaoService';
import { Avaliacao } from '../interfaces/avaliacao';

const avaliacaoService = new AvaliacaoService();

export class AvaliacaoController {
    public create = (req: Request, res: Response, next: NextFunction): void => {
        // Helper para lidar com a assincronicidade
        const delegate = (func: (req: Request, res: Response) => Promise<void>) => func(req, res).catch(next);
        
        delegate(async (req, res) => {
            const avaliacaoData = req.body as Avaliacao;

            const novaAvaliacao = await avaliacaoService.create(avaliacaoData); 

            res.status(201).json({
                message: "Avaliação registrada com sucesso.",
                avaliacao: novaAvaliacao
            });
        });
    }
}