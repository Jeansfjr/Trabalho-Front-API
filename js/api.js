// Cliente da API REST do Supabase (PostgREST) usando apenas fetch.
// Não usa nenhuma biblioteca, nem o SDK do Supabase.
import { SUPABASE_URL, SUPABASE_CHAVE, TABELA } from './config.js';

const URL_TABELA = `${SUPABASE_URL}/rest/v1/${TABELA}`;

// Cabeçalhos exigidos pela API. A chave JWT (antiga "anon") também vai em Authorization;
// as chaves novas (sb_publishable_...) só precisam do cabeçalho apikey.
function montarCabecalhos(extras = {}) {
  const cabecalhos = {
    apikey: SUPABASE_CHAVE,
    'Content-Type': 'application/json',
    ...extras
  };
  if (SUPABASE_CHAVE.startsWith('eyJ')) {
    cabecalhos.Authorization = `Bearer ${SUPABASE_CHAVE}`;
  }
  return cabecalhos;
}

// Faz a requisição e transforma erros HTTP em exceções com mensagem legível
async function requisitar(url, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(url, { ...opcoes, headers: montarCabecalhos(opcoes.headers) });
  } catch (erro) {
    throw new Error('Não foi possível conectar à API. Confira a URL em js/config.js e sua conexão.');
  }

  if (!resposta.ok) {
    let detalhe = '';
    try {
      const corpo = await resposta.json();
      detalhe = corpo.message || corpo.hint || '';
    } catch (erro) {
      // resposta sem corpo JSON: segue só com o código
    }
    throw new Error(`Erro ${resposta.status}${detalhe ? ': ' + detalhe : ''}`);
  }
  return resposta;
}

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Identificador de filme inválido.');
  }
}

// ---------------------------------------------------------------------
// COMANDOS DA API
// ---------------------------------------------------------------------

// 1) GET: lista os filmes, com filtros opcionais
//    - busca: título contém o texto            (?titulo=ilike.*texto*)
//    - genero: gênero igual                    (?genero=eq.Drama)
//    - status: 'sim' (assistidos) ou 'nao'     (?assistido=eq.true)
//    - ordem: coluna e direção                 (?order=nota.desc.nullslast)
export async function listarFilmes({ busca = '', genero = '', status = '', ordem = 'titulo.asc' } = {}) {
  const parametros = new URLSearchParams();
  parametros.set('select', '*');
  if (busca) parametros.set('titulo', `ilike.*${busca}*`);
  if (genero) parametros.set('genero', `eq.${genero}`);
  if (status === 'sim') parametros.set('assistido', 'eq.true');
  if (status === 'nao') parametros.set('assistido', 'eq.false');
  parametros.set('order', ordem);

  const resposta = await requisitar(`${URL_TABELA}?${parametros}`);
  return resposta.json();
}

// 2) GET: busca um filme pelo id (?id=eq.5)
export async function buscarFilmePorId(id) {
  validarId(id);
  const resposta = await requisitar(`${URL_TABELA}?select=*&id=eq.${id}`);
  const lista = await resposta.json();
  return lista[0] ?? null;
}

// 3) GET: conta quantos filmes existem (cabeçalho Prefer: count=exact)
export async function contarFilmes() {
  const resposta = await requisitar(`${URL_TABELA}?select=id`, {
    headers: { Prefer: 'count=exact' }
  });
  const intervalo = resposta.headers.get('Content-Range'); // ex.: "0-7/8"
  if (intervalo && intervalo.includes('/')) {
    return Number(intervalo.split('/')[1]);
  }
  return (await resposta.json()).length;
}

// 4) GET: os N filmes com maior nota (?order=nota.desc&limit=5)
export async function melhoresFilmes(quantidade = 5) {
  const parametros = new URLSearchParams({
    select: '*',
    nota: 'not.is.null',
    order: 'nota.desc',
    limit: String(quantidade)
  });
  const resposta = await requisitar(`${URL_TABELA}?${parametros}`);
  return resposta.json();
}

// 5) POST: cria um filme novo
export async function criarFilme(dados) {
  const resposta = await requisitar(URL_TABELA, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(dados)
  });
  const lista = await resposta.json();
  return lista[0];
}

// 6) PATCH: altera os dados de um filme (?id=eq.5)
export async function atualizarFilme(id, dados) {
  validarId(id);
  const resposta = await requisitar(`${URL_TABELA}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(dados)
  });
  const lista = await resposta.json();
  return lista[0];
}

// 7) DELETE: apaga um filme (?id=eq.5)
export async function excluirFilme(id) {
  validarId(id);
  await requisitar(`${URL_TABELA}?id=eq.${id}`, { method: 'DELETE' });
}
