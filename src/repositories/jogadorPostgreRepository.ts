import pool from '../config/db';
import { Jogador } from '../interfaces/jogador';
import { IJogadorRepository } from './interfaces/IJogadorRepository';

export class JogadorPostgreRepository implements IJogadorRepository {

    private mapToJogador(row: any): Jogador {
        return {
            id: row.id,
            nome: row.nome,
            idade: row.idade,
            sexo: row.sexo,
            categoria: row.categoria,
            avaliacao: row.avaliacao 
        };
    }

    public async findAll(): Promise<Jogador[]> {
        const query = 'SELECT * FROM jogadores';
        const result = await pool.query(query);
        return result.rows.map(this.mapToJogador);
    }

    public async findById(id: number): Promise<Jogador | undefined> {
        const query = 'SELECT * FROM jogadores WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] ? this.mapToJogador(result.rows[0]) : undefined;
    }
    
    public async save(jogador: Jogador): Promise<Jogador> {
        const query = `
            INSERT INTO jogadores (nome, idade, sexo, categoria, avaliacao)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        
        const values = [
            jogador.nome, jogador.idade, jogador.sexo, jogador.categoria, jogador.avaliacao
        ];
        
        const result = await pool.query(query, values);
        return this.mapToJogador(result.rows[0]);
    }

    public async update(jogadorAtualizado: Jogador): Promise<Jogador | undefined> {
        const query = `
            UPDATE jogadores
            SET nome = $1, idade = $2, sexo = $3, categoria = $4, avaliacao = $5
            WHERE id = $6
            RETURNING *`;
        
        const values = [
            jogadorAtualizado.nome, 
            jogadorAtualizado.idade, 
            jogadorAtualizado.sexo, 
            jogadorAtualizado.categoria, 
            jogadorAtualizado.avaliacao,
            jogadorAtualizado.id // ID do jogador para a cláusula WHERE
        ];

        const result = await pool.query(query, values);
        
        // Se o UPDATE afetou 1 linha, retorna o objeto atualizado
        return result.rows[0] ? this.mapToJogador(result.rows[0]) : undefined;
    }
    
public async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM jogadores WHERE id = $1';
    
    const result = await pool.query(query, [id]);
    
    
    return (result.rowCount ?? 0) > 0; 
}
}