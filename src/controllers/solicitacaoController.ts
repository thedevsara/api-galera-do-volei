import { Request, Response, NextFunction } from 'express';
import { SolicitacaoService } from '../services/solicitacaoService';

const solicitacaoService = new SolicitacaoService();

export class SolicitacaoController {

    // Helper para lidar com a assincronicidade e erros
    private delegate(func: (req: Request, res: Response) => Promise<void>, req: Request, res: Response, next: NextFunction): void {
        func(req, res).catch(next);
    }
    
    // GET All (Consulta) - AGORA É ASYNC
    public findAll = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async (req, res) => {
            const solicitacoes = await solicitacaoService.findAll(); // AWAIT
            res.status(200).json(solicitacoes);
        }, req, res, next);
    }

    // LÓGICA: Criar Candidatura (POST) - AGORA É ASYNC
    public createCandidatura = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async (req, res) => {
            const idPartida = parseInt(req.params.id);
            const { idJogador } = req.body;

            if (isNaN(idPartida) || !idJogador) {
                res.status(400).json({ error: 'Dados incompletos ou inválidos.' });
                return;
            }

            const solicitacao = await solicitacaoService.createCandidatura(idPartida, idJogador); // AWAIT
            
            res.status(201).json({
                message: 'Candidatura criada com sucesso!',
                solicitacao
            });
        }, req, res, next);
    }

    // LÓGICA: Aceitar/Recusar Solicitação (PATCH) - AGORA É ASYNC
    public acceptOrReject = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async (req, res) => {
            const idSolicitacao = parseInt(req.params.id);
            const { status } = req.body as { status: 'aceito' | 'recusado' };

            if (!status || (status !== 'aceito' && status !== 'recusado')) {
                res.status(400).json({ error: 'Status inválido. Use "aceito" ou "recusado".' });
                return;
            }
            if (isNaN(idSolicitacao)) {
                res.status(400).json({ error: 'ID da Solicitação inválido.' });
                return;
            }

            const updatedSolicitacao = await solicitacaoService.acceptOrReject(idSolicitacao, status); // AWAIT

            if (!updatedSolicitacao) {
                res.status(404).json({ error: 'Solicitação não encontrada.' });
                return;
            }

            res.status(200).json({
                message: `Status atualizado para ${status}.`,
                solicitacao: updatedSolicitacao
            });
        }, req, res, next);
    }

    // LÓGICA: Buscar todas as solicitações por ID de Partida (GET) - AGORA É ASYNC
    public findByPartidaId = (req: Request, res: Response, next: NextFunction): void => {
        this.delegate(async (req, res) => {
            const idPartida = parseInt(req.params.id);

            if (isNaN(idPartida)) {
                res.status(400).json({ error: 'ID da Partida inválido.' });
                return;
            }
            
            const solicitacoes = await solicitacaoService.findByPartidaId(idPartida); // AWAIT
            res.status(200).json(solicitacoes);
        }, req, res, next);
    }
}