# Meus Filmes — CRUD com JavaScript, API REST e Custom Elements

Trabalho final de JavaScript. Um CRUD de filmes que usa **apenas `fetch`** para falar com a
API REST do Supabase (sem bibliotecas e sem o SDK do Supabase).

## Estrutura

```
├── index.html      lista, busca, filtro, ordenação, contagem e Top 5
├── criar.html      cadastro (POST)
├── editar.html     edição (GET por id + PATCH)
├── excluir.html    exclusão (DELETE)
├── css/            modern-normalize.css, variables.css, estilo.css, formularios.css
├── js/             módulos ES: config, api, utilitarios, componentes (custom elements) e um por página
├── img/            logo.svg
└── sql/filmes.sql  tabela, políticas de segurança e dados de exemplo
```

## Comandos enviados à API (js/api.js)

| # | Método | O que faz |
|---|--------|-----------|
| 1 | GET    | lista filmes com filtros (título `ilike`, gênero, situação) e ordenação |
| 2 | GET    | busca um filme por id (`?id=eq.5`) |
| 3 | GET    | conta os filmes (`Prefer: count=exact`) |
| 4 | GET    | Top 5 maiores notas (`order=nota.desc&limit=5`) |
| 5 | POST   | cria um filme |
| 6 | PATCH  | altera um filme |
| 7 | DELETE | exclui um filme |

## Como usar

1. No Supabase, abra o **SQL Editor** e rode `sql/filmes.sql`.
2. Em **Connect**, copie a Project URL e a chave publicável (`sb_publishable_...`).
3. Cole os dois valores em `js/config.js`.
4. Abra o projeto com a extensão **Live Server** do VS Code. Módulos ES **não funcionam**
   abrindo o arquivo com dois cliques (`file://`).

## Publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos (a pasta raiz do projeto deve ter o `index.html`).
2. No repositório: **Settings > Pages > Source: Deploy from a branch > main / (root) > Save**.
3. Depois de 1 a 2 minutos, o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
4. Informe no SIGAA o link do repositório e o link do GitHub Pages.

## Observações de segurança

- A chave publicável fica visível no código, o que é esperado para uma chave pública.
- As políticas de `sql/filmes.sql` liberam ler, inserir, alterar e apagar para qualquer visitante.
  Por isso, use um projeto/tabela só para este trabalho, sem dados importantes.
- Nunca coloque a chave `sb_secret_` nem a senha do banco no código.

## Créditos

`css/modern-normalize.css` é o modern-normalize (MIT License, Sindre Sorhus).
