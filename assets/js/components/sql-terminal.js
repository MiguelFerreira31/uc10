/**
 * <sql-terminal> — emulador de sessão sqlcmd / painel de query do SSMS.
 *
 * Uso:
 *   <sql-terminal banco="BELLAMASSA" titulo="criação da tabela cliente">
 *     <script type="text/plain" slot="sql">SELECT 1;
 *   GO</script>
 *     <script type="text/plain" slot="saida">Commands completed successfully.</script>
 *   </sql-terminal>
 *
 * Atributos:
 *   banco        nome do banco exibido no badge do chrome
 *   titulo       título da janela
 *   modo         sqlcmd (padrão) | ssms | shell | arquivo
 *   variant      padrao (padrão) | erro
 *   lang         tsql (padrão) | bash | java | json | xml
 *   prompt       prompt do modo shell (padrão: PS C:\>)
 *   saida-oculta presente = a saída só aparece depois do clique
 *
 * Light DOM de propósito: Bootstrap, highlight.js e o CSS global precisam
 * alcançar o conteúdo.
 */

import { lerSlot, escapar, observarCorte, copiar } from '../util.js';
import { realcarSql, realcarOutra } from '../hljs-tsql.js';

let sequencia = 0;

/** Monta a calha de prompts do sqlcmd, reiniciando a numeração após cada GO. */
function calhaSqlcmd(linhas) {
  let n = 1;
  return linhas
    .map((linha) => {
      const rotulo = `${n}>`;
      if (/^\s*GO\s*$/i.test(linha)) {
        n = 1;
      } else {
        n += 1;
      }
      return rotulo;
    })
    .join('\n');
}

/** Calha com numeração simples de linhas (SSMS e arquivos). */
function calhaNumeros(linhas) {
  return linhas.map((_, i) => String(i + 1)).join('\n');
}

/** Calha de prompt fixo (shell). */
function calhaShell(linhas, prompt) {
  return linhas.map((l) => (l.trim() === '' ? '' : prompt)).join('\n');
}

/**
 * Colore a saída do SQL Server por linha: mensagens de erro, grade de
 * resultado, rodapé de linhas afetadas e avisos.
 */
function realcarSaida(texto) {
  const linhas = texto.split('\n');
  const classes = new Array(linhas.length).fill('');
  let dentroDeErro = false;

  linhas.forEach((linha, i) => {
    const t = linha.trim();
    if (/^Msg \d+, Level \d+, State \d+/.test(t)) {
      classes[i] = 'uc-out-msg';
      dentroDeErro = true;
      return;
    }
    if (dentroDeErro) {
      if (t === '') {
        dentroDeErro = false;
      } else {
        classes[i] = 'uc-out-msg';
        return;
      }
    }
    if (/^\(\d+ rows? affected\)$/.test(t) || /^\(\d+ linhas? afetadas?\)$/.test(t)) {
      classes[i] = 'uc-out-rows';
      return;
    }
    if (/^-+(\s+-+)*$/.test(t) && t.length > 2) {
      classes[i] = 'uc-out-sep';
      if (i > 0 && classes[i - 1] === '') classes[i - 1] = 'uc-out-head';
      return;
    }
    if (/^Warning:/i.test(t) || /^Aviso:/i.test(t)) {
      classes[i] = 'uc-out-warn';
      return;
    }
    if (
      /Commands completed successfully/i.test(t) ||
      /Changed database context/i.test(t) ||
      /successfully processed/i.test(t) ||
      /BACKUP DATABASE successfully/i.test(t)
    ) {
      classes[i] = 'uc-out-ok';
    }
  });

  return linhas
    .map((linha, i) => (classes[i] ? `<span class="${classes[i]}">${escapar(linha)}</span>` : escapar(linha)))
    .join('\n');
}

class SqlTerminal extends HTMLElement {
  connectedCallback() {
    if (this.dataset.pronto === '1') return;
    // Durante o parse do HTML o callback dispara antes de os filhos existirem.
    if (!this.querySelector('script[slot]') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.connectedCallback(), { once: true });
      return;
    }
    this.dataset.pronto = '1';

    const sql = lerSlot(this, 'sql');
    const saida = lerSlot(this, 'saida');
    const modo = this.getAttribute('modo') || 'sqlcmd';
    const variant = this.getAttribute('variant') || 'padrao';
    const banco = this.getAttribute('banco') || '';
    const lang = this.getAttribute('lang') || (modo === 'shell' ? 'bash' : 'tsql');
    const prompt = this.getAttribute('prompt') || 'PS C:\\>';
    const oculta = this.hasAttribute('saida-oculta');
    const id = `term-${++sequencia}`;

    const titulo =
      this.getAttribute('titulo') ||
      (modo === 'ssms' ? 'SSMS — nova consulta' : modo === 'shell' ? 'PowerShell' : 'sqlcmd');
    const tituloCompleto = modo === 'sqlcmd' && banco ? `sqlcmd — ${titulo}` : titulo;

    const linhas = sql.split('\n');
    let calha;
    if (modo === 'sqlcmd') calha = calhaSqlcmd(linhas);
    else if (modo === 'shell') calha = calhaShell(linhas, prompt);
    else calha = calhaNumeros(linhas);

    const partes = [];
    partes.push(`<figure class="uc-term uc-term--${modo} ${variant === 'erro' ? 'uc-term--erro' : ''}" role="group" aria-labelledby="${id}-t">`);
    partes.push('<figcaption class="uc-term__chrome">');
    partes.push('<span class="uc-term__dots" aria-hidden="true"><i></i><i></i><i></i></span>');
    partes.push(`<span class="uc-term__titulo" id="${id}-t">${escapar(tituloCompleto)}</span>`);
    if (banco) partes.push(`<span class="uc-term__banco" title="Banco ativo">${escapar(banco)}</span>`);
    partes.push(
      `<button type="button" class="uc-term__copiar" data-acao="copiar" aria-label="Copiar apenas o comando, sem prompts nem saída">copiar</button>`
    );
    partes.push('</figcaption>');
    partes.push('<div class="uc-term__area">');
    partes.push(`<pre class="uc-term__gutter" aria-hidden="true">${escapar(calha)}</pre>`);
    partes.push(`<pre class="uc-term__code" tabindex="0"><code>${escapar(sql)}</code></pre>`);
    partes.push('</div>');

    if (saida) {
      if (oculta) {
        partes.push(
          `<button type="button" class="uc-term__revelar" data-acao="revelar" aria-expanded="false" aria-controls="${id}-s">mostrar a saída esperada</button>`
        );
        partes.push(`<div class="uc-term__saida" id="${id}-s" hidden>`);
      } else {
        partes.push(`<div class="uc-term__saida" id="${id}-s">`);
      }
      partes.push('<span class="uc-term__rotulo">saída</span>');
      partes.push(`<pre tabindex="0">${realcarSaida(saida)}</pre>`);
      partes.push('</div>');
    }
    partes.push('</figure>');

    this.innerHTML = partes.join('');

    const codigo = this.querySelector('.uc-term__code code');
    const rolavel = this.querySelector('.uc-term__code');
    const figura = this.querySelector('.uc-term');

    const realce = lang === 'tsql' ? realcarSql(sql) : realcarOutra(sql, lang);
    realce.then((html) => {
      codigo.innerHTML = html;
    });

    observarCorte(figura, rolavel);

    const btnCopiar = this.querySelector('[data-acao="copiar"]');
    btnCopiar.addEventListener('click', async () => {
      const ok = await copiar(sql);
      btnCopiar.textContent = ok ? 'copiado' : 'falhou';
      btnCopiar.dataset.copiado = ok ? '1' : '0';
      window.setTimeout(() => {
        btnCopiar.textContent = 'copiar';
        delete btnCopiar.dataset.copiado;
      }, 1800);
    });

    const btnRevelar = this.querySelector('[data-acao="revelar"]');
    if (btnRevelar) {
      const painel = this.querySelector('.uc-term__saida');
      btnRevelar.addEventListener('click', () => {
        const visivel = !painel.hidden;
        painel.hidden = visivel;
        btnRevelar.setAttribute('aria-expanded', String(!visivel));
        btnRevelar.textContent = visivel ? 'mostrar a saída esperada' : 'ocultar a saída';
      });
    }
  }
}

if (!customElements.get('sql-terminal')) {
  customElements.define('sql-terminal', SqlTerminal);
}

export { SqlTerminal };
