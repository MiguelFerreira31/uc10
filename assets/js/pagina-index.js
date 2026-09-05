/**
 * pagina-index.js — monta a trilha completa da página inicial a partir de
 * data/aulas.js. Os cartões de módulo, a lista de aulas e o painel de
 * progresso são todos derivados; nada é escrito à mão no index.html.
 */

import { MODULOS, AULAS, TOTAL_AULAS, CARGA_TOTAL, aulasDoModulo, numeroFormatado, INDICADORES } from './data/aulas.js';
import { urlAula } from './layout.js';
import { escapar } from './util.js';
import { concluidas, estaConcluida, percentual } from './progresso.js';

function htmlAula(aula) {
  const num = numeroFormatado(aula);
  const feita = estaConcluida(aula.slug) ? ' uc-feita' : '';
  const meta = `<span class="badge text-bg-dark">${aula.carga}h</span>`;
  if (!aula.publicada) {
    return (
      `<li class="${feita.trim()}" data-slug="${aula.slug}">` +
      '<span class="d-grid text-body-secondary" style="grid-template-columns:2.6rem 1fr auto;gap:.75rem;align-items:center;padding:.7rem 1rem">' +
      `<span class="uc-num">${num}</span>` +
      `<span>${escapar(aula.titulo)}<span class="uc-em-breve">em breve</span><br><small class="text-body-secondary">${escapar(aula.subtitulo)}</small></span>` +
      `${meta}</span></li>`
    );
  }
  return (
    `<li class="${feita.trim()}" data-slug="${aula.slug}">` +
    `<a href="${urlAula(aula.slug)}">` +
    `<span class="uc-num">${num}</span>` +
    `<span><strong>${escapar(aula.titulo)}</strong><br><small class="text-body-secondary">${escapar(aula.subtitulo)}</small></span>` +
    `${meta}</a></li>`
  );
}

function htmlModulo(mod) {
  const aulas = aulasDoModulo(mod.id);
  return `
<section class="uc-card-modulo mb-4">
  <div class="p-3 border-bottom">
    <div class="d-flex flex-wrap align-items-baseline gap-2">
      <span class="uc-modulo-num">${escapar(mod.rotulo).toUpperCase()}</span>
      <h2 class="h5 mb-0 flex-grow-1">${escapar(mod.titulo)}</h2>
      <span class="badge text-bg-secondary">${mod.carga}h · ${aulas.length} ${aulas.length === 1 ? 'encontro' : 'encontros'}</span>
    </div>
    <p class="mb-0 mt-2 small text-body-secondary">${escapar(mod.resumo)}</p>
  </div>
  <ul class="uc-lista-aulas">${aulas.map(htmlAula).join('')}</ul>
</section>`;
}

function htmlPainel() {
  const feitas = concluidas().length;
  const pct = percentual();
  const publicadas = AULAS.filter((a) => a.publicada).length;
  return `
<div class="row g-3 mb-4">
  <div class="col-6 col-lg-3">
    <div class="uc-card-modulo p-3 h-100">
      <div class="uc-modulo-num">CARGA HORÁRIA</div>
      <div class="fs-4 fw-semibold">${CARGA_TOTAL}h</div>
      <div class="small text-body-secondary">${TOTAL_AULAS} encontros de 3h</div>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="uc-card-modulo p-3 h-100">
      <div class="uc-modulo-num">SGBD</div>
      <div class="fs-4 fw-semibold">SQL Server 2022</div>
      <div class="small text-body-secondary">Express + SSMS 20 · T-SQL</div>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="uc-card-modulo p-3 h-100">
      <div class="uc-modulo-num">ESTUDO DE CASO</div>
      <div class="fs-4 fw-semibold">Bella Massa</div>
      <div class="small text-body-secondary">Pizzaria com delivery e salão</div>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="uc-card-modulo p-3 h-100">
      <div class="uc-modulo-num">SEU PROGRESSO</div>
      <div class="fs-4 fw-semibold" data-painel-pct>${pct}%</div>
      <div class="small text-body-secondary" data-painel-detalhe>${feitas} de ${TOTAL_AULAS} aulas concluídas · ${publicadas} publicadas</div>
    </div>
  </div>
</div>`;
}

function htmlIndicadores() {
  const linhas = INDICADORES.map(
    (ind) => `
<li class="d-flex gap-3 py-2 border-top">
  <span class="badge text-bg-primary align-self-start">${escapar(ind.curto)}</span>
  <span><strong>${escapar(ind.titulo)}.</strong> <span class="text-body-secondary">${escapar(ind.texto)}</span></span>
</li>`
  ).join('');
  return `<ul class="list-unstyled mb-0">${linhas}</ul>`;
}

function montar() {
  const painel = document.getElementById('painel-curso');
  if (painel) painel.innerHTML = htmlPainel();

  const trilha = document.getElementById('trilha');
  if (trilha) trilha.innerHTML = MODULOS.map(htmlModulo).join('');

  const indicadores = document.getElementById('indicadores');
  if (indicadores) indicadores.innerHTML = htmlIndicadores();

  const atualizar = () => {
    const pct = document.querySelector('[data-painel-pct]');
    const detalhe = document.querySelector('[data-painel-detalhe]');
    const publicadas = AULAS.filter((a) => a.publicada).length;
    if (pct) pct.textContent = `${percentual()}%`;
    if (detalhe) {
      detalhe.textContent = `${concluidas().length} de ${TOTAL_AULAS} aulas concluídas · ${publicadas} publicadas`;
    }
    document.querySelectorAll('.uc-lista-aulas li[data-slug]').forEach((li) => {
      li.classList.toggle('uc-feita', estaConcluida(li.dataset.slug));
    });
  };
  window.addEventListener('uc:progresso', atualizar);
  atualizar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', montar, { once: true });
} else {
  montar();
}
