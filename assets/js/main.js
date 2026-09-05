/**
 * main.js — único módulo referenciado pelas páginas.
 *
 * Importa os web components (que se registram sozinhos), aplica o tema,
 * monta o layout a partir de data/aulas.js e liga a busca.
 *
 * Carregue com <script type="module" src="../assets/js/main.js"></script>.
 * Módulos ES são adiados por padrão, então o DOM já existe quando este código
 * roda — os componentes encontram seus filhos e o layout encontra os pontos
 * de montagem.
 */

import './components/sql-terminal.js';
import './components/result-set.js';
import './components/er-diagram.js';
import './components/chen-diagram.js';
import './components/mao-na-massa.js';
import './components/checklist-aula.js';
import './components/quiz-aula.js';

import { iniciarTema } from './tema.js';
import { montarLayout } from './layout.js';
import { iniciarBusca } from './busca.js';
import { aoCarregarDom } from './util.js';

aoCarregarDom(() => {
  iniciarTema();
  montarLayout();
  iniciarBusca();
  document.body.dataset.pronto = '1';
});
