export interface Partida {
    id: number;
    titulo: string;
    sexoPermitido: 'feminino' | 'masculino' | 'ambos';
    categoria: 'iniciante' | 'intermediario' | 'avancado';
    local: string;
    data: string;
    situacao: 'ativa' | 'encerrada' | 'cancelada';
    valor: number;
    avaliacao: number;
}