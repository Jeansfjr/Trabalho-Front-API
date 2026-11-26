// Página de edição: escolhe um filme, carrega seus dados (GET) e salva as alterações (PATCH)
import { listarFilmes, buscarFilmePorId, atualizarFilme } from './api.js';
import {
  preencherGeneros, lerFormulario, preencherFormulario,
  lerIdDaUrl, mostrarMensagem, esconderMensagem
} from './utilitarios.js';

const seletor = document.getElementById('escolher-filme');
const form = document.getElementById('form-filme');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('btn-salvar');

let idAtual = null;

preencherGeneros(form.elements.genero);

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

async function carregarFilme(id) {
  esconderMensagem(mensagem);
  idAtual = id;
  if (!id) {
    form.hidden = true;
    return;
  }
  try {
    const filme = await buscarFilmePorId(id);
    if (!filme) {
      form.hidden = true;
      mostrarMensagem(mensagem, 'Filme não encontrado.', 'erro');
      return;
    }
    preencherFormulario(form, filme);
    form.hidden = false;
  } catch (erro) {
    form.hidden = true;
    mostrarMensagem(mensagem, erro.message, 'erro');
  }
}

seletor.addEventListener('change', () => {
  const id = Number(seletor.value) || null;
  // mantém o endereço da página coerente com o filme escolhido
  const novaUrl = id ? `${window.location.pathname}?id=${id}` : window.location.pathname;
  window.history.replaceState(null, '', novaUrl);
  carregarFilme(id);
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  esconderMensagem(mensagem);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  botao.disabled = true;
  try {
    const filme = await atualizarFilme(idAtual, lerFormulario(form));
    mostrarMensagem(mensagem, `Filme "${filme.titulo}" atualizado com sucesso.`, 'sucesso');
    await carregarSeletor();
    seletor.value = idAtual;
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
