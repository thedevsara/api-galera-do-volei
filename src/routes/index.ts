import { Router } from 'express';
import { JogadorController } from '../controllers/jogadorController';
import { SolicitacaoController } from '../controllers/solicitacaoController';
import { PartidaController } from '../controllers/partidaController';
import { AvaliacaoController } from '../controllers/avaliacaoController';
import { authorizeOrganizer } from '../middlewares/authHandler'; 

const routes = Router();
const jogadorController = new JogadorController();
const solicitacaoController = new SolicitacaoController();
const partidaController = new PartidaController();
const avaliacaoController = new AvaliacaoController(); 
// -----------------------------------------------------------
// ROTAS DE JOGADORES (CRUD COMPLETO)
// -----------------------------------------------------------
routes.get('/jogadores', jogadorController.findAll);
routes.get('/jogadores/:id', jogadorController.getPerfilCompleto);
routes.post('/jogadores', jogadorController.create);
routes.put('/jogadores/:id', jogadorController.update);
routes.delete('/jogadores/:id', jogadorController.delete);

// -----------------------------------------------------------
// ROTAS DE PARTIDAS (CRUD COMPLETO)
// -----------------------------------------------------------
routes.get('/partidas', partidaController.findAll);
routes.get('/partidas/:id', partidaController.findById);
routes.post('/partidas', partidaController.create);
routes.put('/partidas/:id', partidaController.update);
routes.delete('/partidas/:id', partidaController.delete);

// -----------------------------------------------------------
// ROTAS DE SOLICITAÇÕES (TRANSAÇÕES E CONSULTA)
// -----------------------------------------------------------
routes.get('/solicitacoes', solicitacaoController.findAll);
routes.post('/partidas/:id/candidatura', solicitacaoController.createCandidatura);
routes.patch('/solicitacoes/:id', authorizeOrganizer, solicitacaoController.acceptOrReject);
routes.get('/partidas/:id/solicitacoes', solicitacaoController.findByPartidaId);

// -----------------------------------------------------------
// ROTAS DE AVALIAÇÕES (TRANSAÇÃO) 
// -----------------------------------------------------------
routes.post('/avaliacoes', avaliacaoController.create); 

export default routes;