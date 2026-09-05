/**
 * progresso.js — aulas concluídas no localStorage e barra de progresso global.
 *
 * Chave: uc10:progresso -> ["aula-01", "aula-05", ...]
 * Emite o evento window "uc:progresso" a cada mudança, para que sidebar,
 * index e barra se atualizem sem recarregar a página.
 */

import { lerArmazenado, gravarArmazenado } from './util.js';
import { TOTAL_AULAS } from './data/aulas.js';

const CHAVE = 'uc10:progresso';

/** Lista de slugs concluídos. */
export function concluidas() {
  const valor = lerArmazenado(CHAVE, []);
  return Array.isArray(valor) ? valor : [];
}

/** A aula está marcada como concluída? */
export function estaConcluida(slug) {
  return concluidas().includes(slug);
}

/** Marca ou desmarca uma aula e avisa a página. */
export function definirConcluida(slug, valor) {
  const atual = new Set(concluidas());
  if (valor) atual.add(slug);
  else atual.delete(slug);
  const lista = Array.from(atual);
  gravarArmazenado(CHAVE, lista);
  window.dispatchEvent(new CustomEvent('uc:progresso', { detail: { slug, concluidas: lista } }));
  return lista;
}

/** Inverte o estado de conclusão da aula. */
export function alternarConcluida(slug) {
  return definirConcluida(slug, !estaConcluida(slug));
}

/** Percentual inteiro de conclusão do curso. */
export function percentual() {
  if (!TOTAL_AULAS) return 0;
  return Math.round((concluidas().length / TOTAL_AULAS) * 100);
}

/** Cria (se preciso) e atualiza a barra fixa de progresso abaixo da navbar. */
export function montarBarraProgresso() {
  let barra = document.querySelector('.uc-progresso-global');
  if (!barra) {
    barra = document.createElement('div');
    barra.className = 'uc-progresso-global';
    barra.innerHTML = '<div></div>';
    document.body.appendChild(barra);
  }
  const interna = barra.querySelector('div');
  const aplicar = () => {
    const pct = percentual();
    interna.style.width = `${pct}%`;
    barra.setAttribute('role', 'progressbar');
    barra.setAttribute('aria-valuemin', '0');
    barra.setAttribute('aria-valuemax', '100');
    barra.setAttribute('aria-valuenow', String(pct));
    barra.setAttribute('aria-label', `Progresso no curso: ${concluidas().length} de ${TOTAL_AULAS} aulas`);
  };
  aplicar();
  window.addEventListener('uc:progresso', aplicar);
  window.addEventListener('storage', (ev) => {
    if (ev.key === CHAVE) aplicar();
  });
}
