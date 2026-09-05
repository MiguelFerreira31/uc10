/**
 * <mao-na-massa> + <exercicio-item> — bloco de exercícios progressivos.
 *
 * Uso:
 *   <mao-na-massa id="mao-na-massa" sub="Faça na sua instância, não copie e cole.">
 *     <exercicio-item nivel="aquecimento" titulo="Descobrir a versão instalada">
 *       <p>Enunciado...</p>
 *       <sql-terminal saida-oculta> ... </sql-terminal>
 *       <details class="uc-gabarito"><summary>Ver gabarito</summary> ... </details>
 *     </exercicio-item>
 *   </mao-na-massa>
 *
 * O componente só decora: os filhos são preservados e reposicionados, nunca
 * reescritos — assim os terminais e diagramas de dentro continuam válidos.
 */

import { escapar } from '../util.js';

class ExercicioItem extends HTMLElement {
  /** A numeração e o cabeçalho são aplicados pelo <mao-na-massa> que contém o item. */
  decorar(numero) {
    if (this.dataset.pronto === '1') return;
    this.dataset.pronto = '1';
    this.classList.add('uc-ex');

    const titulo = this.getAttribute('titulo') || '';
    const nivel = this.getAttribute('nivel') || '';

    const cabecalho = document.createElement('div');
    cabecalho.innerHTML =
      `<span class="uc-ex__num">Exercício ${String(numero).padStart(2, '0')}</span>` +
      (nivel ? `<span class="uc-ex__nivel">${escapar(nivel)}</span>` : '');

    const corpo = document.createElement('div');
    corpo.className = 'uc-ex__enunciado';
    while (this.firstChild) corpo.appendChild(this.firstChild);

    if (titulo) {
      const h = document.createElement('h4');
      h.textContent = titulo;
      h.style.marginTop = '0.25rem';
      corpo.insertBefore(h, corpo.firstChild);
    }

    this.appendChild(cabecalho);
    this.appendChild(corpo);
  }
}

class MaoNaMassa extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    if (!this.querySelector('exercicio-item') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    const titulo = this.getAttribute('titulo') || 'Mão na massa';
    const sub = this.getAttribute('sub') || '';
    const itens = Array.from(this.querySelectorAll(':scope > exercicio-item'));

    const secao = document.createElement('section');
    secao.className = 'uc-mnm';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'uc-mnm__cabecalho';
    cabecalho.innerHTML =
      `<h2>${escapar(titulo)}</h2>` + (sub ? `<div class="uc-mnm__sub">${escapar(sub)}</div>` : '');
    secao.appendChild(cabecalho);

    itens.forEach((item, i) => {
      if (typeof item.decorar === 'function') {
        item.decorar(i + 1);
      }
      secao.appendChild(item);
    });

    // sobras que não são exercicio-item (parágrafo introdutório, por exemplo)
    while (this.firstChild) {
      const nodo = this.firstChild;
      this.removeChild(nodo);
      if (nodo.nodeType === Node.ELEMENT_NODE || (nodo.textContent || '').trim()) {
        cabecalho.appendChild(nodo);
      }
    }

    this.appendChild(secao);
  }
}

if (!customElements.get('exercicio-item')) {
  customElements.define('exercicio-item', ExercicioItem);
}
if (!customElements.get('mao-na-massa')) {
  customElements.define('mao-na-massa', MaoNaMassa);
}

export { MaoNaMassa, ExercicioItem };
