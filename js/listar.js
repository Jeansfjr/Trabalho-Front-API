// Página inicial: lista, busca, filtra, ordena e conta os filmes
import { listarFilmes, contarFilmes, melhoresFilmes } from './api.js';
import { preencherGeneros, mostrarMensagem, esconderMensagem, formatarNota } from './utilitarios.js';

const form = document.getElementById('form-busca');
const corpo = document.getElementById('corpo-filmes');
const mensagem = document.getElementById('mensagem');
const resumo = document.getElementById('resumo');
const total = document.getElementById('total');

preencherGeneros(document.getElementById('genero'), { incluirTodos: true, textoTodos: 'Todos os gêneros' });

function criarCelula(texto, classe) {
  const td = document.createElement('td');
  td.textContent = texto;
  if (classe) td.className = classe;
  return td;
}

function criarBotaoLink(texto, href, classe) {
  const a = document.createElement('a');
  a.className = `botao botao--pequeno ${classe}`;
  a.href = href;
  a.textContent = texto;
  return a;
}

function desenharTabela(filmes) {
  corpo.innerHTML = '';

  if (filmes.length === 0) {
    const tr = document.createElement('tr');
    const td = criarCelula('Nenhum filme encontrado.', 'centro');
    td.colSpan = 6;
    tr.appendChild(td);
    corpo.appendChild(tr);
    return;
  }

  filmes.forEach((filme) => {
    const tr = document.createElement('tr');
    tr.appendChild(criarCelula(filme.titulo));
    tr.appendChild(criarCelula(filme.genero));
    tr.appendChild(criarCelula(filme.ano, 'centro'));
    tr.appendChild(criarCelula(formatarNota(filme.nota), 'centro'));

    const tdAssistido = document.createElement('td');
    tdAssistido.className = 'centro';
    const etiqueta = document.createElement('span');
    etiqueta.className = `etiqueta ${filme.assistido ? 'etiqueta--sim' : 'etiqueta--nao'}`;
    etiqueta.textContent = filme.assistido ? 'Assistido' : 'Pendente';
    tdAssistido.appendChild(etiqueta);
    tr.appendChild(tdAssistido);

    const tdAcoes = document.createElement('td');
    const acoes = document.createElement('div');
    acoes.className = 'acoes-celula';
    acoes.appendChild(criarBotaoLink('Editar', `editar.html?id=${filme.id}`, 'botao--secundario'));
    acoes.appendChild(criarBotaoLink('Excluir', `excluir.html?id=${filme.id}`, 'botao--perigo'));
    tdAcoes.appendChild(acoes);
    tr.appendChild(tdAcoes);

    corpo.appendChild(tr);
  });
}

function lerFiltros() {
  return {
    busca: document.getElementById('busca').value.trim(),
    genero: document.getElementById('genero').value,
    status: document.getElementById('status').value,
    ordem: document.getElementById('ordem').value
  };
}

async function atualizarTotal() {
  try {
    total.textContent = await contarFilmes();
  } catch (erro) {
    total.textContent = '?';
  }
}

async function carregarLista() {
  esconderMensagem(mensagem);
  resumo.textContent = 'Carregando...';
  try {
    const filmes = await listarFilmes(lerFiltros());
    desenharTabela(filmes);
    resumo.textContent = `${filmes.length} filme(s) na lista.`;
  } catch (erro) {
    corpo.innerHTML = '';
    resumo.textContent = '';
    mostrarMensagem(mensagem, erro.message, 'erro');
  }
}

async function carregarTop5() {
  esconderMensagem(mensagem);
  resumo.textContent = 'Carregando...';
  try {
    const filmes = await melhoresFilmes(5);
    desenharTabela(filmes);
    resumo.textContent = `Os ${filmes.length} filmes com maior nota.`;
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, 'erro');
  }
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  carregarLista();
});
form.addEventListener('reset', () => setTimeout(carregarLista, 0));
document.getElementById('btn-top5').addEventListener('click', carregarTop5);

atualizarTotal();
carregarLista();
