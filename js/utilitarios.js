// Funções auxiliares usadas por várias páginas

export const GENEROS = [
  'Ação', 'Animação', 'Aventura', 'Comédia', 'Crime',
  'Drama', 'Ficção científica', 'Romance', 'Suspense', 'Terror'
];

// Preenche um <select> com a lista de gêneros
export function preencherGeneros(select, { incluirTodos = false, textoTodos = 'Todos' } = {}) {
  select.innerHTML = '';
  if (incluirTodos) {
    const opcao = document.createElement('option');
    opcao.value = '';
    opcao.textContent = textoTodos;
    select.appendChild(opcao);
  }
  GENEROS.forEach((genero) => {
    const opcao = document.createElement('option');
    opcao.value = genero;
    opcao.textContent = genero;
    select.appendChild(opcao);
  });
}

// Mostra uma mensagem de sucesso, erro ou informação em um elemento da página
export function mostrarMensagem(elemento, texto, tipo = 'info') {
  elemento.textContent = texto;
  elemento.className = `mensagem mensagem--${tipo}`;
  elemento.hidden = false;
}

export function esconderMensagem(elemento) {
  elemento.hidden = true;
  elemento.textContent = '';
}

// Lê o parâmetro ?id= da URL (devolve número ou null)
export function lerIdDaUrl() {
  const valor = Number(new URLSearchParams(window.location.search).get('id'));
  return Number.isInteger(valor) && valor > 0 ? valor : null;
}

// Converte os campos do formulário em um objeto pronto para enviar à API
export function lerFormulario(form) {
  const nota = form.elements.nota.value.trim();
  return {
    titulo: form.elements.titulo.value.trim(),
    genero: form.elements.genero.value,
    ano: Number(form.elements.ano.value),
    nota: nota === '' ? null : Number(nota),
    assistido: form.elements.assistido.checked
  };
}

// Preenche o formulário com os dados de um filme
export function preencherFormulario(form, filme) {
  form.elements.titulo.value = filme.titulo;
  form.elements.genero.value = filme.genero;
  form.elements.ano.value = filme.ano;
  form.elements.nota.value = filme.nota ?? '';
  form.elements.assistido.checked = Boolean(filme.assistido);
}

export function formatarNota(nota) {
  return nota === null || nota === undefined ? '-' : Number(nota).toFixed(1);
}
