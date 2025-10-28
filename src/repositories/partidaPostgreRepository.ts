import pool from '../config/db';
import { Partida } from '../interfaces/partida';
import { IPartidaRepository } from './interfaces/IPartidaRepository';

export class PartidaPostgreRepository implements IPartidaRepository {

    private mapToPartida(row: any): Partida {
        // Mapeamento das colunas do banco para a interface Partida
        return {
            id: row.id,
            titulo: row.titulo,
            sexoPermitido: row.sexo_permitido, 
            categoria: row.categoria,
            local: row.local,
            data: row.data,
            situacao: row.situacao,
            valor: row.valor,
            avaliacao: row.avaliacao
        };
    }

    public async findAll(): Promise<Partida[]> {
        const query = 'SELECT * FROM partidas';
        const result = await pool.query(query);
        return result.rows.map(this.mapToPartida);
    }

    public async findById(id: number): Promise<Partida | undefined> {
        const query = 'SELECT * FROM partidas WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] ? this.mapToPartida(result.rows[0]) : undefined;
    }
    
    public async save(partida: Partida): Promise<Partida> {
        const query = `
            INSERT INTO partidas (titulo, sexo_permitido, categoria, local, data, situacao, valor, avaliacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;
        
        const values = [
            partida.titulo, partida.sexoPermitido, partida.categoria, partida.local, partida.data, partida.situacao, partida.valor, partida.avaliacao
        ];
        
        const result = await pool.query(query, values);
        return this.mapToPartida(result.rows[0]);
    }

    public async update(partidaAtualizada: Partida): Promise<Partida | undefined> {
        const query = `
            UPDATE partidas
            SET titulo = $1, local = $2, situacao = $3, valor = $4
            WHERE id = $5
            RETURNING *`;
        
        const values = [
            partidaAtualizada.titulo, 
            partidaAtualizada.local, 
            partidaAtualizada.situacao, 
            partidaAtualizada.valor,
            partidaAtualizada.id
        ];

        const result = await pool.query(query, values);
        return result.rows[0] ? this.mapToPartida(result.rows[0]) : undefined;
    }
    
    public async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM partidas WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        return (result.rowCount ?? 0) > 0; 
    }
}