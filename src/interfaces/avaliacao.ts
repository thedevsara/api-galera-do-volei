export interface Avaliacao {
    id: number;
    idAvaliador: number;
    idAvaliado: number;
    tipoAvaliacao: 'jogador' | 'partida';
    nota: number;
    comentario?: string;
}