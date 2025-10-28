import { Request, Response, NextFunction } from 'express';
import { PartidaService } from '../services/partidaService';
import { Partida } from '../interfaces/partida';

const partidaService = new PartidaService();

export class PartidaController {
    
    // Helper para lidar com a assincronicidade e erros
    private delegate(func: (req: Request, res: Response) => Promise<void>, req: Request, res: Response, next: NextFunction): void {
        func(req, res).catch(next);
    }

    public findAll = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const partidas = await partidaService.findAll();
            res.status(200).json(partidas);
        }, req, res, next);
    }

    public findById = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            const partida = await partidaService.findById(id); // AWAIT
            res.status(200).json(partida);
        }, req, res, next);
    }

    public create = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const novaPartida = await partidaService.create(req.body as Partida); // AWAIT
            res.status(201).json(novaPartida);
        }, req, res, next);
    }
    
    public update = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            const partidaAtualizada = await partidaService.update(id, req.body); // AWAIT
            res.status(200).json(partidaAtualizada);
        }, req, res, next);
    }

    public delete = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            await partidaService.delete(id); // AWAIT
            res.status(200).json({ message: "Partida deletada com sucesso." });
        }, req, res, next);
    }
}