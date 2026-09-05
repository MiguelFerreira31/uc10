/**
 * <checklist-aula> — "consigo fazer isto sem consultar", persistido no
 * localStorage por aula.
 *
 * Uso:
 *   <checklist-aula id="checklist" chave="aula-01">
 *     <script type="application/json">
 *     ["Instalar o SQL Server 2022 Express", "Conectar pelo sqlcmd"]
 *     </script>
 *   </checklist-aula>
 *
 * A chave padrão é o slug da própria página.
 */

import { escapar, lerArmazenado, gravarArmazenado, slugDaPagina } from '../util.js';

const PREFIXO = 'uc10:checklist:';

class ChecklistAula extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    if (!this.querySelector('script') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    const fonte = this.querySelector('script[type="application/json"]');
    let itens = [];
    try {
      itens = JSON.parse(fonte ? fonte.textContent : '[]');
    } catch {
      itens = [];
    }
    if (!Array.isArray(itens) || !itens.length) {
      this.innerHTML = '';
      return;
    }

    this.chave = PREFIXO + (this.getAttribute('chave') || slugDaPagina());
    const marcados = lerArmazenado(this.chave, []);
    const titulo = this.getAttribute('titulo') || 'Consigo fazer isto sem consultar';
    const sub =
      this.getAttribute('sub') ||
      'Marque só o que você conseguiria repetir agora, na sua instância, sem olhar o material.';

    const li = itens
      .map((item, i) => {
        const id = `${this.chave.replace(/[^a-z0-9]+/gi, '-')}-${i}`;
        const marcado = marcados.includes(i) ? ' checked' : '';
        return (
          `<li><label for="${id}">` +
          `<input type="checkbox" id="${id}" data-indice="${i}"${marcado}>` +
          `<span>${escapar(item)}</span>` +
          '</label></li>'
        );
      })
      .join('');

    this.innerHTML =
      '<section class="uc-checklist">' +
      `<h2 class="uc-checklist__titulo">${escapar(titulo)}</h2>` +
      `<p class="uc-checklist__sub">${escapar(sub)}</p>` +
      `<ul>${li}</ul>` +
      '<p class="uc-checklist__status" role="status"></p>' +
      '</section>';

    this.total = itens.length;
    this.addEventListener('change', (ev) => {
      const alvo = ev.target;
      if (!(alvo instanceof HTMLInputElement) || alvo.type !== 'checkbox') return;
      this.salvar();
    });
    this.atualizarStatus();
  }

  salvar() {
    const marcados = Array.from(this.querySelectorAll('input[type="checkbox"]'))
      .filter((i) => i.checked)
      .map((i) => Number(i.dataset.indice));
    gravarArmazenado(this.chave, marcados);
    this.atualizarStatus();
  }

  atualizarStatus() {
    const feitos = this.querySelectorAll('input[type="checkbox"]:checked').length;
    const status = this.querySelector('.uc-checklist__status');
    if (!status) return;
    status.textContent =
      feitos === this.total
        ? `${feitos} de ${this.total} — checklist completo.`
        : `${feitos} de ${this.total} marcados.`;
  }
}

if (!customElements.get('checklist-aula')) {
  customElements.define('checklist-aula', ChecklistAula);
}

export { ChecklistAula };
