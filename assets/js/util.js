/**
 * util.js — funções compartilhadas por componentes e módulos de página.
 * Sem dependências externas.
 */

/** Escapa texto para inserção segura em HTML. */
export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Lê o conteúdo bruto de um <script type="text/plain" slot="..."> filho.
 * Preserva a indentação relativa e remove a margem comum.
 * Retorna string vazia quando o slot não existe.
 */
export function lerSlot(host, nome) {
  const el = host.querySelector(`script[slot="${nome}"]`);
  if (!el) return '';
  return desindentar(el.textContent || '');
}

/** Remove linhas vazias das pontas e a indentação comum a todas as linhas. */
export function desindentar(texto) {
  const linhas = texto.replace(/\t/g, '    ').replace(/\r\n?/g, '\n').split('\n');
  while (linhas.length && linhas[0].trim() === '') linhas.shift();
  while (linhas.length && linhas[linhas.length - 1].trim() === '') linhas.pop();
  const margem = linhas
    .filter((l) => l.trim() !== '')
    .reduce((min, l) => Math.min(min, l.length - l.trimStart().length), Infinity);
  const corte = Number.isFinite(margem) ? margem : 0;
  return linhas.map((l) => l.slice(corte)).join('\n');
}

/** Slug estável a partir de um texto — usado em ids de checklist e quiz. */
export function slugificar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Slug da página atual, deduzido do nome do arquivo (aula-05.html -> aula-05). */
export function slugDaPagina() {
  const arquivo = window.location.pathname.split('/').pop() || 'index.html';
  return arquivo.replace(/\.html?$/i, '') || 'index';
}

/* --- localStorage tolerante a falha (modo privado, cookies bloqueados) --- */

const MEMORIA = new Map();

/** Lê um valor JSON do localStorage; devolve `padrao` se ausente ou inválido. */
export function lerArmazenado(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(chave);
    if (bruto === null) return MEMORIA.has(chave) ? MEMORIA.get(chave) : padrao;
    return JSON.parse(bruto);
  } catch {
    return MEMORIA.has(chave) ? MEMORIA.get(chave) : padrao;
  }
}

/** Grava um valor JSON no localStorage, caindo para memória se indisponível. */
export function gravarArmazenado(chave, valor) {
  MEMORIA.set(chave, valor);
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

/** Executa a função quando o DOM estiver pronto. */
export function aoCarregarDom(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

/**
 * Marca o elemento com data-overflow="1" quando o filho rolável corta conteúdo.
 * Alimenta a sombra lateral do terminal.
 */
export function observarCorte(host, rolavel) {
  const avaliar = () => {
    const corta = rolavel.scrollWidth > rolavel.clientWidth + 1;
    host.setAttribute('data-overflow', corta ? '1' : '0');
  };
  avaliar();
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(avaliar);
    ro.observe(rolavel);
  } else {
    window.addEventListener('resize', avaliar);
  }
  rolavel.addEventListener('scroll', () => {
    const fim = rolavel.scrollLeft + rolavel.clientWidth >= rolavel.scrollWidth - 2;
    host.setAttribute('data-overflow', fim ? '0' : '1');
  });
}

/** Copia texto para a área de transferência, com fallback para execCommand. */
export async function copiar(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* cai no fallback */
  }
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}
