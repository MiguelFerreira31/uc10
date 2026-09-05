/**
 * hljs-tsql.js — gramática T-SQL registrada localmente no highlight.js.
 *
 * O bundle padrão do highlight.js traz `sql` genérico, que não conhece
 * GO, NVARCHAR, IDENTITY, TRY_CONVERT, OUTPUT, MERGE, TOP nem SCHEMABINDING.
 * Aqui a linguagem `tsql` é definida à mão, com o vocabulário do SQL Server 2022
 * usado no curso. Se o CDN do highlight.js não carregar, o terminal continua
 * funcionando: o SQL aparece escapado, sem cor.
 */

import { escapar } from './util.js';

const PALAVRAS = [
  'ADD', 'ALL', 'ALTER', 'AND', 'ANY', 'AS', 'ASC', 'AUTHORIZATION', 'BACKUP', 'BEGIN',
  'BETWEEN', 'BREAK', 'BULK', 'BY', 'CASCADE', 'CASE', 'CATCH', 'CHECK', 'CHECKPOINT',
  'CLOSE', 'CLUSTERED', 'COALESCE', 'COLLATE', 'COLUMN', 'COMMIT', 'CONSTRAINT', 'CONTAINS',
  'CONTINUE', 'CREATE', 'CROSS', 'CURRENT', 'CURSOR', 'DATABASE', 'DBCC', 'DEALLOCATE',
  'DECLARE', 'DEFAULT', 'DELETE', 'DENY', 'DESC', 'DIFFERENTIAL', 'DISK', 'DISTINCT', 'DROP',
  'ELSE', 'END', 'ERROR', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXISTS', 'EXTERNAL', 'FETCH', 'FILE',
  'FILEGROUP', 'FILENAME', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'FUNCTION', 'GOTO', 'GRANT',
  'GROUP', 'GROUPING', 'HAVING', 'IDENTITY', 'IF', 'IN', 'INCLUDE', 'INDEX', 'INNER',
  'INSERT', 'INSTEAD', 'INTERSECT', 'INTO', 'IS', 'JOIN', 'KEY', 'LEFT', 'LIKE', 'LOG',
  'LOGIN', 'MERGE', 'MOVE', 'NAME', 'NOCHECK', 'NOCOUNT', 'NOLOCK', 'NONCLUSTERED', 'NORECOVERY',
  'NOT', 'NULLIF', 'OFF', 'OFFSET', 'ON', 'ONLY', 'OPEN', 'OPENROWSET', 'OPTION', 'OR',
  'ORDER', 'OUTER', 'OUTPUT', 'OVER', 'PARTITION', 'PASSWORD', 'PERCENT', 'PIVOT', 'PRIMARY',
  'PRINT', 'PROCEDURE', 'PUBLIC', 'RAISERROR', 'READ', 'RECOVERY', 'REFERENCES', 'RESTORE',
  'RETURN', 'RETURNS', 'REVERT', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROLLUP', 'ROW', 'ROWS',
  'SAVE', 'SCHEMA', 'SCHEMABINDING', 'SELECT', 'SESSION', 'SET', 'SETS', 'SNAPSHOT', 'SOME',
  'STATISTICS', 'TABLE', 'THEN', 'THROW', 'TO', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER',
  'TRUNCATE', 'TRY', 'UNION', 'UNIQUE', 'UNPIVOT', 'UPDATE', 'USE', 'USER', 'VALUES', 'VIEW',
  'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHIN'
];

const TIPOS = [
  'BIGINT', 'BINARY', 'BIT', 'CHAR', 'DATE', 'DATETIME', 'DATETIME2', 'DATETIMEOFFSET',
  'DECIMAL', 'FLOAT', 'GEOGRAPHY', 'IMAGE', 'INT', 'MONEY', 'NCHAR', 'NTEXT', 'NUMERIC',
  'NVARCHAR', 'REAL', 'SMALLDATETIME', 'SMALLINT', 'SMALLMONEY', 'SQL_VARIANT', 'SYSNAME',
  'TEXT', 'TIME', 'TINYINT', 'UNIQUEIDENTIFIER', 'VARBINARY', 'VARCHAR', 'XML'
];

const FUNCOES = [
  'ABS', 'AVG', 'CAST', 'CEILING', 'CHARINDEX', 'CHECKSUM', 'CONCAT', 'CONCAT_WS', 'CONVERT',
  'COUNT', 'COUNT_BIG', 'CURRENT_TIMESTAMP', 'DATEADD', 'DATEDIFF', 'DATEFROMPARTS', 'DATENAME',
  'DATEPART', 'DAY', 'DENSE_RANK', 'EOMONTH', 'ERROR_LINE', 'ERROR_MESSAGE', 'ERROR_NUMBER',
  'ERROR_PROCEDURE', 'ERROR_SEVERITY', 'ERROR_STATE', 'FLOOR', 'FORMAT', 'GETDATE', 'GETUTCDATE',
  'HASHBYTES', 'IIF', 'ISDATE', 'ISNULL', 'ISNUMERIC', 'LAG', 'LEAD', 'LEN', 'LOWER', 'LTRIM',
  'MAX', 'MIN', 'MONTH', 'NEWID', 'NTILE', 'PARSE', 'PATINDEX', 'RAND', 'RANK', 'REPLACE',
  'REPLICATE', 'REVERSE', 'ROUND', 'ROW_NUMBER', 'RTRIM', 'SCOPE_IDENTITY', 'STDEV', 'STRING_AGG',
  'STRING_SPLIT', 'STUFF', 'SUBSTRING', 'SUM', 'SYSDATETIME', 'TRIM', 'TRY_CAST', 'TRY_CONVERT',
  'TRY_PARSE', 'UPPER', 'YEAR'
];

/** Definição da linguagem, no formato esperado pelo highlight.js. */
export function definicaoTsql(hljs) {
  return {
    name: 'T-SQL',
    aliases: ['tsql', 'mssql'],
    case_insensitive: true,
    keywords: {
      $pattern: /[A-Za-z_@][A-Za-z0-9_@$#]*/,
      keyword: PALAVRAS.join(' '),
      type: TIPOS.join(' '),
      built_in: FUNCOES.join(' '),
      literal: 'NULL TRUE FALSE'
    },
    contains: [
      hljs.COMMENT('--', '$'),
      hljs.COMMENT('/\\*', '\\*/'),
      // Separador de lote: linha inteira com GO
      { className: 'meta', begin: /^\s*GO\b/ },
      // Literais de texto, incluindo N'...' e o escape ''
      {
        className: 'string',
        begin: /N?'/,
        end: /'/,
        contains: [{ begin: /''/ }]
      },
      // Identificador entre colchetes: [Ordem do Dia]
      { className: 'symbol', begin: /\[/, end: /\]/, illegal: /\n/ },
      // Variáveis locais (@x), globais (@@VERSION) e temporárias (#tmp)
      { className: 'variable', begin: /@@?[A-Za-z_][A-Za-z0-9_@$#]*/ },
      { className: 'variable', begin: /##?[A-Za-z_][A-Za-z0-9_@$#]*/ },
      { className: 'number', begin: /\b0x[0-9A-Fa-f]+\b|\b\d+(\.\d+)?([eE][+-]?\d+)?\b/ },
      { className: 'operator', begin: /<>|<=|>=|!=|!<|!>|\+=|-=|\*=|\/=|[-+*/%=<>]/ }
    ]
  };
}

let promessa = null;

/**
 * Resolve com a instância do highlight.js já com `tsql` registrado,
 * ou com null se o CDN não estiver disponível.
 */
export function hljsPronto() {
  if (promessa) return promessa;
  promessa = new Promise((resolve) => {
    const tentar = () => {
      if (!window.hljs) return false;
      try {
        if (!window.hljs.getLanguage('tsql')) {
          window.hljs.registerLanguage('tsql', definicaoTsql);
        }
      } catch {
        /* segue sem realce se o registro falhar */
      }
      resolve(window.hljs);
      return true;
    };
    if (tentar()) return;
    if (document.readyState === 'complete') {
      resolve(null);
      return;
    }
    window.addEventListener('load', () => {
      if (!tentar()) resolve(null);
    }, { once: true });
  });
  return promessa;
}

/** Devolve o HTML realçado do código T-SQL; escapa e devolve puro se não houver hljs. */
export async function realcarSql(codigo) {
  const hljs = await hljsPronto();
  if (!hljs) return escapar(codigo);
  try {
    return hljs.highlight(codigo, { language: 'tsql', ignoreIllegals: true }).value;
  } catch {
    return escapar(codigo);
  }
}

/** Realce de linguagens auxiliares (bash, java, json) usadas em alguns blocos. */
export async function realcarOutra(codigo, linguagem) {
  const hljs = await hljsPronto();
  if (!hljs || !hljs.getLanguage(linguagem)) return escapar(codigo);
  try {
    return hljs.highlight(codigo, { language: linguagem, ignoreIllegals: true }).value;
  } catch {
    return escapar(codigo);
  }
}
