import { ISolicitacaoRepository } from '../repositories/interfaces/ISolicitacaoRepository'; // Interface
import { SolicitacaoPostgreRepository } from '../repositories/solicitacaoPostgreRepository'; // Implementação
import { IPartidaRepository } from '../repositories/interfaces/IPartidaRepository'; // Dependência
import { PartidaPostgreRepository } from '../repositories/partidaPostgreRepository'; // Dependência
import { IJogadorRepository } from '../repositories/interfaces/IJogadorRepository'; // Dependência
import { JogadorPostgreRepository } from '../repositories/jogadorPostgreRepository'; // Dependência
import { Solicitacao } from '../interfaces/solicitacao';

export class SolicitacaoService {
    private solicitacaoRepository: ISolicitacaoRepository; 
    private partidaRepository: IPartidaRepository;
    private jogadorRepository: IJogadorRepository;

    constructor() {
        this.solicitacaoRepository = new SolicitacaoPostgreRepository(); // Instancia Implementação
        this.partidaRepository = new PartidaPostgreRepository(); // Instancia Implementação
        this.jogadorRepository = new JogadorPostgreRepository(); // Instancia Implementação
    }

    // GET All (Consulta)
    public async findAll(): Promise<Solicitacao[]> {
        return this.solicitacaoRepository.findAll();
    }
    
    // Criar Candidatura (POST) 
    public async createCandidatura(idPartida: number, idJogador: number): Promise<Solicitacao> { 
        const partida = await this.partidaRepository.findById(idPartida); 
        const jogador = await this.jogadorRepository.findById(idJogador);

        if (!partida || !jogador) {
            throw new Error("Partida ou Jogador não encontrado.");
        }
        
        // Lógica de Negócio: Impedir candidaturas duplicadas
        const candidaturasExistentes = await this.solicitacaoRepository.findByPartidaId(idPartida); // AWAIT
        const jaCandidatou = candidaturasExistentes.some(s => s.idJogador === idJogador);
        if (jaCandidatou) {
            throw new Error("Jogador já se candidatou para esta partida.");
        }

        const novaSolicitacao: Solicitacao = {
            id: 0, 
            idPartida: idPartida,
            idJogador: idJogador,
            status: 'pendente'
        };

        return this.solicitacaoRepository.save(novaSolicitacao); 
    }

    // Aceitar/Recusar Solicitação (PATCH) 
    public async acceptOrReject(idSolicitacao: number, status: 'aceito' | 'recusado'): Promise<Solicitacao | null> {
        const updatedSolicitacao = await this.solicitacaoRepository.updateStatus(idSolicitacao, status); // AWAIT

        if (!updatedSolicitacao) {
            return null;
        }
        return updatedSolicitacao;
    }

    //Buscar todas as solicitações por ID de Partida (GET) 
    public async findByPartidaId(idPartida: number): Promise<Solicitacao[]> {
        return this.solicitacaoRepository.findByPartidaId(idPartida); 
    }
}