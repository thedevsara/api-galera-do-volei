import { Solicitacao } from '../../interfaces/solicitacao';

export interface ISolicitacaoRepository {
    findAll(): Promise<Solicitacao[]>;
    findByPartidaId(idPartida: number): Promise<Solicitacao[]>;
    findById(id: number): Promise<Solicitacao | undefined>;
    save(solicitacao: Solicitacao): Promise<Solicitacao>;
    updateStatus(id: number, status: 'aceito' | 'recusado'): Promise<Solicitacao | undefined>;
}