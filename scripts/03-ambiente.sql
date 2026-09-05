/* ============================================================================
   UC10 - Desenvolver banco de dados | SENAC
   Aula 03 - Instalacao e configuracao do SQL Server 2022 Express

   Como executar:
       sqlcmd -S localhost\SQLEXPRESS -E -i 03-ambiente.sql

   Este script nao cria nada permanente: ele verifica o ambiente e, no fim,
   cria e destroi um banco de teste para provar que voce tem permissao de
   CREATE DATABASE. O banco do curso (BELLAMASSA) so nasce na aula 13.

   Observacao sobre acentuacao: os scripts do curso sao gravados sem acentos
   nos comentarios porque o sqlcmd le arquivos como ANSI por padrao. Se quiser
   acentos, salve em UTF-8 e execute com a opcao -f 65001.
   ============================================================================ */

USE master;
GO

PRINT '--- 1. Versao, edicao e build -------------------------------------';
GO

SELECT @@VERSION AS versao_completa;
GO

SELECT CAST(SERVERPROPERTY('ServerName')      AS VARCHAR(60)) AS servidor,
       CAST(SERVERPROPERTY('InstanceName')    AS VARCHAR(60)) AS instancia,
       CAST(SERVERPROPERTY('Edition')         AS VARCHAR(40)) AS edicao,
       CAST(SERVERPROPERTY('ProductVersion')  AS VARCHAR(20)) AS versao,
       CAST(SERVERPROPERTY('ProductLevel')    AS VARCHAR(20)) AS nivel,
       CAST(SERVERPROPERTY('Collation')       AS VARCHAR(40)) AS collation;
GO

PRINT '--- 2. Modo de autenticacao ---------------------------------------';
GO

SELECT CASE SERVERPROPERTY('IsIntegratedSecurityOnly')
            WHEN 1 THEN 'Somente Windows'
            WHEN 0 THEN 'Misto (Windows + SQL Server)'
       END AS modo_autenticacao;
GO

/* O login sa existe sempre, mas vem desabilitado quando a instalacao usa
   somente autenticacao do Windows. is_disabled = 1 significa desabilitado. */
SELECT name        AS login_name,
       type_desc   AS tipo,
       is_disabled AS desabilitado,
       create_date AS criado_em
  FROM sys.server_principals
 WHERE name IN ('sa')
    OR type_desc = 'SQL_LOGIN';
GO

/* Descomente as duas linhas abaixo para habilitar o sa.
   Troque a senha antes de executar - esta e apenas a senha didatica do curso.

ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'Bella@Massa2026';
GO
*/

PRINT '--- 3. Protocolo e porta da sessao atual --------------------------';
GO

/* Shared memory com local_tcp_port NULL = voce conectou pelo atalho local.
   Para provar que o TCP/IP esta habilitado, reconecte usando o endereco IP:
       sqlcmd -S 127.0.0.1,1433 -U sa -P "Bella@Massa2026" -C            */
SELECT session_id,
       net_transport,
       local_net_address,
       local_tcp_port,
       auth_scheme
  FROM sys.dm_exec_connections
 WHERE session_id = @@SPID;
GO

PRINT '--- 4. Onde ficam os arquivos dos bancos --------------------------';
GO

SELECT DB_NAME(database_id) AS banco,
       name                 AS nome_logico,
       type_desc            AS tipo,
       physical_name        AS caminho,
       size / 128           AS tamanho_mb
  FROM sys.master_files
 ORDER BY banco, tipo DESC;
GO

PRINT '--- 5. Bancos de sistema ja existentes ----------------------------';
GO

SELECT name,
       state_desc,
       recovery_model_desc,
       collation_name
  FROM sys.databases
 ORDER BY database_id;
GO

PRINT '--- 6. Teste de permissao: cria e destroi um banco ----------------';
GO

IF DB_ID('SANDBOX_UC10') IS NOT NULL
BEGIN
    ALTER DATABASE SANDBOX_UC10 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SANDBOX_UC10;
END
GO

CREATE DATABASE SANDBOX_UC10;
GO

SELECT name, state_desc, recovery_model_desc
  FROM sys.databases
 WHERE name = 'SANDBOX_UC10';
GO

DROP DATABASE SANDBOX_UC10;
GO

PRINT 'Ambiente verificado. Se todas as consultas acima retornaram linhas,';
PRINT 'voce esta pronto para a aula 04 (levantamento de requisitos).';
GO
