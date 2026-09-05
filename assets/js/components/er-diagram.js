/**
 * <er-diagram> — diagrama entidade-relacionamento em notação pé-de-galinha,
 * renderizado pelo Mermaid 11 (erDiagram).
 *
 * Uso:
 *   <er-diagram legenda="Cliente e Pedido" descricao="Descrição textual...">
 *     <script type="text/plain">
 *   erDiagram
 *       CLIENTE ||--o{ PEDIDO : "faz"
 *     </script>
 *   </er-diagram>
 *
 * O Mermaid entra por CDN em ESM, com startOnLoad desligado e render manual.
 * Se o CDN falhar, o componente mostra um aviso e o código-fonte do diagrama —
 * o aluno ainda consegue ler o modelo e colar em qualquer editor Mermaid.
 */

import { escapar } from '../util.js';

const URL_MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';

let carregamento = null;
const registrados = new Set();

function temaAtual() {
  return document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'default' : 'dark';
}

/** Carrega e configura o Mermaid uma única vez. Resolve null se indisponível. */
function carregarMermaid() {
  if (carregamento) return carregamento;
  carregamento = import(/* @vite-ignore */ URL_MERMAID)
    .then((mod) => {
      const mermaid = mod.default || mod;
      mermaid.initialize({
        startOnLoad: false,
        theme: temaAtual(),
        securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        er: { useMaxWidth: true, entityPadding: 14, fontSize: 13 }
      });
      return mermaid;
    })
    .catch(() => null);
  return carregamento;
}

let contador = 0;

class ErDiagram extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    if (!this.querySelector('script') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    this.definicao = this.textoDoScript();
    const legenda = this.getAttribute('legenda') || '';
    const descricao = this.getAttribute('descricao') || '';
    this.idAlvo = `mermaid-${++contador}`;

    this.innerHTML =
      '<figure class="uc-diagrama">' +
      `<div class="uc-diagrama__palco" id="${this.idAlvo}" role="img" aria-label="${escapar(descricao || legenda || 'Diagrama entidade-relacionamento')}"></div>` +
      (legenda || descricao
        ? '<figcaption class="uc-diagrama__legenda">' +
          (legenda ? `<b>Figura.</b> ${escapar(legenda)}` : '') +
          (descricao
            ? `<details class="uc-diagrama__descricao"><summary>Descrição textual do diagrama</summary><p>${escapar(descricao)}</p></details>`
            : '') +
          '</figcaption>'
        : '') +
      '</figure>';

    registrados.add(this);
    this.desenhar();
  }

  disconnectedCallback() {
    registrados.delete(this);
  }

  textoDoScript() {
    const s = this.querySelector('script[type="text/plain"]');
    if (!s) return '';
    const linhas = (s.textContent || '').replace(/\r\n?/g, '\n').split('\n');
    while (linhas.length && linhas[0].trim() === '') linhas.shift();
    while (linhas.length && linhas[linhas.length - 1].trim() === '') linhas.pop();
    const margem = linhas
      .filter((l) => l.trim() !== '')
      .reduce((min, l) => Math.min(min, l.length - l.trimStart().length), Infinity);
    const corte = Number.isFinite(margem) ? margem : 0;
    return linhas.map((l) => l.slice(corte)).join('\n');
  }

  async desenhar() {
    const palco = this.querySelector('.uc-diagrama__palco');
    if (!palco) return;
    const mermaid = await carregarMermaid();
    if (!mermaid) {
      this.mostrarFallback();
      return;
    }
    try {
      // id novo a cada render: o Mermaid recusa reaproveitar um id ainda no DOM
      this.geracao = (this.geracao || 0) + 1;
      const { svg } = await mermaid.render(`${this.idAlvo}-svg-${this.geracao}`, this.definicao);
      palco.innerHTML = svg;
    } catch (erro) {
      this.mostrarFallback(erro);
    }
  }

  mostrarFallback(erro) {
    const figura = this.querySelector('.uc-diagrama');
    if (!figura || figura.querySelector('.uc-diagrama__erro')) return;
    const aviso = document.createElement('div');
    aviso.className = 'uc-diagrama__erro';
    aviso.textContent = erro
      ? 'O Mermaid recusou este diagrama. O código-fonte está abaixo.'
      : 'O Mermaid não pôde ser carregado (CDN indisponível). O código-fonte do diagrama está abaixo — cole em mermaid.live ou no dbdiagram para visualizar.';
    const fonte = document.createElement('pre');
    fonte.className = 'uc-diagrama__fonte';
    fonte.textContent = this.definicao;
    const palco = figura.querySelector('.uc-diagrama__palco');
    palco.replaceWith(aviso);
    aviso.after(fonte);
  }
}

/** Redesenha todos os diagramas quando o tema muda. */
window.addEventListener('uc:tema', async () => {
  const mermaid = await carregarMermaid();
  if (!mermaid) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: temaAtual(),
    securityLevel: 'strict',
    fontFamily: 'Inter, system-ui, sans-serif',
    er: { useMaxWidth: true, entityPadding: 14, fontSize: 13 }
  });
  registrados.forEach((el) => el.desenhar());
});

if (!customElements.get('er-diagram')) {
  customElements.define('er-diagram', ErDiagram);
}

/*
 * O mesmo componente serve para qualquer definição Mermaid — flowchart da
 * arquitetura ANSI/SPARC, diagrama dos JOINs, fluxo da normalização. O alias
 * existe para que o HTML diga o que está desenhando: <er-diagram> quando é um
 * modelo entidade-relacionamento, <mermaid-diagram> quando não é.
 */
class MermaidDiagram extends ErDiagram {}
if (!customElements.get('mermaid-diagram')) {
  customElements.define('mermaid-diagram', MermaidDiagram);
}

export { ErDiagram, MermaidDiagram };
