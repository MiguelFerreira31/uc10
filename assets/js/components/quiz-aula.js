/**
 * <quiz-aula> — 5 questões de múltipla escolha com feedback explicativo POR
 * ALTERNATIVA. Ao responder, o aluno vê por que a escolhida está certa ou
 * errada e por que cada uma das outras está certa ou errada.
 *
 * Uso:
 *   <quiz-aula id="quiz" chave="aula-01">
 *     <script type="application/json">
 *     [
 *       {
 *         "pergunta": "Qual comando mostra a versão do SQL Server?",
 *         "alternativas": [
 *           { "texto": "SELECT @@VERSION;", "certa": true,  "feedback": "Explicação..." },
 *           { "texto": "SHOW VERSION;",     "certa": false, "feedback": "Explicação..." }
 *         ]
 *       }
 *     ]
 *     </script>
 *   </quiz-aula>
 */

import { escapar, lerArmazenado, gravarArmazenado, slugDaPagina } from '../util.js';

const PREFIXO = 'uc10:quiz:';
const LETRAS = ['a', 'b', 'c', 'd', 'e'];

class QuizAula extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    if (!this.querySelector('script') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    const fonte = this.querySelector('script[type="application/json"]');
    let questoes = [];
    try {
      questoes = JSON.parse(fonte ? fonte.textContent : '[]');
    } catch {
      questoes = [];
    }
    if (!Array.isArray(questoes) || !questoes.length) {
      this.innerHTML = '';
      return;
    }

    this.questoes = questoes;
    this.chave = PREFIXO + (this.getAttribute('chave') || slugDaPagina());
    this.respostas = lerArmazenado(this.chave, {});
    const titulo = this.getAttribute('titulo') || 'Quiz de fixação';

    const html = questoes
      .map((q, iq) => {
        const alternativas = (q.alternativas || [])
          .map(
            (alt, ia) =>
              `<div class="uc-alt" data-questao="${iq}" data-alt="${ia}">` +
              `<button type="button"><span class="uc-alt__letra">${LETRAS[ia] || ia + 1})</span><span>${escapar(alt.texto)}</span></button>` +
              `<div class="uc-alt__feedback">${escapar(alt.feedback || '')}</div>` +
              '</div>'
          )
          .join('');
        return (
          `<fieldset class="uc-questao" data-questao="${iq}">` +
          `<legend class="uc-questao__enunciado"><span class="uc-qnum">${String(iq + 1).padStart(2, '0')}.</span>${escapar(q.pergunta)}</legend>` +
          alternativas +
          '</fieldset>'
        );
      })
      .join('');

    this.innerHTML =
      '<section class="uc-quiz">' +
      `<div class="uc-quiz__cabecalho"><h2>${escapar(titulo)}</h2></div>` +
      html +
      '<div class="uc-quiz__placar" role="status"></div>' +
      '</section>';

    this.addEventListener('click', (ev) => {
      const botao = ev.target.closest('.uc-alt > button');
      if (!botao) return;
      const alt = botao.parentElement;
      const iq = Number(alt.dataset.questao);
      if (this.respostas[iq] !== undefined) return; // já respondida
      this.respostas[iq] = Number(alt.dataset.alt);
      gravarArmazenado(this.chave, this.respostas);
      this.revelar(iq);
      this.atualizarPlacar();
    });

    Object.keys(this.respostas).forEach((iq) => this.revelar(Number(iq)));
    this.atualizarPlacar();
  }

  /** Revela o feedback de todas as alternativas da questão e trava os botões. */
  revelar(iq) {
    const escolhida = this.respostas[iq];
    const questao = this.questoes[iq];
    if (!questao) return;
    const alts = this.querySelectorAll(`.uc-alt[data-questao="${iq}"]`);
    alts.forEach((alt) => {
      const ia = Number(alt.dataset.alt);
      const dados = questao.alternativas[ia] || {};
      if (dados.certa) alt.dataset.estado = 'certa';
      else if (ia === escolhida) alt.dataset.estado = 'errada';
      else alt.dataset.estado = 'neutro';
      const botao = alt.querySelector('button');
      botao.disabled = true;
      if (ia === escolhida) {
        botao.setAttribute('aria-pressed', 'true');
      }
    });
  }

  atualizarPlacar() {
    const respondidas = Object.keys(this.respostas).length;
    const acertos = Object.entries(this.respostas).filter(([iq, ia]) => {
      const q = this.questoes[Number(iq)];
      return q && q.alternativas[ia] && q.alternativas[ia].certa;
    }).length;
    const placar = this.querySelector('.uc-quiz__placar');
    if (!placar) return;
    if (!respondidas) {
      placar.textContent = `0 de ${this.questoes.length} respondidas. Escolha uma alternativa para ver o comentário de cada uma.`;
      return;
    }
    placar.innerHTML =
      `${acertos} acerto${acertos === 1 ? '' : 's'} em ${respondidas} respondida${respondidas === 1 ? '' : 's'} ` +
      `(total: ${this.questoes.length}). ` +
      '<button type="button" class="btn btn-sm btn-outline-secondary ms-2" data-acao="refazer">refazer</button>';
    const refazer = placar.querySelector('[data-acao="refazer"]');
    refazer.addEventListener('click', () => this.refazer());
  }

  refazer() {
    this.respostas = {};
    gravarArmazenado(this.chave, this.respostas);
    this.querySelectorAll('.uc-alt').forEach((alt) => {
      delete alt.dataset.estado;
      const b = alt.querySelector('button');
      b.disabled = false;
      b.removeAttribute('aria-pressed');
    });
    this.atualizarPlacar();
  }
}

if (!customElements.get('quiz-aula')) {
  customElements.define('quiz-aula', QuizAula);
}

export { QuizAula };
