import { IPartidaRepository } from '../repositories/interfaces/IPartidaRepository'; 
import { PartidaPostgreRepository } from '../repositories/partidaPostgreRepository'; 
import { Partida } from '../interfaces/partida';
import { NotFoundException, BadRequestException } from '../exceptions/apiException';

export class PartidaService {
    private partidaRepository: IPartidaRepository; 

    constructor() {
        this.partidaRepository = new PartidaPostgreRepository(); 
    }

    public async findAll(): Promise<Partida[]> {
        return this.partidaRepository.findAll(); 
    }

    public async findById(id: number): Promise<Partida | undefined> {
        const partida = await this.partidaRepository.findById(id); // Adicionado await
        if (!partida) {
            throw new NotFoundException("Partida não encontrada.");
        }
        return partida;
    }

    public async create(partida: Partida): Promise<Partida> {
        if (!partida.titulo || !partida.local || !partida.data) {
            throw new BadRequestException("Dados essenciais da partida estão incompletos.");
        }
        return this.partidaRepository.save(partida); // Adicionado await (implicito)
    }
    
    public async update(id: number, dados: Partial<Partida>): Promise<Partida> {
        const partidaExistente = await this.partidaRepository.findById(id); // Adicionado await
        if (!partidaExistente) {
            throw new NotFoundException("Partida não encontrada.");
        }
        const partidaAtualizada = await this.partidaRepository.update({ ...partidaExistente, ...dados, id }); // Adicionado await
        if (!partidaAtualizada) {
            throw new Error("Falha interna ao atualizar partida."); 
        }
        return partidaAtualizada;
    }

    public async delete(id: number): Promise<boolean> {
        const result = await this.partidaRepository.delete(id); 
        if (!result) {
            throw new NotFoundException("Partida não encontrada para exclusão.");
        }
        return result;
    }
}