/**
 * tema.js — alternância entre escuro (padrão) e claro.
 *
 * O terminal permanece escuro nos dois temas: essa decisão está no CSS,
 * não aqui. O tema é aplicado em <html data-bs-theme> e persistido em
 * uc10:tema. Cada página traz um snippet inline no <head> que aplica o tema
 * salvo antes da primeira pintura, evitando o flash de tela branca.
 */

import { lerArmazenado, gravarArmazenado } from './util.js';

const CHAVE = 'uc10:tema';

/** Tema atualmente aplicado. */
export function temaAtual() {
  return document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
}

/** Aplica um tema, persiste e avisa a página (o Mermaid escuta para redesenhar). */
export function aplicarTema(tema) {
  const valor = tema === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', valor);
  gravarArmazenado(CHAVE, valor);
  window.dispatchEvent(new CustomEvent('uc:tema', { detail: { tema: valor } }));
  atualizarBotoes(valor);
  return valor;
}

/** Inverte o tema atual. */
export function alternarTema() {
  return aplicarTema(temaAtual() === 'dark' ? 'light' : 'dark');
}

function atualizarBotoes(tema) {
  document.querySelectorAll('[data-acao="tema"]').forEach((botao) => {
    const claro = tema === 'light';
    botao.setAttribute('aria-pressed', String(claro));
    botao.setAttribute('title', claro ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
    const icone = botao.querySelector('i');
    if (icone) icone.className = claro ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    const rotulo = botao.querySelector('.visually-hidden');
    if (rotulo) rotulo.textContent = claro ? 'Tema claro ativo' : 'Tema escuro ativo';
  });
}

/** Liga os botões de tema e sincroniza o estado inicial. */
export function iniciarTema() {
  const salvo = lerArmazenado(CHAVE, null);
  const inicial = salvo === 'light' || salvo === 'dark' ? salvo : temaAtual();
  document.documentElement.setAttribute('data-bs-theme', inicial);
  atualizarBotoes(inicial);

  document.addEventListener('click', (ev) => {
    const botao = ev.target.closest('[data-acao="tema"]');
    if (botao) alternarTema();
  });

  window.addEventListener('storage', (ev) => {
    if (ev.key !== CHAVE) return;
    const novo = lerArmazenado(CHAVE, 'dark');
    document.documentElement.setAttribute('data-bs-theme', novo === 'light' ? 'light' : 'dark');
    atualizarBotoes(novo);
    window.dispatchEvent(new CustomEvent('uc:tema', { detail: { tema: novo } }));
  });
}
