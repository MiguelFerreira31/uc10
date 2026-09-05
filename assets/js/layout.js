/**
 * layout.js — injeta navbar, sidebar, breadcrumb, prev/next e rodapé a partir
 * de data/aulas.js. Nenhuma dessas listas existe escrita à mão no HTML.
 *
 * A página de aula só carrega o miolo do conteúdo e cinco pontos de montagem:
 *   #app-navbar  #app-sidebar  #app-breadcrumb  #app-prevnext  #app-rodape
 *
 * Todos os caminhos são resolvidos a partir da URL deste próprio módulo
 * (import.meta.url), o que faz o site funcionar tanto na raiz do domínio
 * quanto em subdiretório de project page do GitHub Pages, e também em file://.
 */

import {
  AULAS,
  MODULOS,
  PAGINAS,
  TOTAL_AULAS,
  CARGA_TOTAL,
  getAula,
  getModulo,
  aulasDoModulo,
  aulaAnterior,
  aulaProxima,
  indicadoresDaAula,
  aulasDoIndicador,
  INDICADORES,
  numeroFormatado
} from './data/aulas.js';
import { escapar, slugDaPagina } from './util.js';
import { concluidas, estaConcluida, alternarConcluida, montarBarraProgresso } from './progresso.js';

/** Raiz do site, deduzida da localização deste módulo (assets/js/layout.js). */
export const RAIZ = new URL('../../', import.meta.url);

/** Resolve um caminho relativo à raiz do site. */
export function url(caminho) {
  return new URL(caminho, RAIZ).href;
}

/** Caminho do arquivo de uma aula. */
export function urlAula(slug) {
  return url(`aulas/${slug}.html`);
}

/** A página fixa já existe no repositório? */
export function paginaPublicada(arquivo) {
  const p = PAGINAS.find((x) => x.arquivo === arquivo);
  return Boolean(p && p.publicada);
}

/* --------------------------------------------------------------------- */
/* Navbar                                                                 */
/* --------------------------------------------------------------------- */

function htmlNavbar(paginaAtual) {
  const links = PAGINAS.filter((p) => p.arquivo !== 'index.html')
    .map((p) => {
      const ativo = p.arquivo === paginaAtual ? ' active' : '';
      if (!p.publicada) {
        return `<li><span class="dropdown-item disabled" aria-disabled="true">${escapar(p.titulo)} <span class="badge text-bg-secondary ms-1">em breve</span></span></li>`;
      }
      return `<li><a class="dropdown-item${ativo}" href="${url(p.arquivo)}"><i class="bi ${p.icone} me-2" aria-hidden="true"></i>${escapar(p.titulo)}</a></li>`;
    })
    .join('');

  return `
<nav class="navbar navbar-expand uc-navbar fixed-top" aria-label="Barra principal">
  <div class="container-fluid gap-2 px-3">
    <button class="btn btn-sm btn-outline-secondary d-lg-none" type="button"
            data-bs-toggle="offcanvas" data-bs-target="#app-sidebar" aria-controls="app-sidebar">
      <i class="bi bi-list" aria-hidden="true"></i><span class="visually-hidden">Abrir o sumário do curso</span>
    </button>
    <a class="navbar-brand d-flex align-items-center" href="${url('index.html')}">
      <span class="uc-brand-uc">UC10</span>
      <span class="d-none d-sm-inline">Desenvolver banco de dados</span>
      <span class="d-sm-none">Banco de dados</span>
    </a>
    <div class="ms-auto d-flex align-items-center gap-2">
      <div class="uc-busca">
        <label class="visually-hidden" for="uc-busca-input">Buscar no curso</label>
        <input type="search" id="uc-busca-input" class="form-control form-control-sm" style="width:min(16rem,42vw)"
               placeholder="Buscar aula ou termo" autocomplete="off" role="combobox"
               aria-expanded="false" aria-controls="uc-busca-resultados" aria-autocomplete="list">
        <div class="uc-busca-resultados" id="uc-busca-resultados" role="listbox" hidden></div>
      </div>
      <div class="dropdown">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-grid" aria-hidden="true"></i><span class="visually-hidden">Outras páginas do site</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">${links}</ul>
      </div>
      <button class="btn btn-sm btn-outline-secondary" type="button" data-acao="tema" aria-pressed="false">
        <i class="bi bi-moon-stars-fill" aria-hidden="true"></i>
        <span class="visually-hidden">Alternar tema</span>
      </button>
    </div>
  </div>
</nav>`;
}

/* --------------------------------------------------------------------- */
/* Sidebar                                                                */
/* --------------------------------------------------------------------- */

function htmlItemAula(aula, slugAtual) {
  const num = numeroFormatado(aula);
  const feita = estaConcluida(aula.slug) ? ' uc-feita' : '';
  const marca = estaConcluida(aula.slug) ? ' <span aria-hidden="true">&#10003;</span>' : '';
  if (!aula.publicada) {
    return (
      `<span class="uc-aula-link uc-indisponivel" aria-disabled="true" data-slug="${aula.slug}">` +
      `<span class="uc-num">${num}</span>` +
      `<span>${escapar(aula.titulo)} <span class="uc-em-breve">em breve</span></span>` +
      '</span>'
    );
  }
  const atual = aula.slug === slugAtual ? ' aria-current="page"' : '';
  return (
    `<a class="uc-aula-link${feita}" href="${urlAula(aula.slug)}"${atual} data-slug="${aula.slug}">` +
    `<span class="uc-num">${num}${marca}</span>` +
    `<span>${escapar(aula.titulo)}</span>` +
    '</a>'
  );
}

function htmlSidebar(slugAtual) {
  const aulaAtual = getAula(slugAtual);
  const moduloAberto = aulaAtual ? aulaAtual.modulo : 0;

  const itens = MODULOS.map((mod) => {
    const aberto = mod.id === moduloAberto;
    const aulas = aulasDoModulo(mod.id).map((a) => htmlItemAula(a, slugAtual)).join('');
    const feitasNoModulo = aulasDoModulo(mod.id).filter((a) => estaConcluida(a.slug)).length;
    return `
<div class="accordion-item">
  <h3 class="accordion-header">
    <button class="accordion-button ${aberto ? '' : 'collapsed'}" type="button"
            data-bs-toggle="collapse" data-bs-target="#mod-${mod.id}" aria-expanded="${aberto}" aria-controls="mod-${mod.id}">
      <span class="flex-grow-1 text-start">${escapar(mod.rotulo)} · ${escapar(mod.titulo)}</span>
      <span class="badge text-bg-secondary ms-2" data-contador-modulo="${mod.id}">${feitasNoModulo}/${aulasDoModulo(mod.id).length}</span>
    </button>
  </h3>
  <div id="mod-${mod.id}" class="accordion-collapse collapse ${aberto ? 'show' : ''}">
    <div class="accordion-body">${aulas}</div>
  </div>
</div>`;
  }).join('');

  return `
<div class="uc-sidebar__interno">
  <div class="uc-sidebar__topo d-flex justify-content-between align-items-center">
    <span class="uc-modulo-num">SUMÁRIO · ${CARGA_TOTAL}H</span>
    <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#app-sidebar" aria-label="Fechar o sumário"></button>
  </div>
  <div class="accordion accordion-flush" id="uc-acordeao-modulos">${itens}</div>
  <div class="px-3 py-3 small text-body-secondary" data-resumo-progresso></div>
</div>`;
}

/* --------------------------------------------------------------------- */
/* Breadcrumb, prev/next e rodapé                                         */
/* --------------------------------------------------------------------- */

/**
 * Cabeçalho da aula (item 1 e item 4 da anatomia): módulo, número, carga,
 * tempo de leitura, indicadores da UC e pré-requisitos com link.
 * Tudo derivado de data/aulas.js — a página de aula não repete nada disso.
 */
function htmlCabecalhoAula(slug) {
  const aula = getAula(slug);
  if (!aula) return '';
  const mod = getModulo(aula.modulo);

  const badgesIndicadores = indicadoresDaAula(aula)
    .map(
      (ind) =>
        `<span class="badge text-bg-info" title="${escapar(ind.texto)}">${escapar(ind.curto)} · ${escapar(ind.titulo)}</span>`
    )
    .join('');

  const prereq = aula.prereq
    .map((s) => getAula(s))
    .filter(Boolean)
    .map((p) =>
      p.publicada
        ? `<a href="${urlAula(p.slug)}">Aula ${numeroFormatado(p)} — ${escapar(p.titulo)}</a>`
        : `<span class="text-body-secondary">Aula ${numeroFormatado(p)} — ${escapar(p.titulo)} (em breve)</span>`
    )
    .join(', ');

  return `
<header class="uc-aula-cabecalho">
  <div class="uc-meta mb-2">
    <span class="badge text-bg-primary">${escapar(mod.rotulo)} · ${escapar(mod.titulo)}</span>
    <span class="badge text-bg-dark">Aula ${numeroFormatado(aula)} de ${TOTAL_AULAS}</span>
    <span class="badge text-bg-dark">${aula.carga}h de encontro</span>
    <span class="badge text-bg-dark">~${aula.leitura} min de leitura</span>
    ${badgesIndicadores}
  </div>
  <h1>${escapar(aula.titulo)}</h1>
  <p class="lead mb-2">${escapar(aula.subtitulo)}</p>
  <p class="small mb-0"><strong>Pré-requisitos:</strong> ${prereq || 'nenhum — esta é a porta de entrada do curso.'}</p>
</header>`;
}

/**
 * Matriz indicador da UC x aulas que o atendem. Usada na aula de apresentação
 * e, mais tarde, na página do docente. Derivada de data/aulas.js.
 */
function htmlMatrizIndicadores() {
  const linhas = INDICADORES.map((ind) => {
    const aulas = aulasDoIndicador(ind.id)
      .map((a) =>
        a.publicada
          ? `<a href="${urlAula(a.slug)}" class="badge text-bg-secondary text-decoration-none">${numeroFormatado(a)}</a>`
          : `<span class="badge text-bg-dark" title="${escapar(a.titulo)}">${numeroFormatado(a)}</span>`
      )
      .join(' ');
    const total = aulasDoIndicador(ind.id).length;
    return `
<tr>
  <th scope="row" class="text-nowrap"><span class="badge text-bg-primary">${escapar(ind.curto)}</span></th>
  <td><strong>${escapar(ind.titulo)}.</strong><br><span class="text-body-secondary">${escapar(ind.texto)}</span></td>
  <td class="text-nowrap">${aulas}<br><small class="text-body-secondary">${total} ${total === 1 ? 'encontro' : 'encontros'}</small></td>
</tr>`;
  }).join('');

  return `
<div class="uc-tabela-wrap">
  <table class="table table-sm uc-dados mb-0">
    <thead>
      <tr>
        <th scope="col">Indicador</th>
        <th scope="col">O que a banca vai observar</th>
        <th scope="col">Encontros</th>
      </tr>
    </thead>
    <tbody>${linhas}</tbody>
  </table>
</div>`;
}

/** Resumo dos 4 módulos, com carga somada a partir das aulas. */
function htmlMapaModulos() {
  const itens = MODULOS.map((mod) => {
    const aulas = aulasDoModulo(mod.id);
    const primeira = numeroFormatado(aulas[0]);
    const ultima = numeroFormatado(aulas[aulas.length - 1]);
    const faixa = aulas.length === 1 ? `Encontro ${primeira}` : `Encontros ${primeira} a ${ultima}`;
    return `
<tr>
  <th scope="row" class="text-nowrap">${escapar(mod.rotulo)}</th>
  <td><strong>${escapar(mod.titulo)}</strong><br><span class="text-body-secondary">${escapar(mod.resumo)}</span></td>
  <td class="text-nowrap">${faixa}<br><small class="text-body-secondary">${mod.carga}h · ${mod.encontros} ${mod.encontros === 1 ? 'aula' : 'aulas'}</small></td>
</tr>`;
  }).join('');

  return `
<div class="uc-tabela-wrap">
  <table class="table table-sm uc-dados mb-0">
    <thead>
      <tr>
        <th scope="col">Módulo</th>
        <th scope="col">O que você aprende</th>
        <th scope="col">Quando</th>
      </tr>
    </thead>
    <tbody>${itens}</tbody>
    <tfoot>
      <tr>
        <th scope="row">Total</th>
        <td class="text-body-secondary">Da apresentação da unidade à entrega documentada do banco da pizzaria</td>
        <td class="text-nowrap"><strong>${CARGA_TOTAL}h · ${TOTAL_AULAS} encontros</strong></td>
      </tr>
    </tfoot>
  </table>
</div>`;
}

/** Bloco de download do script .sql da aula (item 10 da anatomia). */
function htmlScriptDaAula(slug) {
  const aula = getAula(slug);
  if (!aula || !aula.script) return '';
  return `
<div class="uc-download">
  <i class="bi bi-filetype-sql fs-4" aria-hidden="true"></i>
  <span class="uc-download__nome">scripts/${escapar(aula.script)}</span>
  <span class="uc-download__desc">Todos os comandos desta aula, na ordem em que devem ser executados num SQL Server 2022 limpo.</span>
  <a class="btn btn-sm btn-outline-primary" href="${url(`scripts/${aula.script}`)}" download>
    <i class="bi bi-download me-1" aria-hidden="true"></i>Baixar o script
  </a>
</div>`;
}

function htmlBreadcrumb(slugAtual, tituloPagina) {
  const aula = getAula(slugAtual);
  let trilha;
  if (aula) {
    const mod = getModulo(aula.modulo);
    trilha =
      `<li class="breadcrumb-item"><a href="${url('index.html')}">Trilha</a></li>` +
      `<li class="breadcrumb-item">${escapar(mod.rotulo)} · ${escapar(mod.titulo)}</li>` +
      `<li class="breadcrumb-item active" aria-current="page">Aula ${numeroFormatado(aula)}</li>`;
  } else {
    trilha =
      `<li class="breadcrumb-item"><a href="${url('index.html')}">Trilha</a></li>` +
      `<li class="breadcrumb-item active" aria-current="page">${escapar(tituloPagina)}</li>`;
  }
  return `<nav aria-label="Você está aqui"><ol class="breadcrumb small mb-3">${trilha}</ol></nav>`;
}

function htmlCartaoVizinho(aula, direcao) {
  const rotulo = direcao === 'anterior' ? 'Aula anterior' : 'Próxima aula';
  const classe = direcao === 'anterior' ? '' : ' uc-prox';
  if (!aula) return '<div></div>';

  const corpo =
    `<span class="uc-dir">${rotulo}</span>` +
    `<span class="d-block">${numeroFormatado(aula)} · ${escapar(aula.titulo)}</span>`;

  if (!aula.publicada) {
    return `<div class="uc-vizinho-inerte${classe}">${corpo}<span class="uc-em-breve">em breve</span></div>`;
  }
  return `<a href="${urlAula(aula.slug)}" class="${classe.trim()}">${corpo}</a>`;
}

function htmlPrevNext(slugAtual) {
  const aula = getAula(slugAtual);
  if (!aula) return '';
  const anterior = aulaAnterior(slugAtual);
  const proxima = aulaProxima(slugAtual);
  const feita = estaConcluida(slugAtual);
  return `
<div class="d-flex flex-wrap gap-2 align-items-center mt-5 pt-3 border-top">
  <button type="button" class="btn ${feita ? 'btn-success' : 'btn-outline-success'}" data-acao="concluir" data-slug="${slugAtual}" aria-pressed="${feita}">
    <i class="bi ${feita ? 'bi-check-circle-fill' : 'bi-check-circle'} me-1" aria-hidden="true"></i>
    <span data-rotulo-concluir>${feita ? 'Aula concluída' : 'Marcar aula como concluída'}</span>
  </button>
  ${paginaPublicada('glossario.html') ? `<a class="btn btn-outline-secondary" href="${url('glossario.html')}"><i class="bi bi-book me-1" aria-hidden="true"></i>Glossário</a>` : ''}
  <span class="small text-body-secondary ms-auto" data-resumo-progresso></span>
</div>
<nav class="uc-prevnext" aria-label="Navegação entre aulas">
  ${htmlCartaoVizinho(anterior, 'anterior')}
  ${htmlCartaoVizinho(proxima, 'proxima')}
</nav>`;
}

function htmlRodape() {
  const links = PAGINAS.map((p) =>
    p.publicada
      ? `<a href="${url(p.arquivo)}" class="me-3">${escapar(p.titulo)}</a>`
      : `<span class="me-3 text-body-secondary">${escapar(p.titulo)} (em breve)</span>`
  ).join('');
  return `
<div class="uc-rodape">
  <div class="container-fluid px-3">
    <div class="mb-2">${links}</div>
    <p class="mb-1">
      <strong>UC10 · Desenvolver banco de dados</strong> — Habilitação Profissional Técnica em Informática, SENAC.
      ${TOTAL_AULAS} encontros de 3h, ${CARGA_TOTAL} horas. Estudo de caso: Pizzaria Bella Massa.
    </p>
    <p class="mb-0">SGBD alvo: Microsoft SQL Server 2022 Express com SSMS 20. Site estático, sem build — HTML, CSS e JavaScript.</p>
  </div>
</div>`;
}

/* --------------------------------------------------------------------- */
/* Montagem                                                               */
/* --------------------------------------------------------------------- */

function atualizarMarcasDeProgresso() {
  const feitas = concluidas();

  document.querySelectorAll('.uc-aula-link[data-slug]').forEach((el) => {
    const feita = feitas.includes(el.dataset.slug);
    el.classList.toggle('uc-feita', feita);
    const num = el.querySelector('.uc-num');
    if (num) {
      const base = num.textContent.replace(/\s*✓\s*$/, '').trim();
      num.innerHTML = feita ? `${escapar(base)} <span aria-hidden="true">&#10003;</span>` : escapar(base);
    }
  });

  MODULOS.forEach((mod) => {
    const alvo = document.querySelector(`[data-contador-modulo="${mod.id}"]`);
    if (!alvo) return;
    const doModulo = aulasDoModulo(mod.id);
    alvo.textContent = `${doModulo.filter((a) => feitas.includes(a.slug)).length}/${doModulo.length}`;
  });

  document.querySelectorAll('[data-resumo-progresso]').forEach((el) => {
    el.textContent = `${feitas.length} de ${TOTAL_AULAS} aulas concluídas`;
  });

  document.querySelectorAll('[data-acao="concluir"]').forEach((botao) => {
    const feita = feitas.includes(botao.dataset.slug);
    botao.classList.toggle('btn-success', feita);
    botao.classList.toggle('btn-outline-success', !feita);
    botao.setAttribute('aria-pressed', String(feita));
    const icone = botao.querySelector('i');
    if (icone) icone.className = `bi ${feita ? 'bi-check-circle-fill' : 'bi-check-circle'} me-1`;
    const rotulo = botao.querySelector('[data-rotulo-concluir]');
    if (rotulo) rotulo.textContent = feita ? 'Aula concluída' : 'Marcar aula como concluída';
  });

  document.querySelectorAll('.uc-lista-aulas li[data-slug]').forEach((li) => {
    li.classList.toggle('uc-feita', feitas.includes(li.dataset.slug));
  });
}

/** Monta o layout da página inteira. Chamado por main.js. */
export function montarLayout() {
  const corpo = document.body;
  const slug = slugDaPagina();
  const arquivoAtual = `${slug}.html`;
  const tituloPagina = corpo.dataset.titulo || document.title.split('·')[0].trim();

  const alvoNavbar = document.getElementById('app-navbar');
  if (alvoNavbar) alvoNavbar.innerHTML = htmlNavbar(arquivoAtual);

  const alvoSidebar = document.getElementById('app-sidebar');
  if (alvoSidebar) {
    alvoSidebar.className = 'uc-sidebar offcanvas-lg offcanvas-start';
    alvoSidebar.setAttribute('tabindex', '-1');
    alvoSidebar.setAttribute('aria-label', 'Sumário do curso');
    alvoSidebar.innerHTML = htmlSidebar(slug);
  }

  const alvoBreadcrumb = document.getElementById('app-breadcrumb');
  if (alvoBreadcrumb) alvoBreadcrumb.innerHTML = htmlBreadcrumb(slug, tituloPagina);

  const alvoCabecalho = document.getElementById('app-cabecalho');
  if (alvoCabecalho) alvoCabecalho.innerHTML = htmlCabecalhoAula(slug);

  const alvoScript = document.getElementById('app-script');
  if (alvoScript) alvoScript.innerHTML = htmlScriptDaAula(slug);

  const alvoIndicadores = document.getElementById('app-indicadores');
  if (alvoIndicadores) alvoIndicadores.innerHTML = htmlMatrizIndicadores();

  const alvoMapa = document.getElementById('app-mapa-modulos');
  if (alvoMapa) alvoMapa.innerHTML = htmlMapaModulos();

  const alvoPrevNext = document.getElementById('app-prevnext');
  if (alvoPrevNext) alvoPrevNext.innerHTML = htmlPrevNext(slug);

  const alvoRodape = document.getElementById('app-rodape');
  if (alvoRodape) alvoRodape.innerHTML = htmlRodape();

  montarBarraProgresso();

  document.addEventListener('click', (ev) => {
    const botao = ev.target.closest('[data-acao="concluir"]');
    if (!botao) return;
    alternarConcluida(botao.dataset.slug);
  });

  window.addEventListener('uc:progresso', atualizarMarcasDeProgresso);
  window.addEventListener('storage', (ev) => {
    if (ev.key === 'uc10:progresso') atualizarMarcasDeProgresso();
  });
  atualizarMarcasDeProgresso();

  // Fecha o offcanvas do sumário ao navegar em telas pequenas
  if (alvoSidebar) {
    alvoSidebar.addEventListener('click', (ev) => {
      if (!ev.target.closest('a.uc-aula-link')) return;
      const oc = window.bootstrap && window.bootstrap.Offcanvas.getInstance(alvoSidebar);
      if (oc) oc.hide();
    });
  }
}

/** Dados úteis para páginas que montam listas próprias (index, docente). */
export { AULAS, MODULOS, PAGINAS, TOTAL_AULAS, CARGA_TOTAL, getAula, getModulo, aulasDoModulo, indicadoresDaAula, numeroFormatado };
