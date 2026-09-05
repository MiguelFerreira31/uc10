/**
 * aulas.js — FONTE ÚNICA da trilha da UC10.
 *
 * Tudo que lista aulas no site deriva daqui: sidebar, index, breadcrumb,
 * prev/next, barra de progresso, página do docente e índice de busca.
 * Nenhuma dessas listas é escrita à mão duas vezes.
 *
 * ORDEM DO CURSO: a UC abre pela teoria. As aulas 01 e 02 apresentam a unidade,
 * os indicadores e os fundamentos conceituais; só a aula 03 põe a mão no
 * instalador. Modelagem vem depois da teoria, SQL depois da modelagem.
 *
 * Para criar uma aula nova: copie template-aula.html, troque o miolo e
 * complete a entrada correspondente neste arquivo.
 */

/** Indicadores do plano de ensino da UC10. */
export const INDICADORES = [
  {
    id: 1,
    curto: 'IND 1',
    titulo: 'Elabora diagramas de banco de dados',
    texto: 'Elabora diagramas conceituais e lógicos (MER e DER) de acordo com os requisitos levantados.'
  },
  {
    id: 2,
    curto: 'IND 2',
    titulo: 'Instala e configura o SGBD',
    texto: 'Instala e configura o sistema gerenciador de banco de dados conforme a necessidade do projeto.'
  },
  {
    id: 3,
    curto: 'IND 3',
    titulo: 'Desenvolve scripts SQL',
    texto: 'Desenvolve scripts de criação, manipulação e consulta (DDL, DML e DQL) coerentes com o modelo.'
  },
  {
    id: 4,
    curto: 'IND 4',
    titulo: 'Importa e exporta dados',
    texto: 'Realiza importação e exportação de dados entre o banco e fontes externas.'
  },
  {
    id: 5,
    curto: 'IND 5',
    titulo: 'Executa backup, restauração e segurança',
    texto: 'Executa rotinas de backup e restauração e aplica controles de segurança e acesso.'
  }
];

/**
 * Os 4 módulos do curso. A carga horária NÃO é escrita à mão: é somada a
 * partir das aulas de cada módulo, no fim deste arquivo.
 */
export const MODULOS = [
  {
    id: 0,
    rotulo: 'Módulo 0',
    titulo: 'Fundamentos e ambiente',
    resumo:
      'Duas aulas teóricas apresentam a unidade curricular, os cinco indicadores e os conceitos que sustentam tudo o que vem depois. Só então o SGBD é instalado.'
  },
  {
    id: 1,
    rotulo: 'Módulo 1',
    titulo: 'Modelagem: MER e DER',
    resumo:
      'Do requisito ao modelo relacional normalizado, com notação de Chen, pé-de-galinha e dicionário de dados.'
  },
  {
    id: 2,
    rotulo: 'Módulo 2',
    titulo: 'SQL: DDL, DML e DQL',
    resumo: 'Criar o banco, povoar, consultar, juntar, agregar, indexar, importar e exportar em T-SQL.'
  },
  {
    id: 3,
    rotulo: 'Módulo 3',
    titulo: 'Programabilidade, segurança e integração',
    resumo: 'Procedures, funções, triggers, JDBC, segurança, backup, versionamento e entrega do projeto.'
  }
];

/**
 * As 24 aulas. Campos:
 *  n           número do encontro (1..24)
 *  slug        nome do arquivo em /aulas, sem extensão
 *  modulo      id do módulo
 *  titulo      título exibido na navegação
 *  subtitulo   frase de apoio no index e no cabeçalho
 *  tipo        'teorica' | 'pratica' — usado no rótulo do cabeçalho
 *  carga       horas do encontro (sempre 3)
 *  leitura     minutos estimados de leitura do texto
 *  indicadores ids de INDICADORES atendidos
 *  prereq      slugs exigidos antes desta aula
 *  script      arquivo .sql da aula em /scripts (null nas aulas teóricas)
 *  secoes      âncoras da página, usadas na busca e no sumário lateral
 *  tags        palavras-chave para a busca
 */
export const AULAS = [
  {
    n: 1,
    slug: 'aula-01',
    modulo: 0,
    titulo: 'Apresentação da UC10 e fundamentos de banco de dados',
    subtitulo:
      'O que a unidade entrega, os cinco indicadores, o projeto integrador e por que bancos de dados existem.',
    tipo: 'teorica',
    carga: 3,
    leitura: 30,
    indicadores: [1, 2, 3, 4, 5],
    prereq: [],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'o-que-e-a-uc', titulo: 'O que é a UC10' },
      { id: 'indicadores', titulo: 'Os cinco indicadores, um a um' },
      { id: 'projeto-integrador', titulo: 'O projeto integrador: Pizzaria Bella Massa' },
      { id: 'dado-informacao', titulo: 'Dado, informação e conhecimento' },
      { id: 'arquivos-vs-bd', titulo: 'Por que não resolver com planilha' },
      { id: 'funcoes-sgbd', titulo: 'O que um SGBD faz por você' },
      { id: 'papeis', titulo: 'Quem trabalha com banco de dados' },
      { id: 'mapa-do-curso', titulo: 'Mapa dos 24 encontros' },
      { id: 'avaliacao', titulo: 'Como você será avaliado' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: [
      'apresentação',
      'indicadores',
      'plano de ensino',
      'projeto integrador',
      'dado',
      'informação',
      'sgbd',
      'redundância',
      'avaliação',
      'dba'
    ]
  },
  {
    n: 2,
    slug: 'aula-02',
    modulo: 0,
    titulo: 'Modelos de dados, ANSI/SPARC e o modelo relacional',
    subtitulo:
      'Evolução dos modelos, os três esquemas, relação, tupla, domínio e chave, e as sublinguagens do SQL.',
    tipo: 'teorica',
    carga: 3,
    leitura: 32,
    indicadores: [1],
    prereq: ['aula-01'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'modelos-de-dados', titulo: 'A evolução dos modelos de dados' },
      { id: 'relacional', titulo: 'O modelo relacional de Codd' },
      { id: 'vocabulario', titulo: 'Relação, tupla, atributo, domínio e chave' },
      { id: 'ansi-sparc', titulo: 'Arquitetura ANSI/SPARC em três esquemas' },
      { id: 'independencia', titulo: 'Independência de dados' },
      { id: 'niveis-modelo', titulo: 'Conceitual, lógico e físico' },
      { id: 'sublinguagens', titulo: 'DDL, DML, DQL, DCL e TCL' },
      { id: 'arquivos-fisicos', titulo: 'O nível físico: .mdf e .ldf' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: [
      'modelo relacional',
      'codd',
      'ansi/sparc',
      'independência de dados',
      'tupla',
      'domínio',
      'chave',
      'ddl',
      'dml',
      'dql',
      'dcl',
      'tcl',
      'mdf',
      'ldf',
      'nosql'
    ]
  },
  {
    n: 3,
    slug: 'aula-03',
    modulo: 0,
    titulo: 'Instalação e configuração do SQL Server 2022',
    subtitulo: 'Instância, autenticação, TCP/IP, SSMS, Azure Data Studio, sqlcmd e Docker.',
    tipo: 'pratica',
    carga: 3,
    leitura: 28,
    indicadores: [2],
    prereq: ['aula-02'],
    script: '03-ambiente.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'pecas', titulo: 'As peças do ambiente' },
      { id: 'instalacao', titulo: 'Instalando o SQL Server 2022 Express' },
      { id: 'autenticacao', titulo: 'Modo de autenticação e o login sa' },
      { id: 'rede', titulo: 'TCP/IP, porta 1433 e SQL Server Browser' },
      { id: 'sqlcmd', titulo: 'Primeira conexão no sqlcmd' },
      { id: 'ssms', titulo: 'SSMS 20 e Azure Data Studio' },
      { id: 'docker', titulo: 'Alternativa com Docker' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['instalação', 'sqlcmd', 'ssms', 'docker', 'tcp/ip', 'porta 1433', 'sa', 'instância', 'SELECT @@VERSION']
  },
  {
    n: 4,
    slug: 'aula-04',
    modulo: 1,
    titulo: 'Levantamento de requisitos da Pizzaria Bella Massa',
    subtitulo: 'Entrevista com a gestora: substantivos viram entidades, verbos viram relacionamentos.',
    tipo: 'pratica',
    carga: 3,
    leitura: 32,
    indicadores: [1],
    prereq: ['aula-02'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'entrevista', titulo: 'Entrevista com a gestora' },
      { id: 'substantivos', titulo: 'Substantivos: entidades candidatas' },
      { id: 'verbos', titulo: 'Verbos: relacionamentos candidatos' },
      { id: 'regras-negocio', titulo: 'Regras de negócio extraídas' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['requisitos', 'entrevista', 'regras de negócio', 'entidades candidatas', 'escopo', 'bina']
  },
  {
    n: 5,
    slug: 'aula-05',
    modulo: 1,
    titulo: 'MER conceitual: entidades, atributos e chaves',
    subtitulo: 'Atributo simples, composto, multivalorado e derivado; domínio e chaves na notação de Chen.',
    tipo: 'pratica',
    carga: 3,
    leitura: 34,
    indicadores: [1],
    prereq: ['aula-04'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'entidade-ocorrencia', titulo: 'Entidade e ocorrência' },
      { id: 'atributos', titulo: 'Tipos de atributo' },
      { id: 'dominio', titulo: 'Domínio do atributo' },
      { id: 'chaves', titulo: 'Chave candidata, primária e alternativa' },
      { id: 'chen', titulo: 'Desenhando em notação de Chen' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['mer', 'chen', 'atributo composto', 'multivalorado', 'derivado', 'chave candidata', 'chave primária']
  },
  {
    n: 6,
    slug: 'aula-06',
    modulo: 1,
    titulo: 'Relacionamentos e cardinalidade',
    subtitulo: 'Grau, cardinalidade máxima e mínima, participação total e auto-relacionamento.',
    tipo: 'pratica',
    carga: 3,
    leitura: 36,
    indicadores: [1],
    prereq: ['aula-05'],
    script: '06-cardinalidade.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'grau', titulo: 'Grau do relacionamento' },
      { id: 'cardinalidade-maxima', titulo: 'Cardinalidade máxima: 1:1, 1:N e N:N' },
      { id: 'cardinalidade-minima', titulo: 'Cardinalidade mínima e participação' },
      { id: 'leitura-dupla', titulo: 'Lendo o relacionamento nos dois sentidos' },
      { id: 'auto-relacionamento', titulo: 'Auto-relacionamento' },
      { id: 'modelos-errados', titulo: 'Dois modelos errados' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['cardinalidade', '1:n', 'n:n', 'participação total', 'grau', 'auto-relacionamento', 'pé-de-galinha', 'chen']
  },
  {
    n: 7,
    slug: 'aula-07',
    modulo: 1,
    titulo: 'Entidade fraca, especialização e agregação',
    subtitulo: 'Pessoa vira Cliente e Funcionário; Pedido sustenta ItemPedido.',
    tipo: 'pratica',
    carga: 3,
    leitura: 32,
    indicadores: [1],
    prereq: ['aula-06'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'entidade-fraca', titulo: 'Entidade fraca e chave parcial' },
      { id: 'especializacao', titulo: 'Especialização e generalização' },
      { id: 'restricoes', titulo: 'Restrições: total/parcial e disjunta/sobreposta' },
      { id: 'agregacao', titulo: 'Agregação' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['entidade fraca', 'especialização', 'generalização', 'herança', 'agregação', 'is-a', 'disjunta']
  },
  {
    n: 8,
    slug: 'aula-08',
    modulo: 1,
    titulo: 'DER lógico em notação pé-de-galinha',
    subtitulo: 'Traduzindo o MER de Chen e comparando Chen, crow foot e IDEF1X no mesmo trecho.',
    tipo: 'pratica',
    carga: 3,
    leitura: 30,
    indicadores: [1],
    prereq: ['aula-07'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'conceitual-logico', titulo: 'Do conceitual ao lógico' },
      { id: 'pe-de-galinha', titulo: 'Símbolos do pé-de-galinha' },
      { id: 'tres-notacoes', titulo: 'Chen, crow foot e IDEF1X lado a lado' },
      { id: 'ferramentas', titulo: 'Ferramentas: dbdiagram, Mermaid, SSMS e Workbench' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['der', 'pé-de-galinha', 'crow foot', 'idef1x', 'mermaid', 'dbdiagram', 'modelo lógico']
  },
  {
    n: 9,
    slug: 'aula-09',
    modulo: 1,
    titulo: 'Mapeamento MER para o modelo relacional',
    subtitulo: 'As 7 regras de transformação, cada uma com antes e depois.',
    tipo: 'pratica',
    carga: 3,
    leitura: 35,
    indicadores: [1, 3],
    prereq: ['aula-08'],
    script: '09-mapeamento.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'regra-1', titulo: 'Regra 1: entidade forte' },
      { id: 'regra-2', titulo: 'Regra 2: relacionamento 1:1' },
      { id: 'regra-3', titulo: 'Regra 3: relacionamento 1:N' },
      { id: 'regra-4', titulo: 'Regra 4: relacionamento N:N' },
      { id: 'regra-5', titulo: 'Regra 5: atributo multivalorado' },
      { id: 'regra-6', titulo: 'Regra 6: entidade fraca' },
      { id: 'regra-7', titulo: 'Regra 7: especialização' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['mapeamento', 'regras de transformação', 'tabela associativa', 'chave estrangeira', 'relacional']
  },
  {
    n: 10,
    slug: 'aula-10',
    modulo: 1,
    titulo: 'Integridade e normalização até a BCNF',
    subtitulo: 'Anomalias, 1FN, 2FN, 3FN e BCNF a partir de uma tabela única e suja da pizzaria.',
    tipo: 'pratica',
    carga: 3,
    leitura: 38,
    indicadores: [1, 3],
    prereq: ['aula-09'],
    script: '10-normalizacao.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'integridade', titulo: 'Integridade de domínio, entidade e referencial' },
      { id: 'acoes-referenciais', titulo: 'ON DELETE e ON UPDATE' },
      { id: 'anomalias', titulo: 'Anomalias de inserção, alteração e exclusão' },
      { id: 'primeira-fn', titulo: 'Primeira forma normal' },
      { id: 'segunda-fn', titulo: 'Segunda forma normal' },
      { id: 'terceira-fn', titulo: 'Terceira forma normal' },
      { id: 'bcnf', titulo: 'Forma normal de Boyce-Codd' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['normalização', '1fn', '2fn', '3fn', 'bcnf', 'anomalia', 'cascade', 'integridade referencial']
  },
  {
    n: 11,
    slug: 'aula-11',
    modulo: 1,
    titulo: 'Dicionário de dados',
    subtitulo: 'Tabela, coluna, tipo, nulidade, default, chave, regra de negócio e exemplo.',
    tipo: 'pratica',
    carga: 3,
    leitura: 30,
    indicadores: [1],
    prereq: ['aula-10'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'formato', titulo: 'Formato de um dicionário útil' },
      { id: 'dicionario-pizzaria', titulo: 'Dicionário completo da Bella Massa' },
      { id: 'extended-properties', titulo: 'Documentando dentro do próprio banco' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['dicionário de dados', 'metadados', 'sp_addextendedproperty', 'documentação', 'information_schema']
  },
  {
    n: 12,
    slug: 'aula-12',
    modulo: 1,
    titulo: 'Oficina de modelagem',
    subtitulo: 'Locadora de brinquedos, clínica veterinária e sistema de chamados, do MER ao dicionário.',
    tipo: 'pratica',
    carga: 3,
    leitura: 25,
    indicadores: [1],
    prereq: ['aula-11'],
    script: null,
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'metodo', titulo: 'Método de trabalho da oficina' },
      { id: 'dominio-1', titulo: 'Domínio 1: locadora de brinquedos' },
      { id: 'dominio-2', titulo: 'Domínio 2: clínica veterinária' },
      { id: 'dominio-3', titulo: 'Domínio 3: sistema de chamados' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['oficina', 'exercício de modelagem', 'locadora', 'veterinária', 'chamados', 'gabarito']
  },
  {
    n: 13,
    slug: 'aula-13',
    modulo: 2,
    titulo: 'DDL: criando o banco e as tabelas',
    subtitulo: 'CREATE DATABASE, collation, tipos T-SQL, IDENTITY e a nomenclatura do projeto.',
    tipo: 'pratica',
    carga: 3,
    leitura: 34,
    indicadores: [2, 3],
    prereq: ['aula-03', 'aula-09', 'aula-11'],
    script: '13-ddl-bellamassa.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'create-database', titulo: 'CREATE DATABASE, arquivos e filegroups' },
      { id: 'collation', titulo: 'Collation e acentuação' },
      { id: 'tipos', titulo: 'Tipos de dados do T-SQL' },
      { id: 'nomenclatura', titulo: 'Nomenclatura do projeto' },
      { id: 'create-table', titulo: 'CREATE TABLE e IDENTITY' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['ddl', 'create database', 'create table', 'identity', 'decimal', 'nvarchar', 'collation', 'filegroup']
  },
  {
    n: 14,
    slug: 'aula-14',
    modulo: 2,
    titulo: 'Constraints e alteração de estrutura',
    subtitulo: 'PK, FK, UNIQUE, CHECK, DEFAULT, ALTER TABLE e TRUNCATE versus DELETE.',
    tipo: 'pratica',
    carga: 3,
    leitura: 32,
    indicadores: [3],
    prereq: ['aula-13'],
    script: '14-constraints.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'primary-key', titulo: 'PRIMARY KEY' },
      { id: 'foreign-key', titulo: 'FOREIGN KEY e ações referenciais' },
      { id: 'unique-check', titulo: 'UNIQUE, CHECK, DEFAULT e NOT NULL' },
      { id: 'nomeacao', titulo: 'Nomeação explícita das constraints' },
      { id: 'alter-drop', titulo: 'ALTER TABLE, DROP e TRUNCATE' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['constraint', 'primary key', 'foreign key', 'check', 'default', 'alter table', 'truncate', 'msg 547']
  },
  {
    n: 15,
    slug: 'aula-15',
    modulo: 2,
    titulo: 'DML e transações',
    subtitulo: 'INSERT, UPDATE, DELETE, MERGE, OUTPUT, BEGIN TRAN e TRY...CATCH.',
    tipo: 'pratica',
    carga: 3,
    leitura: 33,
    indicadores: [3],
    prereq: ['aula-14'],
    script: '15-dml.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'insert', titulo: 'INSERT em suas três formas' },
      { id: 'update', titulo: 'UPDATE com segurança' },
      { id: 'delete', titulo: 'DELETE e a FK que protege' },
      { id: 'merge-output', titulo: 'MERGE e OUTPUT' },
      { id: 'transacoes', titulo: 'Transações e TRY...CATCH' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['dml', 'insert', 'update', 'delete', 'merge', 'output', 'transação', 'rollback', 'try catch']
  },
  {
    n: 16,
    slug: 'aula-16',
    modulo: 2,
    titulo: 'DQL: o SELECT do zero',
    subtitulo: 'WHERE, BETWEEN, IN, LIKE, IS NULL, ORDER BY, TOP e a ordem lógica de execução.',
    tipo: 'pratica',
    carga: 3,
    leitura: 34,
    indicadores: [3],
    prereq: ['aula-15'],
    script: '16-select.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'select-basico', titulo: 'SELECT, colunas e aliases' },
      { id: 'where', titulo: 'WHERE e operadores' },
      { id: 'like-null', titulo: 'LIKE, IS NULL e as armadilhas do NULL' },
      { id: 'order-by', titulo: 'ORDER BY, TOP e OFFSET FETCH' },
      { id: 'ordem-logica', titulo: 'Ordem lógica de execução' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['select', 'where', 'like', 'order by', 'top', 'offset fetch', 'distinct', 'null', 'ordem lógica']
  },
  {
    n: 17,
    slug: 'aula-17',
    modulo: 2,
    titulo: 'Funções escalares, conversões e datas',
    subtitulo: 'Texto, números, CAST e TRY_CONVERT, COALESCE, CASE, DATEADD, DATEDIFF e EOMONTH.',
    tipo: 'pratica',
    carga: 3,
    leitura: 38,
    indicadores: [3],
    prereq: ['aula-16'],
    script: '17-funcoes-e-datas.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'string', titulo: 'Funções de texto' },
      { id: 'numericas', titulo: 'Funções numéricas e arredondamento' },
      { id: 'conversao', titulo: 'CAST, CONVERT e TRY_CONVERT' },
      { id: 'nulos', titulo: 'ISNULL, COALESCE e NULLIF' },
      { id: 'case', titulo: 'CASE' },
      { id: 'agora', titulo: 'GETDATE, SYSDATETIME e precisão' },
      { id: 'aritmetica', titulo: 'DATEADD, DATEDIFF e DATEPART' },
      { id: 'periodos', titulo: 'Fechamento de período com EOMONTH' },
      { id: 'formato', titulo: 'FORMAT, CONVERT e SET DATEFORMAT' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: [
      'concat',
      'substring',
      'trim',
      'cast',
      'convert',
      'try_convert',
      'coalesce',
      'nullif',
      'case',
      'dateadd',
      'datediff',
      'datepart',
      'eomonth',
      'format',
      'sargable'
    ]
  },
  {
    n: 18,
    slug: 'aula-18',
    modulo: 2,
    titulo: 'Agregação e agrupamento',
    subtitulo: 'COUNT, SUM, AVG, GROUP BY, HAVING, ROLLUP e o efeito do NULL.',
    tipo: 'pratica',
    carga: 3,
    leitura: 30,
    indicadores: [3],
    prereq: ['aula-16'],
    script: '18-agregacao.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'funcoes-agregadas', titulo: 'As cinco funções de agregação' },
      { id: 'group-by', titulo: 'GROUP BY' },
      { id: 'having', titulo: 'HAVING versus WHERE' },
      { id: 'rollup', titulo: 'GROUPING SETS e ROLLUP' },
      { id: 'count-null', titulo: 'COUNT(*) versus COUNT(coluna)' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['group by', 'having', 'count', 'sum', 'avg', 'rollup', 'grouping sets', 'msg 8120']
  },
  {
    n: 19,
    slug: 'aula-19',
    modulo: 2,
    titulo: 'Junções e operadores de conjunto',
    subtitulo: 'INNER, LEFT, RIGHT, FULL, CROSS, SELF JOIN, UNION, INTERSECT e EXCEPT.',
    tipo: 'pratica',
    carga: 3,
    leitura: 36,
    indicadores: [3],
    prereq: ['aula-18'],
    script: '19-joins.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'inner-join', titulo: 'INNER JOIN' },
      { id: 'outer-join', titulo: 'LEFT, RIGHT e FULL' },
      { id: 'cross-self', titulo: 'CROSS JOIN e SELF JOIN' },
      { id: 'n-para-n', titulo: 'Resolvendo o N:N pedido e produto' },
      { id: 'conjuntos', titulo: 'UNION, INTERSECT e EXCEPT' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['join', 'inner join', 'left join', 'full join', 'self join', 'union', 'intersect', 'except', 'produto cartesiano']
  },
  {
    n: 20,
    slug: 'aula-20',
    modulo: 2,
    titulo: 'Subconsultas, CTE e window functions',
    subtitulo: 'EXISTS versus IN, CTE recursiva na hierarquia de funcionários e ROW_NUMBER.',
    tipo: 'pratica',
    carga: 3,
    leitura: 35,
    indicadores: [3],
    prereq: ['aula-19'],
    script: '20-subconsultas-cte.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'subconsultas', titulo: 'Subconsulta escalar, de lista e correlacionada' },
      { id: 'exists-in', titulo: 'EXISTS versus IN' },
      { id: 'cte', titulo: 'CTE com WITH' },
      { id: 'cte-recursiva', titulo: 'CTE recursiva' },
      { id: 'window', titulo: 'Window functions' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['subconsulta', 'exists', 'cte', 'with', 'recursiva', 'row_number', 'rank', 'over', 'partition by']
  },
  {
    n: 21,
    slug: 'aula-21',
    modulo: 2,
    titulo: 'Views, índices e plano de execução',
    subtitulo: 'SCHEMABINDING, view indexada, clustered e nonclustered, scan versus seek.',
    tipo: 'pratica',
    carga: 3,
    leitura: 33,
    indicadores: [3],
    prereq: ['aula-20'],
    script: '21-views-indices.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'views', titulo: 'Criando views' },
      { id: 'schemabinding', titulo: 'WITH SCHEMABINDING e view indexada' },
      { id: 'indices', titulo: 'Índices clustered e nonclustered' },
      { id: 'include', titulo: 'Colunas INCLUDE e cobertura' },
      { id: 'plano', titulo: 'Lendo o plano de execução' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['view', 'schemabinding', 'índice', 'clustered', 'nonclustered', 'include', 'seek', 'scan', 'statistics io']
  },
  {
    n: 22,
    slug: 'aula-22',
    modulo: 2,
    titulo: 'Importação e exportação de dados',
    subtitulo: 'BULK INSERT, bcp, OPENROWSET, wizard do SSMS e FOR JSON.',
    tipo: 'pratica',
    carga: 3,
    leitura: 31,
    indicadores: [3, 4],
    prereq: ['aula-15'],
    script: '22-import-export.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'csv', titulo: 'O CSV de origem' },
      { id: 'bulk-insert', titulo: 'BULK INSERT' },
      { id: 'bcp', titulo: 'bcp na linha de comando' },
      { id: 'openrowset', titulo: 'OPENROWSET e o wizard do SSMS' },
      { id: 'exportacao', titulo: 'Exportando para CSV e JSON' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['bulk insert', 'bcp', 'openrowset', 'csv', 'for json', 'importação', 'exportação', 'staging']
  },
  {
    n: 23,
    slug: 'aula-23',
    modulo: 3,
    titulo: 'Procedures, funções, triggers e JDBC',
    subtitulo: 'Programabilidade no servidor e o CRUD em Java com PreparedStatement e DAO.',
    tipo: 'pratica',
    carga: 3,
    leitura: 40,
    indicadores: [3],
    prereq: ['aula-19', 'aula-15'],
    script: '23-programabilidade.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'procedures', titulo: 'Stored procedures' },
      { id: 'funcoes', titulo: 'Funções escalares e table-valued' },
      { id: 'triggers', titulo: 'Triggers e as tabelas inserted/deleted' },
      { id: 'auditoria', titulo: 'Auditoria de alteração de preço' },
      { id: 'jdbc', titulo: 'Java + JDBC: CRUD completo' },
      { id: 'dao', titulo: 'Padrão DAO e tratamento de exceção' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['procedure', 'function', 'trigger', 'inserted', 'deleted', 'jdbc', 'preparedstatement', 'dao', 'java']
  },
  {
    n: 24,
    slug: 'aula-24',
    modulo: 3,
    titulo: 'Segurança, backup e entrega do projeto',
    subtitulo: 'Logins e roles, SQL Injection, backup e restore, Flyway, NoSQL e documentação final.',
    tipo: 'pratica',
    carga: 3,
    leitura: 42,
    indicadores: [4, 5],
    prereq: ['aula-23'],
    script: '24-seguranca-backup.sql',
    secoes: [
      { id: 'objetivos', titulo: 'Objetivos de aprendizagem' },
      { id: 'problematizacao', titulo: 'Problematização' },
      { id: 'logins-users', titulo: 'Logins, users e roles' },
      { id: 'permissoes', titulo: 'GRANT, DENY e REVOKE' },
      { id: 'sql-injection', titulo: 'SQL Injection e a correção com sp_executesql' },
      { id: 'criptografia', titulo: 'HASHBYTES, TDE e Always Encrypted' },
      { id: 'backup', titulo: 'Backup FULL, DIFFERENTIAL e LOG' },
      { id: 'restore', titulo: 'RESTORE e recovery models' },
      { id: 'isolamento', titulo: 'Níveis de isolamento e concorrência' },
      { id: 'flyway', titulo: 'Versionamento do banco com Flyway e Git' },
      { id: 'nosql', titulo: 'Panorama NoSQL' },
      { id: 'entrega', titulo: 'Documentação técnica e entrega' },
      { id: 'mao-na-massa', titulo: 'Mão na massa' },
      { id: 'erros-comuns', titulo: 'Erros comuns' },
      { id: 'checklist', titulo: 'Checklist' },
      { id: 'quiz', titulo: 'Quiz' }
    ],
    tags: ['login', 'role', 'grant', 'deny', 'sql injection', 'sp_executesql', 'hashbytes', 'backup', 'restore', 'flyway', 'nosql']
  }
];

/**
 * Aulas cujo arquivo HTML já existe no repositório.
 *
 * A trilha inteira aparece na navegação desde o primeiro dia — o aluno precisa
 * ver onde o curso vai chegar —, mas as aulas ainda não escritas são exibidas
 * como texto inerte, nunca como link quebrado. Cada fase de produção acrescenta
 * os slugs correspondentes a este conjunto, e só a ele.
 */
const PUBLICADAS = new Set(['aula-01', 'aula-02', 'aula-03', 'aula-06']);

AULAS.forEach((aula) => {
  aula.publicada = PUBLICADAS.has(aula.slug);
});

/** Páginas fixas do site, fora da sequência de aulas. */
export const PAGINAS = [
  { arquivo: 'index.html', titulo: 'Trilha', icone: 'bi-signpost-split', publicada: true },
  { arquivo: 'caso-pizzaria.html', titulo: 'Caso Bella Massa', icone: 'bi-diagram-3', publicada: false },
  { arquivo: 'referencia-tsql.html', titulo: 'Referência T-SQL', icone: 'bi-journal-code', publicada: false },
  { arquivo: 'glossario.html', titulo: 'Glossário', icone: 'bi-book', publicada: false },
  { arquivo: 'docente.html', titulo: 'Docente', icone: 'bi-easel', publicada: false }
];

/* ---------------------------------------------------------------------------
   Derivações. Nenhuma página reimplementa estas regras.
   --------------------------------------------------------------------------- */

/** Total de aulas da trilha. */
export const TOTAL_AULAS = AULAS.length;

/** Carga horária total do curso, em horas. */
export const CARGA_TOTAL = AULAS.reduce((soma, a) => soma + a.carga, 0);

/** Aulas de um módulo, na ordem do curso. */
export function aulasDoModulo(id) {
  return AULAS.filter((a) => a.modulo === id);
}

// A carga de cada módulo é a soma das suas aulas — nunca um número digitado.
MODULOS.forEach((mod) => {
  const aulas = aulasDoModulo(mod.id);
  mod.carga = aulas.reduce((soma, a) => soma + a.carga, 0);
  mod.encontros = aulas.length;
});

/** Retorna a aula pelo slug, ou null. */
export function getAula(slug) {
  return AULAS.find((a) => a.slug === slug) || null;
}

/** Retorna o módulo pelo id, ou null. */
export function getModulo(id) {
  return MODULOS.find((m) => m.id === id) || null;
}

/** Aula anterior a um slug, ou null se for a primeira. */
export function aulaAnterior(slug) {
  const i = AULAS.findIndex((a) => a.slug === slug);
  return i > 0 ? AULAS[i - 1] : null;
}

/** Próxima aula depois de um slug, ou null se for a última. */
export function aulaProxima(slug) {
  const i = AULAS.findIndex((a) => a.slug === slug);
  return i >= 0 && i < AULAS.length - 1 ? AULAS[i + 1] : null;
}

/** Indicadores atendidos por uma aula, já resolvidos em objetos. */
export function indicadoresDaAula(aula) {
  return (aula.indicadores || []).map((id) => INDICADORES.find((i) => i.id === id)).filter(Boolean);
}

/** Aulas que atendem determinado indicador — usado na matriz do docente. */
export function aulasDoIndicador(id) {
  return AULAS.filter((a) => a.indicadores.includes(id));
}

/** Número da aula formatado com dois dígitos. */
export function numeroFormatado(aula) {
  return String(aula.n).padStart(2, '0');
}
