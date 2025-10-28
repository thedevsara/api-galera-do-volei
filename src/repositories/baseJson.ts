import * as fs from 'fs';
import * as path from 'path';

// Classe base para Repositórios que usam arquivos JSON para persistência
export class RepositorioBaseJson<T extends { id: number }> {
    protected caminhoArquivo: string;
    protected dados: T[];

    constructor(nomeArquivo: string) { 
        this.caminhoArquivo = path.join(__dirname, '..', '..', 'data', nomeArquivo);
        this.dados = this.carregarDados();
    }

    private carregarDados(): T[] {
        try {
            const pastaDados = path.join(__dirname, '..', '..', 'data');
            if (!fs.existsSync(pastaDados)) {
                fs.mkdirSync(pastaDados);
            }
            const conteudoArquivo = fs.readFileSync(this.caminhoArquivo, 'utf8');
            return JSON.parse(conteudoArquivo);
        } catch (error) {
            return [];
        }
    }

    protected persistirDados(): void {
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(this.dados, null, 2), 'utf8');
    }

    public findAll(): T[] {
        return this.dados;
    }


    public save(item: T): T {
        // Lógica de geração de ID
        if (!item.id || this.dados.findIndex(i => i.id === item.id) === -1) {
            item.id = this.dados.length > 0 ? Math.max(...this.dados.map(i => i.id)) + 1 : 1;
            this.dados.push(item);
        } else {
            // Lógica de PUT (Atualização)
            const index = this.dados.findIndex(i => i.id === item.id);
            if (index !== -1) {
                this.dados[index] = item;
            }
        }
        
        this.persistirDados();
        return item;
    }
}