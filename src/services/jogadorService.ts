import { IJogadorRepository } from '../repositories/interfaces/IJogadorRepository'; 
import { AvaliacaoPostgreRepository } from '../repositories/avaliacaoPostgreRepository';
import { Jogador } from '../interfaces/jogador'; 
import { Avaliacao } from '../interfaces/avaliacao'; 
import { NotFoundException, BadRequestException } from '../exceptions/apiException';
import { JogadorPostgreRepository } from '../repositories/jogadorPostgreRepository'; 

export class JogadorService {
    private jogadorRepository: IJogadorRepository; 
    private avaliacaoRepository: AvaliacaoPostgreRepository;

    constructor() {
        this.jogadorRepository = new JogadorPostgreRepository(); 
        this.avaliacaoRepository = new AvaliacaoPostgreRepository();
    }
    
    // GET All
    public async findAll(): Promise<Jogador[]> { 
        return this.jogadorRepository.findAll();
    }
    
    // POST
    public async create(jogador: Jogador): Promise<Jogador> { 
        if (!jogador.nome || !jogador.idade || !jogador.sexo) {
            throw new BadRequestException("Dados essenciais do jogador estão incompletos.");
        }
        return this.jogadorRepository.save(jogador);
    }
    
    // PUT
    public async update(id: number, dados: Partial<Jogador>): Promise<Jogador> { 
        const jogadorExistente = await this.jogadorRepository.findById(id);
        
        if (!jogadorExistente) {
            throw new NotFoundException("Jogador não encontrado para atualização.");
        }
        
        const dadosComId = { ...jogadorExistente, ...dados, id };
        
        const jogadorAtualizado = await this.jogadorRepository.update(dadosComId as Jogador);
        
        if (!jogadorAtualizado) {
             // Lança erro 500 se o update falhar mesmo após o findById
             throw new Error("Falha interna ao atualizar jogador."); 
        }
        
        return jogadorAtualizado;
    }

    // DELETE
    public async delete(id: number): Promise<boolean> { 
        const result = await this.jogadorRepository.delete(id); 
        
        if (!result) {
            throw new NotFoundException("Jogador não encontrado para exclusão.");
        }
        return result;
    }
        public async getPerfilCompleto(id: number) { 
        const jogador = await this.jogadorRepository.findById(id); 

        if (!jogador) {
            throw new NotFoundException("Jogador não encontrado para o ID especificado.");
        }
     
        const avaliacoesDoJogador = await this.avaliacaoRepository.findByAvaliadoId(jogador.id, 'jogador');

        
        let media = 0;
        if (avaliacoesDoJogador.length > 0) {
            const somaDasNotas = avaliacoesDoJogador.reduce(
                (total: number, avaliacao: Avaliacao) => total + avaliacao.nota, 
                0
            );
            media = somaDasNotas / avaliacoesDoJogador.length;
        }

        return {
            ...jogador,
            notaMedia: media.toFixed(2),
            avaliacoesRecebidas: avaliacoesDoJogador.length
        };
    }
}