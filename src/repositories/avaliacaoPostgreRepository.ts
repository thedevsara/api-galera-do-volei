// Arquivo: src/repositories/AvaliacaoPostgreRepository.ts

import pool from '../config/db';
import { Avaliacao } from '../interfaces/avaliacao';
import { IAvaliacaoRepository } from './interfaces/IAvaliacaoRepository';

export class AvaliacaoPostgreRepository implements IAvaliacaoRepository {

    private mapToAvaliacao(row: any): Avaliacao {
        return {
            id: row.id,
            idAvaliador: row.id_avaliador,
            idAvaliado: row.id_avaliado,
            tipoAvaliacao: row.tipo_avaliacao,
            nota: row.nota,
            comentario: row.comentario
        } as Avaliacao;
    }

    public async findByAvaliadoId(id: number, tipo: 'jogador' | 'partida'): Promise<Avaliacao[]> {
        const query = 'SELECT * FROM avaliacoes WHERE id_avaliado = $1 AND tipo_avaliacao = $2';
        const result = await pool.query(query, [id, tipo]);
        return result.rows.map(this.mapToAvaliacao);
    }
    
    public async save(avaliacao: Avaliacao): Promise<Avaliacao> {
        const query = `
            INSERT INTO avaliacoes (id_avaliador, id_avaliado, tipo_avaliacao, nota, comentario)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        
        const values = [
            avaliacao.idAvaliador, avaliacao.idAvaliado, avaliacao.tipoAvaliacao, avaliacao.nota, avaliacao.comentario
        ];
        
        const result = await pool.query(query, values);
        return this.mapToAvaliacao(result.rows[0]);
    }
}