// Custom elements compartilhados por todas as páginas: <app-header>, <app-nav> e <app-footer>.
// Eles não usam Shadow DOM, assim o CSS global (css/estilo.css) estiliza os três.

const TITULO_SITE = 'Meus Filmes';
const SUBTITULO_SITE = 'CRUD em JavaScript com a API REST do Supabase';
const AUTOR = 'Jean Saraçol Feijó Junior';

const LINKS_MENU = [
  { arquivo: 'index.html', texto: 'Lista' },
  { arquivo: 'criar.html', texto: 'Cadastrar' },
  { arquivo: 'editar.html', texto: 'Editar' },
  { arquivo: 'excluir.html', texto: 'Excluir' }
];

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="topo">
        <div class="container topo__conteudo">
          <img class="topo__logo" src="img/logo.svg" alt="Logotipo: claquete de cinema" width="44" height="44">
          <div>
            <p class="topo__titulo"></p>
            <p class="topo__subtitulo"></p>
          </div>
        </div>
      </header>
    `;
    this.querySelector('.topo__titulo').textContent = TITULO_SITE;
    this.querySelector('.topo__subtitulo').textContent = SUBTITULO_SITE;
  }
}

class AppNav extends HTMLElement {
  connectedCallback() {
    // nome do arquivo da página atual (index.html quando a URL termina em "/")
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

    const itens = LINKS_MENU.map((link) => {
      const atual = link.arquivo === paginaAtual ? ' aria-current="page"' : '';
      return `<li><a class="menu__link" href="${link.arquivo}"${atual}>${link.texto}</a></li>`;
    }).join('');

    this.innerHTML = `
      <nav class="menu" aria-label="Menu principal">
        <div class="container">
          <ul class="menu__lista">${itens}</ul>
        </div>
      </nav>
    `;
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="rodape">
        <div class="container">
          <p class="rodape__autor"></p>
          <p>Trabalho final de JavaScript: API REST e Custom Elements. Dados de exemplo.</p>
        </div>
      </footer>
    `;
    this.querySelector('.rodape__autor').textContent = `© ${new Date().getFullYear()} ${AUTOR}`;
  }
}

if (!customElements.get('app-header')) customElements.define('app-header', AppHeader);
if (!customElements.get('app-nav')) customElements.define('app-nav', AppNav);
if (!customElements.get('app-footer')) customElements.define('app-footer', AppFooter);
