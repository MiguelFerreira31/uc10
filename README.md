# UC10 · Desenvolver banco de dados

Site didático da unidade curricular **UC10 — Desenvolver banco de dados**
(Habilitação Profissional Técnica em Informática, SENAC · 72 horas · 24 encontros de 3h).

SGBD alvo: **Microsoft SQL Server 2022 Express** com **SSMS 20**, em T-SQL.
Estudo de caso único do início ao fim: **Pizzaria Bella Massa** (delivery + salão).

---

## Como rodar

O site é **HTML, CSS e JavaScript puro**. Não existe build, não existe `npm install`,
não existe bundler. O repositório é servido exatamente como está.

```bash
# na raiz do repositório
python3 -m http.server 8000
# depois abra http://localhost:8000/
```

No Windows, `python -m http.server 8000`. Qualquer servidor estático serve
(`npx serve`, extensão Live Server do VS Code, `php -S localhost:8000`).

> **Por que não abrir o `index.html` com duplo clique?**
> Abre e funciona quase tudo — o site não usa `fetch()` de fragmentos locais justamente
> para sobreviver a `file://`. Mas os módulos ES são bloqueados por CORS em `file://`
> em alguns navegadores, então um servidor estático é o caminho seguro.

### GitHub Pages

Publique com *Settings → Pages → Deploy from a branch → main / (root)*.
O site roda em `https://<usuario>.github.io/<repo>/`.

Dois detalhes que mantêm isso funcionando e que **não devem ser quebrados**:

- O arquivo **`.nojekyll`** na raiz. Sem ele o Jekyll reprocessa o HTML e ignora
  diretórios iniciados por `_`.
- **Todos os caminhos são relativos** (`../assets/css/theme.css`), nunca com barra
  inicial. Um único `/assets/...` quebra o site inteiro em *project page*.
  O JavaScript resolve caminhos a partir de `import.meta.url`, o que funciona na raiz
  do domínio, em subdiretório e em `file://`.

---

## Estrutura

```
/
├── .nojekyll                  # obrigatório para o GitHub Pages
├── index.html                 # trilha completa: 4 módulos, 24 aulas, progresso
├── template-aula.html         # esqueleto comentado para criar novas aulas
├── aulas/aula-NN.html         # uma página por encontro
├── assets/
│   ├── css/
│   │   ├── theme.css          # tokens, tipografia e ajustes sobre o Bootstrap
│   │   ├── terminal.css       # design system do <sql-terminal> e do <result-set>
│   │   └── didatico.css       # passo, alerta, erro comum, checklist, quiz, diagramas
│   └── js/
│       ├── data/aulas.js      # FONTE ÚNICA da trilha
│       ├── components/        # web components nativos
│       ├── layout.js          # injeta navbar, sidebar, breadcrumb, prev/next, rodapé
│       ├── progresso.js       # aulas concluídas no localStorage
│       ├── tema.js            # alternância escuro/claro
│       ├── busca.js           # filtro client-side sobre o índice derivado
│       ├── hljs-tsql.js       # gramática T-SQL para o highlight.js
│       ├── util.js            # funções compartilhadas
│       └── main.js            # ponto de entrada de todas as páginas
├── scripts/                   # .sql baixáveis, um por aula
├── seeds/                     # dataset da pizzaria em .sql e .csv
└── diagramas/                 # SVGs exportáveis do MER e do DER
```

### Dependências (todas por CDN, versão fixada)

| Biblioteca | Versão | Uso |
|---|---|---|
| Bootstrap | 5.3.3 | grid, offcanvas, accordion, cards, badges, botões |
| Bootstrap Icons | 1.11.3 | ícones |
| highlight.js | 11.9.0 | realce de sintaxe, com gramática `tsql` registrada localmente |
| Mermaid | 11.4.1 | diagramas `erDiagram` em pé-de-galinha |
| Inter + JetBrains Mono | Google Fonts | texto e monoespaçada |

Se algum CDN cair, o site continua legível: o SQL aparece sem cor e cada diagrama
Mermaid mostra o próprio código-fonte com instrução de onde colar.

---

## Arquitetura sem build

### 1. Fonte única da trilha

`assets/js/data/aulas.js` exporta `AULAS`, `MODULOS`, `INDICADORES` e `PAGINAS`.
Dali saem **sidebar, index, breadcrumb, cabeçalho da aula, pré-requisitos, prev/next,
barra de progresso, bloco de download do script e índice de busca**.
Nenhuma dessas listas é escrita à mão duas vezes.

O conjunto `PUBLICADAS`, dentro desse arquivo, controla quais aulas já têm HTML.
As demais aparecem na navegação como texto inerte marcado *em breve* — nunca como
link quebrado. Publicar uma aula é acrescentar o slug a esse conjunto.

### 2. Web components nativos

Cada bloco didático é um custom element autoral, em **Light DOM** (para que Bootstrap,
highlight.js e o CSS global alcancem o conteúdo):

| Elemento | Para quê |
|---|---|
| `<sql-terminal>` | sessão `sqlcmd`/SSMS com prompts, botão copiar e saída do servidor |
| `<result-set>` | grade de resultado no formato exato do sqlcmd |
| `<er-diagram>` | diagrama pé-de-galinha via Mermaid |
| `<chen-diagram>` | notação de Chen em SVG, com coordenadas explícitas |
| `<mao-na-massa>` + `<exercicio-item>` | exercícios progressivos com gabarito colapsado |
| `<checklist-aula>` | checklist persistido em `localStorage` |
| `<quiz-aula>` | quiz com feedback explicativo por alternativa |

O conteúdo bruto entra em `<script type="text/plain">` ou
`<script type="application/json">`: preserva indentação e evita escapar `<`, `>` e `&`
em todo o SQL.

> **Atenção:** dentro de um `<script>`, entidades HTML **não** são decodificadas.
> Escreva `<X64>` e `1>` literalmente; `&lt;X64&gt;` apareceria cru na tela.

### 3. Layout injetado

Cada página traz apenas o miolo e cinco pontos de montagem vazios:
`#app-navbar`, `#app-sidebar`, `#app-breadcrumb`, `#app-prevnext`, `#app-rodape`
(e, nas aulas, `#app-cabecalho` e `#app-script`).
`layout.js` preenche todos a partir de `aulas.js`, lendo o slug do nome do arquivo.

---

## Como criar uma aula

1. Copie `template-aula.html` para `aulas/aula-NN.html`.
2. Ajuste `<title>` e `<meta name="description">`.
3. Escreva o miolo dentro de `<article>`, respeitando as **11 seções obrigatórias**:
   cabeçalho, objetivos, problematização, pré-requisitos, conteúdo, mão na massa,
   erros comuns, checklist, quiz, script baixável, navegação.
   Cabeçalho, pré-requisitos, script e navegação são injetados — você escreve os outros.
4. Complete a entrada da aula em `assets/js/data/aulas.js` e acrescente o slug a
   `PUBLICADAS`.
5. Se a aula tiver script, crie `scripts/NN-nome.sql` e informe o nome no campo `script`.

### Convenções de conteúdo

- Português do Brasil, tratamento na segunda pessoa, tom de instrutor técnico.
- Nunca mais de dois parágrafos sem um bloco executável (terminal, diagrama ou grade).
- Toda saída de terminal e toda mensagem de erro precisa ser fiel ao que o SQL Server
  realmente imprime, com `Msg NNN, Level N, State N`.
- Toda cardinalidade é lida em voz alta nos dois sentidos.
- Zero `TODO`, zero *lorem ipsum*, zero "conteúdo a ser definido".

### Convenções do banco

`snake_case` em tudo, com prefixo por natureza da coluna:

| Prefixo | Significado | Exemplo |
|---|---|---|
| `id_` | identificador, PK ou FK | `id_cliente` |
| `nm_` | nome | `nm_produto` |
| `ds_` | descrição/texto livre | `ds_cargo` |
| `dt_` | data ou data e hora | `dt_pedido` |
| `vl_` | valor monetário | `vl_unitario` |
| `qt_` | quantidade | `qt_item` |
| `nr_` | número identificador textual | `nr_telefone` |
| `fl_` | flag booleana (`BIT`) | `fl_ativo` |

Constraints são sempre nomeadas: `PK_`, `FK_`, `UQ_`, `CK_`, `DF_`.
A aula 12 formaliza essa nomenclatura e todos os scripts a seguem.

---

## Scripts SQL

Os arquivos de `scripts/` executam na ordem numérica, em um SQL Server 2022 limpo:

```powershell
sqlcmd -S localhost\SQLEXPRESS -E -i scripts\01-ambiente.sql
sqlcmd -S localhost\SQLEXPRESS -E -i scripts\05-cardinalidade.sql
```

- `01-ambiente.sql` só verifica o ambiente; cria e destrói um banco de teste.
- `05-cardinalidade.sql` cria o laboratório `MODELAGEM_UC10`, separado do banco do
  curso, e termina com cinco erros provocados de propósito dentro de `TRY...CATCH`
  (547, 515 e 2627) — eles **devem** aparecer na saída.
- O banco definitivo `BELLAMASSA` nasce na aula 12.

Os comentários dos `.sql` são escritos sem acentos porque o `sqlcmd` lê arquivos como
ANSI por padrão. Para usar acentos, salve em UTF-8 e execute com `-f 65001`.

---

## Estado do projeto

| Fase | Escopo | Situação |
|---|---|---|
| 1 | Fundação, design system, aulas 01 e 05 | concluída |
| 2 | Módulo 1 completo (02–11) + `caso-pizzaria.html` | pendente |
| 3 | Módulo 2 (12–22) + `referencia-tsql.html` + `seeds/` | pendente |
| 4 | Módulo 3 (23–24) + `glossario.html` + `docente.html` + `scripts-uc10.zip` | pendente |

As páginas e aulas ainda não escritas aparecem na navegação marcadas *em breve*,
controladas por `PUBLICADAS` e pelo campo `publicada` de `PAGINAS`, em
`assets/js/data/aulas.js`.

---

## Acessibilidade

- Contraste AA nos dois temas; o terminal permanece escuro em ambos.
- Navegação completa por teclado, incluindo `/` para focar a busca e setas nos resultados.
- `prefers-reduced-motion` respeitado.
- Todo diagrama tem descrição textual equivalente em `<details>` e `aria-label`.
- Link "pular para o conteúdo" como primeiro elemento focável.
