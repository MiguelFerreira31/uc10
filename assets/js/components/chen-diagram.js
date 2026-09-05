/**
 * <chen-diagram> — notação de Chen em SVG, montada a partir de coordenadas
 * explícitas. O Mermaid não desenha Chen (losango de relacionamento, elipse de
 * atributo, retângulo duplo de entidade fraca), então o desenho é autoral.
 *
 * Uso:
 *   <chen-diagram legenda="Cliente faz Pedido" viewbox="0 0 820 300">
 *     <script type="application/json">
 *     {
 *       "descricao": "Retângulo CLIENTE ligado pelo losango FAZ ao retângulo PEDIDO...",
 *       "formas": [
 *         { "tipo": "entidade", "x": 120, "y": 150, "rotulo": "CLIENTE" },
 *         { "tipo": "relacionamento", "x": 400, "y": 150, "rotulo": "FAZ" },
 *         { "tipo": "entidade", "x": 690, "y": 150, "rotulo": "PEDIDO" },
 *         { "tipo": "linha", "de": [200, 150], "para": [330, 150], "card": "1" },
 *         { "tipo": "linha", "de": [470, 150], "para": [610, 150], "card": "N", "total": true }
 *       ]
 *     }
 *     </script>
 *   </chen-diagram>
 *
 * Todas as coordenadas são o CENTRO da forma. Tipos aceitos:
 *   entidade | entidade-fraca | relacionamento | relacionamento-identificador
 *   atributo (chave, derivado, multivalorado) | especializacao | linha | texto
 */

import { escapar } from '../util.js';

const PADRAO = {
  entidade: { w: 160, h: 56 },
  'entidade-fraca': { w: 168, h: 62 },
  relacionamento: { w: 150, h: 76 },
  'relacionamento-identificador': { w: 162, h: 88 },
  atributo: { rx: 74, ry: 25 }
};

/** Quebra o rótulo em linhas por "\n" e devolve os <tspan> centralizados. */
function texto(rotulo, x, y, classe, extra) {
  const linhas = String(rotulo).split('\n');
  const alturaLinha = 15;
  const topo = y - ((linhas.length - 1) * alturaLinha) / 2;
  const tspans = linhas
    .map((linha, i) => `<tspan x="${x}" y="${topo + i * alturaLinha}">${escapar(linha)}</tspan>`)
    .join('');
  return `<text class="${classe}"${extra || ''}>${tspans}</text>`;
}

function losango(x, y, w, h, classe) {
  const pontos = [
    [x, y - h / 2],
    [x + w / 2, y],
    [x, y + h / 2],
    [x - w / 2, y]
  ]
    .map((p) => p.join(','))
    .join(' ');
  return `<polygon class="${classe}" points="${pontos}" />`;
}

function desenharForma(f) {
  const x = Number(f.x) || 0;
  const y = Number(f.y) || 0;

  switch (f.tipo) {
    case 'entidade': {
      const w = f.w || PADRAO.entidade.w;
      const h = f.h || PADRAO.entidade.h;
      return (
        `<rect class="chen-entidade" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" />` +
        texto(f.rotulo, x, y, 'chen-rotulo-ent')
      );
    }
    case 'entidade-fraca': {
      const w = f.w || PADRAO['entidade-fraca'].w;
      const h = f.h || PADRAO['entidade-fraca'].h;
      return (
        `<rect class="chen-entidade" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" />` +
        `<rect class="chen-entidade" x="${x - w / 2 + 6}" y="${y - h / 2 + 6}" width="${w - 12}" height="${h - 12}" rx="2" fill="none" />` +
        texto(f.rotulo, x, y, 'chen-rotulo-ent')
      );
    }
    case 'relacionamento': {
      const w = f.w || PADRAO.relacionamento.w;
      const h = f.h || PADRAO.relacionamento.h;
      return losango(x, y, w, h, 'chen-rel') + texto(f.rotulo, x, y, 'chen-rotulo-rel');
    }
    case 'relacionamento-identificador': {
      const w = f.w || PADRAO['relacionamento-identificador'].w;
      const h = f.h || PADRAO['relacionamento-identificador'].h;
      return (
        losango(x, y, w, h, 'chen-rel') +
        losango(x, y, w - 16, h - 16, 'chen-rel') +
        texto(f.rotulo, x, y, 'chen-rotulo-rel')
      );
    }
    case 'atributo': {
      const rx = f.rx || PADRAO.atributo.rx;
      const ry = f.ry || PADRAO.atributo.ry;
      const classe = f.derivado ? 'chen-attr-deriv' : 'chen-attr';
      let svg = `<ellipse class="${classe}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" />`;
      if (f.multivalorado) {
        svg += `<ellipse class="${classe}" cx="${x}" cy="${y}" rx="${rx - 6}" ry="${ry - 6}" fill="none" />`;
      }
      // atributo-chave aparece sublinhado, como manda a notação
      const classeTexto = f.chave ? 'chen-rotulo-attr chen-attr-chave' : 'chen-rotulo-attr';
      svg += texto(f.rotulo, x, y, classeTexto);
      return svg;
    }
    case 'especializacao': {
      const r = f.r || 18;
      return (
        `<circle class="chen-rel" cx="${x}" cy="${y}" r="${r}" />` +
        texto(f.rotulo || 'd', x, y, 'chen-rotulo-rel')
      );
    }
    case 'linha': {
      const de = f.de || [0, 0];
      const para = f.para || [0, 0];
      const classe = f.total ? 'chen-linha-total' : 'chen-linha';
      const pontos = f.pontos || [de, para];
      const d = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
      let svg = `<path class="${classe}" d="${d}" />`;
      if (f.card) {
        const meio = f.cardXY || [
          (pontos[0][0] + pontos[pontos.length - 1][0]) / 2,
          (pontos[0][1] + pontos[pontos.length - 1][1]) / 2 - 12
        ];
        svg += texto(f.card, meio[0], meio[1], 'chen-card');
      }
      return svg;
    }
    case 'texto':
      return texto(f.rotulo, x, y, f.classe || 'chen-rotulo-attr');
    default:
      return '';
  }
}

class ChenDiagram extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    if (!this.querySelector('script') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    const fonte = this.querySelector('script[type="application/json"]');
    let dados;
    try {
      dados = JSON.parse(fonte ? fonte.textContent : '{}');
    } catch {
      this.innerHTML = '<div class="uc-diagrama"><div class="uc-diagrama__erro">chen-diagram: JSON inválido</div></div>';
      return;
    }

    const viewbox = this.getAttribute('viewbox') || dados.viewbox || '0 0 900 340';
    const legenda = this.getAttribute('legenda') || dados.legenda || '';
    const descricao = dados.descricao || this.getAttribute('descricao') || '';
    const formas = Array.isArray(dados.formas) ? dados.formas : [];

    // linhas primeiro para ficarem sob as formas
    const ordenadas = [
      ...formas.filter((f) => f.tipo === 'linha'),
      ...formas.filter((f) => f.tipo !== 'linha')
    ];

    const corpo = ordenadas.map(desenharForma).join('');
    const rotuloAcessivel = descricao || legenda || 'Diagrama entidade-relacionamento em notação de Chen';

    this.innerHTML =
      '<figure class="uc-diagrama">' +
      '<div class="uc-diagrama__palco">' +
      `<svg class="uc-chen" viewBox="${escapar(viewbox)}" role="img" aria-label="${escapar(rotuloAcessivel)}" preserveAspectRatio="xMidYMid meet" style="width:100%;max-width:${escapar(String(dados.larguraMax || 900))}px">` +
      `<title>${escapar(legenda || 'Diagrama em notação de Chen')}</title>` +
      corpo +
      '</svg>' +
      '</div>' +
      (legenda || descricao
        ? '<figcaption class="uc-diagrama__legenda">' +
          (legenda ? `<b>Figura.</b> ${escapar(legenda)}` : '') +
          (descricao
            ? `<details class="uc-diagrama__descricao"><summary>Descrição textual do diagrama</summary><p>${escapar(descricao)}</p></details>`
            : '') +
          '</figcaption>'
        : '') +
      '</figure>';
  }
}

if (!customElements.get('chen-diagram')) {
  customElements.define('chen-diagram', ChenDiagram);
}

export { ChenDiagram };
