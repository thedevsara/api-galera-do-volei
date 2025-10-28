import pool from '../config/db';
import { Solicitacao } from '../interfaces/solicitacao';
import { ISolicitacaoRepository } from './interfaces/ISolicitacaoRepository';

export class SolicitacaoPostgreRepository implements ISolicitacaoRepository {

    private mapToSolicitacao(row: any): Solicitacao {
        return {
            id: row.id,
            idPartida: row.id_partida,
            idJogador: row.id_jogador,
            status: row.status
        } as Solicitacao;
    }

    public async findAll(): Promise<Solicitacao[]> {
        const result = await pool.query('SELECT * FROM solicitacoes');
        return result.rows.map(this.mapToSolicitacao);
    }
    
    public async findById(id: number): Promise<Solicitacao | undefined> {
        const query = 'SELECT * FROM solicitacoes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] ? this.mapToSolicitacao(result.rows[0]) : undefined;
    }
    
    public async findByPartidaId(idPartida: number): Promise<Solicitacao[]> {
        const query = 'SELECT * FROM solicitacoes WHERE id_partida = $1';
        const result = await pool.query(query, [idPartida]);
        return result.rows.map(this.mapToSolicitacao);
    }

    public async save(solicitacao: Solicitacao): Promise<Solicitacao> {
        const query = `
            INSERT INTO solicitacoes (id_partida, id_jogador, status)
            VALUES ($1, $2, $3)
            RETURNING *`;
        
        const values = [solicitacao.idPartida, solicitacao.idJogador, 'pendente'];
        
        const result = await pool.query(query, values);
        return this.mapToSolicitacao(result.rows[0]);
    }
    
    public async updateStatus(id: number, status: 'aceito' | 'recusado'): Promise<Solicitacao | undefined> {
        const query = `
            UPDATE solicitacoes
            SET status = $1
            WHERE id = $2
            RETURNING *`;
        
        const result = await pool.query(query, [status, id]);
        return result.rows[0] ? this.mapToSolicitacao(result.rows[0]) : undefined;
    }
}