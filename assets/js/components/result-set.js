/**
 * <result-set> — grade de resultado no formato exato do sqlcmd.
 *
 * Cabeçalho, linha de hífens do tamanho da coluna, linhas e o rodapé
 * "(N rows affected)". Numéricos alinhados à direita, NULL em itálico.
 *
 * Uso:
 *   <result-set legenda="clientes cadastrados">
 *     <script type="application/json">
 *     {
 *       "colunas": [
 *         { "nome": "id_cliente", "tipo": "num" },
 *         { "nome": "nm_cliente", "tipo": "texto", "largura": 20 }
 *       ],
 *       "linhas": [[1, "Ana Prado"], [2, null]],
 *       "afetadas": 2
 *     }
 *     </script>
 *   </result-set>
 *
 * "tipo": "num" alinha à direita; qualquer outro valor alinha à esquerda.
 * "largura" força a largura da coluna (como o tipo declarado faria no sqlcmd);
 * sem ela, a largura é o maior conteúdo da coluna.
 * "afetadas" ausente = usa a quantidade de linhas.
 */

import { escapar } from '../util.js';

const NULO = 'NULL';

function textoCelula(valor) {
  if (valor === null || valor === undefined) return NULO;
  return String(valor);
}

function preencher(texto, largura, direita) {
  if (texto.length >= largura) return texto;
  const espacos = ' '.repeat(largura - texto.length);
  return direita ? espacos + texto : texto + espacos;
}

class ResultSet extends HTMLElement {
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
    } catch (erro) {
      this.innerHTML = '<div class="uc-rs"><div class="uc-rs__legenda">result-set: JSON inválido</div></div>';
      return;
    }

    const colunas = Array.isArray(dados.colunas) ? dados.colunas : [];
    const linhas = Array.isArray(dados.linhas) ? dados.linhas : [];
    if (!colunas.length) {
      this.innerHTML = '<div class="uc-rs"><div class="uc-rs__legenda">result-set: sem colunas</div></div>';
      return;
    }

    const larguras = colunas.map((col, i) => {
      if (Number.isInteger(col.largura) && col.largura > 0) return col.largura;
      const maiorDado = linhas.reduce((max, linha) => Math.max(max, textoCelula(linha[i]).length), 0);
      return Math.max(col.nome.length, maiorDado);
    });

    const cabecalho = colunas.map((col, i) => preencher(col.nome, larguras[i], false)).join(' ');
    const separador = larguras.map((l) => '-'.repeat(l)).join(' ');

    const corpo = linhas
      .map((linha) =>
        colunas
          .map((col, i) => {
            const bruto = textoCelula(linha[i]);
            const direita = col.tipo === 'num';
            const preenchido = preencher(bruto, larguras[i], direita);
            if (linha[i] === null || linha[i] === undefined) {
              // mantém o alinhamento e marca visualmente o NULL
              const antes = preenchido.slice(0, preenchido.indexOf(NULO));
              const depois = preenchido.slice(preenchido.indexOf(NULO) + NULO.length);
              return `${antes}<span class="uc-out-null">${NULO}</span>${depois}`;
            }
            return escapar(preenchido);
          })
          .join(' ')
      )
      .join('\n');

    const afetadas = Number.isInteger(dados.afetadas) ? dados.afetadas : linhas.length;
    const rodape = `(${afetadas} row${afetadas === 1 ? '' : 's'} affected)`;
    const legenda = this.getAttribute('legenda');

    const grade = [
      `<span class="uc-out-head">${escapar(cabecalho)}</span>`,
      `<span class="uc-out-sep">${escapar(separador)}</span>`,
      corpo,
      '',
      `<span class="uc-out-rows">${escapar(rodape)}</span>`
    ]
      .filter((parte, i) => !(parte === '' && i !== 3))
      .join('\n');

    this.innerHTML =
      '<div class="uc-rs">' +
      (legenda ? `<div class="uc-rs__legenda">${escapar(legenda)}</div>` : '') +
      `<pre class="uc-rs__grid" tabindex="0">${grade}</pre>` +
      '</div>';
  }
}

if (!customElements.get('result-set')) {
  customElements.define('result-set', ResultSet);
}

export { ResultSet };
