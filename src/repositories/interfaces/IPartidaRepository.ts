import { Partida } from '../../interfaces/partida';

export interface IPartidaRepository {
    findAll(): Promise<Partida[]>;
    findById(id: number): Promise<Partida | undefined>;
    save(partida: Partida): Promise<Partida>;
    update(partidaAtualizada: Partida): Promise<Partida | undefined>;
    delete(id: number): Promise<boolean>;
}