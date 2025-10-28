import { Request, Response, NextFunction } from 'express';
import { JogadorService } from '../services/jogadorService';
import { Jogador } from '../interfaces/jogador';

const jogadorService = new JogadorService();

export class JogadorController {
    
    private delegate(func: (req: Request, res: Response) => Promise<void>, req: Request, res: Response, next: NextFunction): void {
        func(req, res).catch(next);
    }
 
    public findAll = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const jogadores = await jogadorService.findAll(); 
            res.status(200).json(jogadores);
        }, req, res, next);
    }

    public create = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const novoJogador = await jogadorService.create(req.body as Jogador); 
            res.status(201).json({ 
                message: "Jogador criado com sucesso!", 
                jogador: novoJogador 
            });
        }, req, res, next);
    }

    public update = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            const jogadorAtualizado = await jogadorService.update(id, req.body); 
            res.status(200).json({
                message: "Jogador atualizado com sucesso!",
                jogador: jogadorAtualizado
            });
        }, req, res, next);
    }
    public delete = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            await jogadorService.delete(id); 
            res.status(200).json({ message: "Jogador deletado com sucesso." });
        }, req, res, next);
    }
    public getPerfilCompleto = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async () => {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido.' });
                return;
            }

            const perfil = await jogadorService.getPerfilCompleto(id); 
            res.status(200).json(perfil);
        }, req, res, next);
    }
}