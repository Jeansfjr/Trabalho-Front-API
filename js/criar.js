// Página de cadastro: envia um filme novo para a API (POST)
import { criarFilme } from './api.js';
import { preencherGeneros, lerFormulario, mostrarMensagem, esconderMensagem } from './utilitarios.js';

const form = document.getElementById('form-filme');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('btn-salvar');

preencherGeneros(form.elements.genero);

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  esconderMensagem(mensagem);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  botao.disabled = true;
  try {
    const filme = await criarFilme(lerFormulario(form));
    mostrarMensagem(mensagem, `Filme "${filme.titulo}" cadastrado com sucesso (id ${filme.id}).`, 'sucesso');
    form.reset();
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, 'erro');
  } finally {
    botao.disabled = false;
  }
});
