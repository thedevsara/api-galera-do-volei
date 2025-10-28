export interface Jogador {
    id: number;
    nome: string;
    idade: number;
    sexo: 'feminino' | 'masculino' | 'outro';
    categoria: 'iniciante' | 'intermediario' | 'avancado';
    avaliacao: number;
}