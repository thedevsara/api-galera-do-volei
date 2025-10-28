import { Avaliacao } from '../../interfaces/avaliacao';

export interface IAvaliacaoRepository {
    findByAvaliadoId(id: number, tipo: 'jogador' | 'partida'): Promise<Avaliacao[]>;
    save(avaliacao: Avaliacao): Promise<Avaliacao>;
}