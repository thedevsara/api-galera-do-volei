import { Jogador } from '../../interfaces/jogador';

export interface IJogadorRepository {
    findAll(): Promise<Jogador[]>;
    findById(id: number): Promise<Jogador | undefined>;
    save(jogador: Jogador): Promise<Jogador>;
    update(jogadorAtualizado: Jogador): Promise<Jogador | undefined>;
    delete(id: number): Promise<boolean>;
}