// Página de exclusão: escolhe um filme, mostra os dados e apaga (DELETE) depois da confirmação
import { listarFilmes, buscarFilmePorId, excluirFilme } from './api.js';
import { lerIdDaUrl, mostrarMensagem, esconderMensagem, formatarNota } from './utilitarios.js';

const seletor = document.getElementById('escolher-filme');
const area = document.getElementById('area-exclusao');
const detalhes = document.getElementById('detalhes');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('btn-excluir');

let filmeAtual = null;

async function carregarSeletor() {
  const filmes = await listarFilmes({ ordem: 'titulo.asc' });
  seletor.innerHTML = '<option value="">Escolha um filme...</option>';
  filmes.forEach((filme) => {
    const opcao = document.createElement('option');
    opcao.value = filme.id;
    opcao.textContent = `${filme.titulo} (${filme.ano})`;
    seletor.appendChild(opcao);
  });
}

function mostrarDetalhes(filme) {
  const linhas = [
    ['Título', filme.titulo],
    ['Gênero', filme.genero],
    ['Ano', filme.ano],
    ['Nota', formatarNota(filme.nota)],
    ['Assistido', filme.assistido ? 'Sim' : 'Não']
  ];
  detalhes.innerHTML = '';
  linhas.forEach(([rotulo, valor]) => {
    const dt = document.createElement('dt');
    dt.textContent = rotulo;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    detalhes.appendChild(dt);
    detalhes.appendChild(dd);
  });
}

async function carregarFilme(id) {
  esconderMensagem(mensagem);
  filmeAtual = null;
  area.hidden = true;
  if (!id) return;

  try {
    const filme = await buscarFilmePorId(id);
    if (!filme) {
      mostrarMensagem(mensagem, 'Filme não encontrado.', 'erro');
      return;
    }
    filmeAtual = filme;
    mostrarDetalhes(filme);
    area.hidden = false;
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, 'erro');
  }
}

seletor.addEventListener('change', () => {
  const id = Number(seletor.value) || null;
  const novaUrl = id ? `${window.location.pathname}?id=${id}` : window.location.pathname;
  window.history.replaceState(null, '', novaUrl);
  carregarFilme(id);
});

botao.addEventListener('click', async () => {
  if (!filmeAtual) return;
  if (!window.confirm(`Excluir o filme "${filmeAtual.titulo}"? Essa ação não pode ser desfeita.`)) return;

  botao.disabled = true;
  try {
    await excluirFilme(filmeAtual.id);
    mostrarMensagem(mensagem, `Filme "${filmeAtual.titulo}" excluído com sucesso.`, 'sucesso');
    filmeAtual = null;
    area.hidden = true;
    window.history.replaceState(null, '', window.location.pathname);
    await carregarSeletor();
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, 'erro');
  } finally {
    botao.disabled = false;
  }
});

async function iniciar() {
  try {
    await carregarSeletor();
    const idDaUrl = lerIdDaUrl();
    if (idDaUrl) {
      seletor.value = idDaUrl;
      await carregarFilme(idDaUrl);
    }
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, 'erro');
  }
}

iniciar();
