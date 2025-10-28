import { IAvaliacaoRepository } from '../repositories/interfaces/IAvaliacaoRepository';
import { AvaliacaoPostgreRepository } from '../repositories/avaliacaoPostgreRepository';
import { Avaliacao } from '../interfaces/avaliacao';
import { BadRequestException } from '../exceptions/apiException';

export class AvaliacaoService {

    private avaliacaoRepository: IAvaliacaoRepository;

    constructor() {
        // Instancia a implementação PostgreSQL
        this.avaliacaoRepository = new AvaliacaoPostgreRepository();
    }

    public async create(avaliacaoData: Avaliacao): Promise<Avaliacao> {
        if (avaliacaoData.nota < 0 || avaliacaoData.nota > 10) {
            throw new BadRequestException("A nota deve estar entre 0 e 10.");
        }
                return this.avaliacaoRepository.save(avaliacaoData);
    }
        public async findByAvaliadoId(id: number, tipo: 'jogador' | 'partida'): Promise<Avaliacao[]> {
        return this.avaliacaoRepository.findByAvaliadoId(id, tipo);
    }
}