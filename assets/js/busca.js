/**
 * busca.js — filtro client-side sobre o índice derivado de data/aulas.js.
 *
 * Sem servidor, sem fetch e sem build: o índice é montado em memória a partir
 * dos títulos, subtítulos, seções e tags de cada aula, mais as páginas fixas.
 * Aulas ainda não publicadas aparecem como resultado inerte, para o aluno
 * saber que o tema existe e em que encontro ele será visto.
 */

import { AULAS, PAGINAS, getModulo, numeroFormatado } from './data/aulas.js';
import { escapar } from './util.js';
import { url, urlAula } from './layout.js';

const LIMITE = 12;

/** Remove acentos e caixa para comparação tolerante. */
function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

let indice = null;

function montarIndice() {
  if (indice) return indice;
  const entradas = [];

  AULAS.forEach((aula) => {
    const mod = getModulo(aula.modulo);
    const num = numeroFormatado(aula);
    const contexto = `${mod.rotulo} · Aula ${num}`;

    entradas.push({
      titulo: `Aula ${num} — ${aula.titulo}`,
      contexto,
      href: aula.publicada ? urlAula(aula.slug) : null,
      chave: normalizar([aula.titulo, aula.subtitulo, aula.tags.join(' ')].join(' '))
    });

    aula.secoes.forEach((secao) => {
      if (['objetivos', 'checklist', 'quiz', 'mao-na-massa', 'erros-comuns', 'problematizacao'].includes(secao.id)) {
        return;
      }
      entradas.push({
        titulo: secao.titulo,
        contexto: `${contexto} · ${aula.titulo}`,
        href: aula.publicada ? `${urlAula(aula.slug)}#${secao.id}` : null,
        chave: normalizar(`${secao.titulo} ${aula.titulo} ${aula.tags.join(' ')}`)
      });
    });
  });

  PAGINAS.forEach((p) => {
    entradas.push({
      titulo: p.titulo,
      contexto: 'Página do site',
      href: p.publicada ? url(p.arquivo) : null,
      chave: normalizar(p.titulo)
    });
  });

  indice = entradas;
  return indice;
}

function pesquisar(termo) {
  const partes = normalizar(termo).split(/\s+/).filter(Boolean);
  if (!partes.length) return [];
  return montarIndice()
    .filter((e) => partes.every((p) => e.chave.includes(p)))
    .slice(0, LIMITE);
}

function htmlResultado(item) {
  const corpo =
    `<strong>${escapar(item.titulo)}</strong>` + `<span class="uc-busca-ctx">${escapar(item.contexto)}</span>`;
  if (!item.href) {
    return `<span class="uc-busca-item-inerte d-block px-3 py-2 text-body-secondary">${corpo}<span class="uc-em-breve">em breve</span></span>`;
  }
  return `<a href="${item.href}" role="option">${corpo}</a>`;
}

/** Liga a caixa de busca da navbar. */
export function iniciarBusca() {
  const campo = document.getElementById('uc-busca-input');
  const painel = document.getElementById('uc-busca-resultados');
  if (!campo || !painel) return;

  let selecionado = -1;

  const fechar = () => {
    painel.hidden = true;
    painel.innerHTML = '';
    campo.setAttribute('aria-expanded', 'false');
    selecionado = -1;
  };

  const abrir = (itens) => {
    if (!itens.length) {
      painel.innerHTML = '<p class="uc-busca-vazio mb-0">Nada encontrado. Tente "cardinalidade", "join" ou "backup".</p>';
    } else {
      painel.innerHTML = itens.map(htmlResultado).join('');
    }
    painel.hidden = false;
    campo.setAttribute('aria-expanded', 'true');
    selecionado = -1;
  };

  const opcoes = () => Array.from(painel.querySelectorAll('a'));

  const destacar = (novo) => {
    const lista = opcoes();
    if (!lista.length) return;
    selecionado = (novo + lista.length) % lista.length;
    lista.forEach((el, i) => el.classList.toggle('active', i === selecionado));
    lista[selecionado].focus();
  };

  campo.addEventListener('input', () => {
    const termo = campo.value.trim();
    if (termo.length < 2) {
      fechar();
      return;
    }
    abrir(pesquisar(termo));
  });

  campo.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      fechar();
      campo.blur();
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      destacar(0);
    } else if (ev.key === 'Enter') {
      const primeiro = opcoes()[0];
      if (primeiro) {
        ev.preventDefault();
        window.location.href = primeiro.href;
      }
    }
  });

  painel.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      destacar(selecionado + 1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (selecionado <= 0) {
        campo.focus();
        selecionado = -1;
      } else {
        destacar(selecionado - 1);
      }
    } else if (ev.key === 'Escape') {
      fechar();
      campo.focus();
    }
  });

  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.uc-busca')) fechar();
  });

  // "/" foca a busca, como em documentação técnica
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const alvo = ev.target;
    const editando =
      alvo instanceof HTMLInputElement ||
      alvo instanceof HTMLTextAreaElement ||
      (alvo instanceof HTMLElement && alvo.isContentEditable);
    if (editando) return;
    ev.preventDefault();
    campo.focus();
    campo.select();
  });
}
