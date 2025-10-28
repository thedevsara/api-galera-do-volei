import { Router } from 'express';
import { SolicitacaoController } from '../controllers/solicitacaoController';

const router = Router();
const solicitacaoController = new SolicitacaoController();


router.get('/', solicitacaoController.findAll); 


router.post('/:id/candidatura', solicitacaoController.createCandidatura);

router.get('/:id/solicitacoes', solicitacaoController.findByPartidaId);

export default router;