/* ============================================================================
   UC10 - Desenvolver banco de dados | SENAC
   Aula 06 - Relacionamentos e cardinalidade

   Como executar:
       sqlcmd -S localhost\SQLEXPRESS -E -i 06-cardinalidade.sql

   Este script cria o banco de laboratorio MODELAGEM_UC10, separado do banco
   do curso. O BELLAMASSA definitivo so nasce na aula 13; aqui o objetivo e
   ver cada cardinalidade virando estrutura, inclusive os erros.

   Ordem de criacao: sempre do lado "um" para o lado "muitos". Tabela
   referenciada antes da tabela que referencia, INSERT do pai antes do filho.
   ============================================================================ */

USE master;
GO

IF DB_ID('MODELAGEM_UC10') IS NOT NULL
BEGIN
    ALTER DATABASE MODELAGEM_UC10 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MODELAGEM_UC10;
END
GO

CREATE DATABASE MODELAGEM_UC10;
GO

USE MODELAGEM_UC10;
GO

/* ---------------------------------------------------------------------------
   1:N - um cliente faz muitos pedidos
   A chave estrangeira mora no lado "muitos": id_cliente vai para pedido.
   --------------------------------------------------------------------------- */

CREATE TABLE cliente (
    id_cliente  INT IDENTITY(1,1) NOT NULL,
    nm_cliente  VARCHAR(120)      NOT NULL,
    CONSTRAINT PK_cliente PRIMARY KEY (id_cliente)
);
GO

CREATE TABLE mesa (
    id_mesa    INT     NOT NULL,
    nr_lugares TINYINT NOT NULL,
    CONSTRAINT PK_mesa PRIMARY KEY (id_mesa)
);
GO

/* id_cliente NOT NULL  -> participacao TOTAL  (todo pedido tem dono)
   id_mesa    NULL      -> participacao PARCIAL (delivery nao usa mesa)     */
CREATE TABLE pedido (
    id_pedido   INT IDENTITY(1,1) NOT NULL,
    id_cliente  INT               NOT NULL,
    id_mesa     INT               NULL,
    dt_pedido   DATETIME2(0)      NOT NULL
        CONSTRAINT DF_pedido_dt_pedido DEFAULT SYSDATETIME(),
    CONSTRAINT PK_pedido         PRIMARY KEY (id_pedido),
    CONSTRAINT FK_pedido_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente),
    CONSTRAINT FK_pedido_mesa    FOREIGN KEY (id_mesa)
        REFERENCES mesa (id_mesa)
);
GO

/* ---------------------------------------------------------------------------
   N:N - um pedido leva muitos produtos, um produto sai em muitos pedidos
   O losango do MER vira a tabela associativa item_pedido, com chave
   primaria composta e os atributos do proprio relacionamento.
   --------------------------------------------------------------------------- */

CREATE TABLE produto (
    id_produto  INT IDENTITY(1,1) NOT NULL,
    nm_produto  VARCHAR(80)       NOT NULL,
    CONSTRAINT PK_produto    PRIMARY KEY (id_produto),
    CONSTRAINT UQ_produto_nm UNIQUE (nm_produto)
);
GO

CREATE TABLE item_pedido (
    id_pedido    INT          NOT NULL,
    id_produto   INT          NOT NULL,
    qt_item      SMALLINT     NOT NULL,
    vl_unitario  DECIMAL(8,2) NOT NULL,
    CONSTRAINT PK_item_pedido         PRIMARY KEY (id_pedido, id_produto),
    CONSTRAINT FK_item_pedido_pedido  FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido),
    CONSTRAINT FK_item_pedido_produto FOREIGN KEY (id_produto)
        REFERENCES produto (id_produto),
    CONSTRAINT CK_item_pedido_qt      CHECK (qt_item > 0)
);
GO

/* ---------------------------------------------------------------------------
   1:1 - um pedido de delivery tem no maximo uma entrega
   A chave primaria de entrega e, ela mesma, a chave estrangeira para pedido:
   isso garante no maximo uma entrega por pedido sem precisar de UNIQUE extra.
   --------------------------------------------------------------------------- */

CREATE TABLE entrega (
    id_pedido     INT          NOT NULL,
    nm_entregador VARCHAR(120) NOT NULL,
    dt_saida      DATETIME2(0) NULL,
    CONSTRAINT PK_entrega        PRIMARY KEY (id_pedido),
    CONSTRAINT FK_entrega_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido)
);
GO

/* ---------------------------------------------------------------------------
   Auto-relacionamento 1:N - funcionario supervisiona funcionario
   id_supervisor aceita NULL porque quem esta no topo nao tem supervisor.
   --------------------------------------------------------------------------- */

CREATE TABLE funcionario (
    id_funcionario  INT IDENTITY(1,1) NOT NULL,
    nm_funcionario  VARCHAR(120)      NOT NULL,
    ds_cargo        VARCHAR(40)       NOT NULL,
    id_supervisor   INT               NULL,
    CONSTRAINT PK_funcionario            PRIMARY KEY (id_funcionario),
    CONSTRAINT FK_funcionario_supervisor FOREIGN KEY (id_supervisor)
        REFERENCES funcionario (id_funcionario)
);
GO

/* ---------------------------------------------------------------------------
   Atributo multivalorado - telefone do cliente vira entidade propria
   1:N com participacao parcial do lado do cliente: pode ter zero telefones.
   --------------------------------------------------------------------------- */

CREATE TABLE telefone_cliente (
    id_telefone INT IDENTITY(1,1) NOT NULL,
    id_cliente  INT               NOT NULL,
    nr_telefone VARCHAR(20)       NOT NULL,
    ds_tipo     VARCHAR(10)       NOT NULL,
    CONSTRAINT PK_telefone_cliente      PRIMARY KEY (id_telefone),
    CONSTRAINT FK_telefone_cliente_cli  FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente),
    CONSTRAINT UQ_telefone_cliente_nr   UNIQUE (id_cliente, nr_telefone),
    CONSTRAINT CK_telefone_cliente_tipo CHECK (ds_tipo IN ('fixo', 'celular', 'trabalho'))
);
GO

/* ---------------------------------------------------------------------------
   Ternario resolvido: o preco pertence ao par produto + tamanho
   --------------------------------------------------------------------------- */

CREATE TABLE tamanho (
    id_tamanho INT IDENTITY(1,1) NOT NULL,
    nm_tamanho VARCHAR(20)       NOT NULL,
    qt_fatias  TINYINT           NOT NULL,
    CONSTRAINT PK_tamanho    PRIMARY KEY (id_tamanho),
    CONSTRAINT UQ_tamanho_nm UNIQUE (nm_tamanho)
);
GO

CREATE TABLE produto_tamanho_preco (
    id_produto INT          NOT NULL,
    id_tamanho INT          NOT NULL,
    vl_preco   DECIMAL(8,2) NOT NULL,
    CONSTRAINT PK_produto_tamanho_preco PRIMARY KEY (id_produto, id_tamanho),
    CONSTRAINT FK_ptp_produto FOREIGN KEY (id_produto) REFERENCES produto (id_produto),
    CONSTRAINT FK_ptp_tamanho FOREIGN KEY (id_tamanho) REFERENCES tamanho (id_tamanho),
    CONSTRAINT CK_ptp_vl_preco CHECK (vl_preco > 0)
);
GO

/* ---------------------------------------------------------------------------
   BINA - identificacao de quem esta ligando.
   id_cliente NULL: a chamada e registrada antes de saber se o numero
   pertence a um cliente cadastrado.
   --------------------------------------------------------------------------- */

CREATE TABLE bina (
    id_bina    INT IDENTITY(1,1) NOT NULL,
    nr_origem  VARCHAR(20)       NOT NULL,
    dt_chamada DATETIME2(0)      NOT NULL
        CONSTRAINT DF_bina_dt_chamada DEFAULT SYSDATETIME(),
    id_cliente INT               NULL,
    CONSTRAINT PK_bina         PRIMARY KEY (id_bina),
    CONSTRAINT FK_bina_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
);
GO

PRINT '--- Carga de dados: sempre do lado "um" para o lado "muitos" ------';
GO

INSERT INTO cliente (nm_cliente)
VALUES ('Helena Duarte'), ('Rafael Nunes'), ('Vitor Camargo');
GO

INSERT INTO mesa (id_mesa, nr_lugares)
VALUES (7, 4), (8, 6);
GO

INSERT INTO telefone_cliente (id_cliente, nr_telefone, ds_tipo)
VALUES (1, '(11) 3555-1020',  'fixo'),
       (2, '(11) 3555-7788',  'fixo'),
       (2, '(11) 98877-1122', 'celular'),
       (3, '(11) 99444-3311', 'celular');
GO

INSERT INTO produto (nm_produto)
VALUES ('Pizza Calabresa'), ('Refrigerante 2L');
GO

INSERT INTO tamanho (nm_tamanho, qt_fatias)
VALUES ('Broto', 4), ('Familia', 8);
GO

INSERT INTO produto_tamanho_preco (id_produto, id_tamanho, vl_preco)
VALUES (1, 1, 32.00),
       (1, 2, 54.90);
GO

/* pedido 1: salao, com mesa. pedido 2: delivery, id_mesa NULL. */
INSERT INTO pedido (id_cliente, id_mesa) VALUES (1, 7);
INSERT INTO pedido (id_cliente, id_mesa) VALUES (2, NULL);
GO

INSERT INTO item_pedido (id_pedido, id_produto, qt_item, vl_unitario)
VALUES (1, 1, 2, 54.90),
       (1, 2, 1,  8.00),
       (2, 1, 1, 54.90);
GO

INSERT INTO entrega (id_pedido, nm_entregador, dt_saida)
VALUES (2, 'Douglas Ramos', SYSDATETIME());
GO

INSERT INTO funcionario (nm_funcionario, ds_cargo, id_supervisor)
VALUES ('Cleide Barros', 'Gerente', NULL);
GO

INSERT INTO funcionario (nm_funcionario, ds_cargo, id_supervisor)
VALUES ('Douglas Ramos', 'Entregador', 1),
       ('Marina Alves',  'Entregador', 1),
       ('Tiago Peixoto', 'Pizzaiolo',  1);
GO

INSERT INTO bina (nr_origem, id_cliente)
VALUES ('(11) 3555-1020',  1),
       ('(11) 97777-0000', NULL);
GO

PRINT '--- Consulta 1: participacao parcial visivel (LEFT JOIN) ----------';
GO

SELECT c.id_cliente,
       c.nm_cliente,
       COUNT(p.id_pedido) AS qt_pedidos
  FROM cliente AS c
  LEFT JOIN pedido AS p
         ON p.id_cliente = c.id_cliente
 GROUP BY c.id_cliente, c.nm_cliente
 ORDER BY qt_pedidos DESC, c.nm_cliente;
GO

PRINT '--- Consulta 2: hierarquia por auto-relacionamento ----------------';
GO

SELECT f.nm_funcionario AS funcionario,
       f.ds_cargo,
       s.nm_funcionario AS supervisor
  FROM funcionario AS f
  LEFT JOIN funcionario AS s
         ON s.id_funcionario = f.id_supervisor
 ORDER BY f.id_funcionario;
GO

PRINT '--- Consulta 3: o N:N resolvido ------------------------------------';
GO

SELECT p.id_pedido,
       c.nm_cliente,
       pr.nm_produto,
       i.qt_item,
       i.vl_unitario,
       i.qt_item * i.vl_unitario AS vl_total_item
  FROM pedido      AS p
  JOIN cliente     AS c  ON c.id_cliente  = p.id_cliente
  JOIN item_pedido AS i  ON i.id_pedido   = p.id_pedido
  JOIN produto     AS pr ON pr.id_produto = i.id_produto
 ORDER BY p.id_pedido, pr.nm_produto;
GO

PRINT '--- Erros de proposito: cada bloco abaixo DEVE falhar --------------';
GO

/* Msg 547 - o lado "muitos" nao existe sem o lado "um" */
BEGIN TRY
    INSERT INTO pedido (id_cliente, id_mesa) VALUES (999, NULL);
END TRY
BEGIN CATCH
    PRINT 'Esperado -> Msg ' + CAST(ERROR_NUMBER() AS VARCHAR(10)) + ': ' + ERROR_MESSAGE();
END CATCH
GO

/* Msg 515 - participacao total nao aceita NULL */
BEGIN TRY
    INSERT INTO pedido (id_cliente, id_mesa) VALUES (NULL, 7);
END TRY
BEGIN CATCH
    PRINT 'Esperado -> Msg ' + CAST(ERROR_NUMBER() AS VARCHAR(10)) + ': ' + ERROR_MESSAGE();
END CATCH
GO

/* Msg 2627 - a chave composta impede o mesmo produto duas vezes no pedido */
BEGIN TRY
    INSERT INTO item_pedido (id_pedido, id_produto, qt_item, vl_unitario)
    VALUES (1, 1, 1, 54.90);
END TRY
BEGIN CATCH
    PRINT 'Esperado -> Msg ' + CAST(ERROR_NUMBER() AS VARCHAR(10)) + ': ' + ERROR_MESSAGE();
END CATCH
GO

/* Msg 2627 - o 1:1 impede a segunda entrega do mesmo pedido */
BEGIN TRY
    INSERT INTO entrega (id_pedido, nm_entregador)
    VALUES (2, 'Marina Alves');
END TRY
BEGIN CATCH
    PRINT 'Esperado -> Msg ' + CAST(ERROR_NUMBER() AS VARCHAR(10)) + ': ' + ERROR_MESSAGE();
END CATCH
GO

/* Msg 547 - nao se apaga o lado "um" com filhos vivos */
BEGIN TRY
    DELETE FROM cliente WHERE id_cliente = 1;
END TRY
BEGIN CATCH
    PRINT 'Esperado -> Msg ' + CAST(ERROR_NUMBER() AS VARCHAR(10)) + ': ' + ERROR_MESSAGE();
END CATCH
GO

PRINT 'Laboratorio de cardinalidade pronto no banco MODELAGEM_UC10.';
PRINT 'Para limpar tudo: DROP DATABASE MODELAGEM_UC10;';
GO
