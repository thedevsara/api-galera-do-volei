export interface Solicitacao {
    id: number;
    idPartida: number;
    idJogador: number;
    status: 'pendente' | 'aceito' | 'recusado';
}