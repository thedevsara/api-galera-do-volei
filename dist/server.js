"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const avaliacoes = [];
const jogadores = [
    { id: 1, nome: 'JitaJoia', idade: 21, sexo: 'feminino', categoria: 'iniciante', avaliacao: 7.5 },
    { id: 2, nome: 'Guga', idade: 25, sexo: 'masculino', categoria: 'avancado', avaliacao: 9.0 }
];
const partidas = [
    { id: 1, titulo: 'Volei do ADS', sexoPermitido: 'ambos', categoria: 'iniciante', local: 'ufpi', data: '2025-11-09', situacao: 'ativa', valor: 0, avaliacao: 7.5 },
    { id: 2, titulo: 'Volei de Praia', sexoPermitido: 'masculino', categoria: 'avancado', local: 'Praia', data: '2025-11-15', situacao: 'ativa', valor: 20, avaliacao: 0 }
];
const solicitacoes = [];
// 3. Configuração do Servidor Express
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
// Exemplo simples de rota GET para listar as partidas
app.get('/api/partidas', (req, res) => {
    res.status(200).json(partidas);
});
// Ele é um comando, uma ação: um jogador se candidata a uma partida.
app.post('/api/partidas/:id/candidatura', (req, res) => {
    const idPartida = parseInt(req.params.id);
    // Assumimos que o ID do jogador virá do corpo da requisição ou do token de autenticação
    const { idJogador } = req.body;
    // Lógica para encontrar a partida e verificar as regras de negócio
    const partida = partidas.find(p => p.id === idPartida);
    const jogador = jogadores.find(j => j.id === idJogador);
    if (!partida) {
        return res.status(404).json({ error: 'Partida não encontrada.' });
    }
    if (!jogador) {
        return res.status(404).json({ error: 'Jogador não encontrado.' });
    }
    // Ação "Além do CRUD": Crie a solicitação (transação)
    const novaSolicitacao = {
        id: solicitacoes.length + 1,
        idPartida: idPartida,
        idJogador: idJogador,
        status: 'pendente'
    };
    solicitacoes.push(novaSolicitacao);
    // Resposta de sucesso
    res.status(201).json({
        message: 'Candidatura criada com sucesso!',
        solicitacao: novaSolicitacao
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// O corpo da requisição indica o novo status.
app.patch('/api/solicitacoes/:id', (req, res) => {
    // Captura o ID da solicitação dos parâmetros da URL
    const solicitacaoId = parseInt(req.params.id);
    // Pega o novo status do corpo da requisição
    const { status } = req.body;
    // 1. Verifica a solicitação no nosso "banco de dados"
    const solicitacao = solicitacoes.find(s => s.id === solicitacaoId);
    // 2. Verifica se ela existe
    if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada.' });
    }
    // 3. Verifica se o status enviado é válido
    if (status !== 'aceito' && status !== 'recusado') {
        return res.status(400).json({ error: 'Status inválido. Use "aceito" ou "recusado".' });
    }
    // 4. Se tudo estiver certo, atualiza o status da solicitação
    solicitacao.status = status;
    // 5. Retorne a resposta de sucesso
    res.status(200).json({
        message: `Status da solicitação ${solicitacaoId} atualizado para ${status}.`,
        solicitacao
    });
});
app.post('/api/avaliacoes', (req, res) => {
    // Pega as informações de avaliação do corpo da requisição
    const { idAvaliador, idAvaliado, tipoAvaliacao, nota, comentario } = req.body;
    // 1. Verifique se os dados estão completos e válidos
    if (!idAvaliador || !idAvaliado || !tipoAvaliacao || nota === undefined) {
        return res.status(400).json({ error: 'Dados incompletos para a avaliação.' });
    }
    // 2. Verifica se a nota é válida
    if (nota < 0 || nota > 10) {
        return res.status(400).json({ error: 'A nota deve ser entre 0 e 10.' });
    }
    // 3. Cria o novo objeto de avaliação
    const novaAvaliacao = {
        id: avaliacoes.length + 1,
        idAvaliador,
        idAvaliado,
        tipoAvaliacao,
        nota,
        comentario
    };
    // 4. Salva avaliação no nosso "banco de dados" de mentira
    avaliacoes.push(novaAvaliacao);
    // 5. Retorna a resposta de sucesso
    res.status(201).json({
        message: 'Avaliação registrada com sucesso.',
        avaliacao: novaAvaliacao
    });
});
app.get('/api/partidas/:id/solicitacoes', (req, res) => {
    // Captura o ID da partida a partir dos parâmetros da URL
    const idPartida = parseInt(req.params.id);
    // Filtra as solicitações para encontrar apenas as que pertencem a essa partida
    const solicitacoesDaPartida = solicitacoes.filter(s => s.idPartida === idPartida);
    // Retorna a lista de solicitações
    res.status(200).json(solicitacoesDaPartida);
});
app.get('/api/jogadores/:id', (req, res) => {
    // Captura o ID do jogador
    const idJogador = parseInt(req.params.id);
    // Encontra o jogador no "banco de dados"
    const jogador = jogadores.find(j => j.id === idJogador);
    if (!jogador) {
        return res.status(404).json({ error: 'Jogador não encontrado.' });
    }
    // 1. Filtra as avaliações para encontrar apenas as que se referem a este jogador
    const avaliacoesDoJogador = avaliacoes.filter(a => a.tipoAvaliacao === 'jogador' && a.idAvaliado === idJogador);
    // 2. Calcula a média das notas
    let media = 0;
    if (avaliacoesDoJogador.length > 0) {
        const somaDasNotas = avaliacoesDoJogador.reduce((total, avaliacao) => total + avaliacao.nota, 0);
        media = somaDasNotas / avaliacoesDoJogador.length;
    }
    // 3. Cria um objeto de resposta combinado
    const perfilCompleto = {
        ...jogador, // Operador "spread" para incluir todos os dados do jogador
        notaMedia: media.toFixed(2), // Adicione a nova propriedade com a nota média
        avaliacoesRecebidas: avaliacoesDoJogador.length
    };
    // Retorne o perfil completo
    res.status(200).json(perfilCompleto);
});
// Rotas de CRUD para Jogadores e Partidas
// GET: Retorna todos os jogadores
app.get('/api/jogadores', (req, res) => {
    res.status(200).json(jogadores);
});
// GET: Retorna uma partida específica
app.get('/api/partidas/:id', (req, res) => {
    const partidaId = parseInt(req.params.id);
    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) {
        return res.status(404).json({ error: 'Partida não encontrada.' });
    }
    res.status(200).json(partida);
});
// POST: Adiciona um novo jogador
app.post('/api/jogadores', (req, res) => {
    const novoJogador = { id: jogadores.length + 1, ...req.body };
    jogadores.push(novoJogador);
    res.status(201).json(novoJogador);
});
// POST: Adiciona uma nova partida
app.post('/api/partidas', (req, res) => {
    const novaPartida = { id: partidas.length + 1, ...req.body };
    partidas.push(novaPartida);
    res.status(201).json(novaPartida);
});
// PUT: Atualiza um jogador
app.put('/api/jogadores/:id', (req, res) => {
    const jogadorId = parseInt(req.params.id);
    const jogadorIndex = jogadores.findIndex(j => j.id === jogadorId);
    if (jogadorIndex === -1) {
        return res.status(404).json({ error: 'Jogador não encontrado.' });
    }
    jogadores[jogadorIndex] = { ...jogadores[jogadorIndex], ...req.body };
    res.status(200).json(jogadores[jogadorIndex]);
});
// PUT: Atualiza uma partida
app.put('/api/partidas/:id', (req, res) => {
    const partidaId = parseInt(req.params.id);
    const partidaIndex = partidas.findIndex(p => p.id === partidaId);
    if (partidaIndex === -1) {
        return res.status(404).json({ error: 'Partida não encontrada.' });
    }
    partidas[partidaIndex] = { ...partidas[partidaIndex], ...req.body };
    res.status(200).json(partidas[partidaIndex]);
});
// DELETE: Deleta um jogador
app.delete('/api/jogadores/:id', (req, res) => {
    const jogadorId = parseInt(req.params.id);
    const jogadorIndex = jogadores.findIndex(j => j.id === jogadorId);
    if (jogadorIndex === -1) {
        return res.status(404).json({ error: 'Jogador não encontrado.' });
    }
    jogadores.splice(jogadorIndex, 1);
    res.status(200).json({ message: 'Jogador deletado com sucesso.' });
});
// DELETE: Deleta uma partida
app.delete('/api/partidas/:id', (req, res) => {
    const partidaId = parseInt(req.params.id);
    const partidaIndex = partidas.findIndex(p => p.id === partidaId);
    if (partidaIndex === -1) {
        return res.status(404).json({ error: 'Partida não encontrada.' });
    }
    partidas.splice(partidaIndex, 1);
    res.status(200).json({ message: 'Partida deletada com sucesso.' });
});
