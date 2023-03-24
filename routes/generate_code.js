const express = require('express');
const JavaGenerate = require('../service/JavaGenerate');
const router = express.Router();
const capitalizeFirstLetter = require('../util/capitalize');

const { JavaModelTemplate } = require('../templates/JavaModelTemplate');
const { JavaRepositoryTemplate } = require('../templates/JavaRepositoryTemplate');
const { JavaServiceTemplate } = require('../templates/JavaServiceTemplate');
const { JavaControllerTemplate } = require('../templates/JavaControllerTemplate');

const pool = require('../postgresql').pool;

router.get('/', async (req, res, next) => {
  try {
    const tables = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    
    // PERCORRE TODAS AS TABELAS DO BANCO DE DADOS
    for (let i = 0; i < tables.rows.length; i++) {
      const tableName = tables.rows[i]['tablename'];
      // PREPARA O NOME DA TABELA COM CAPITALIZE PARA SER O NOME DA CLASSE (Ex: CategoriaProduto)
      var tableSplitted = tableName.split("_");
      var className;
      if (tableSplitted.length > 0) {
        tableSplitted = tableSplitted.map(function(el){ return capitalizeFirstLetter(el); });
        className = tableSplitted.join('');
      } else {
        className = capitalizeFirstLetter(tableName);
      }

      // INSTANCIA O GERADOR DO JAVA
      const java = new JavaGenerate();

      // INSTANCIA AS VIEWS DO MUSTACHE
      const JavaModelMustacheView = {
        "tableName": tableName,
        "className": className,
        "hasBigDecimal": false,
        "hasLocalDateTime": false,
        "columns": [],
      };
      const JavaRepositoryMustacheView = {
        "className": className,
      };
      const JavaServiceMustacheView = {
        "className": className,
      };
      const JavaControllerMustacheView = {
        "tableName": tableName,
        "className": className
      };

      const columns = await pool.query(`SELECT 
                                          column_name,
                                          data_type as column_type,
                                          character_maximum_length as column_size,
                                          is_nullable,
                                          column_default
                                        FROM INFORMATION_SCHEMA.COLUMNS
                                        WHERE TABLE_NAME = '` + tableName + `'`);
      
      // PERCORRE TODAS AS COLUNAS DESSA TABELA NO BANCO DE DADOS
      for (let c = 0; c < columns.rows.length; c++) {
        const column = columns.rows[c];
        // PREPARA O NOME DA COLUNA COM CAPITALIZE PARA SER O NOME DA PROPRIEDADE (Ex: idCategoriaProduto)
        var columnSplitted = column.column_name.split("_");
        var columnNamePrepared;
        if (columnSplitted.length > 0) {
          columnSplitted = columnSplitted.map(function(el){ return capitalizeFirstLetter(el); });
          columnNamePrepared = columnSplitted.join('');
          columnNamePrepared = columnNamePrepared.charAt(0).toLowerCase() + columnNamePrepared.slice(1);
        } else {
          columnNamePrepared = column.column_name;
        }

        // Valida se há campos customizados, pois é preciso realizar o import, caso haja
        var columnType = getValidColumnType(column.column_type);
        if (columnType == 'BigDecimal') {
          JavaModelMustacheView.hasBigDecimal = true;
        }

        if (columnType == 'LocalDateTime') {
          JavaModelMustacheView.hasLocalDateTime = true;
        }

        // CONSTROI A VIEW A SER DIRECIONADA PARA O MUSTACHE
        JavaModelMustacheView.columns.push({
          "primaryKey": column.column_default == "nextval('" + tableName + "_id_seq'::regclass)",
          "columnName": column.column_name,
          "columnAttributeName": columnNamePrepared,
          "columnType": columnType,
          "columnSize": column.column_size,
          "notNull": column.is_nullable == 'NO'
        });
      }

      // GERA E SALVA OS CÓDIGOS
      java.GenerateFile(JavaModelMustacheView, JavaModelTemplate, 'model');
      java.GenerateFile(JavaRepositoryMustacheView, JavaRepositoryTemplate, 'repository');
      java.GenerateFile(JavaServiceMustacheView, JavaServiceTemplate, 'service');
      java.GenerateFile(JavaControllerMustacheView, JavaControllerTemplate, 'controller');
    }

    res.status(200).send('Código gerado com sucesso!');
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.get('/table/:table_name', (req, res, next) => {
  const table_name = req.params.table_name;
  res.status(200).send({
    mensagem: 'Usando o GET dentro da rota',
    tabela: table_name
  });
});

function getValidColumnType(type) {
  if (type.includes('timestamp')) {
    return 'LocalDateTime';
  }

  switch (type) {
    case 'character varying':
      return 'String';
      case 'text':
        return 'String';
    case 'numeric':
      return 'BigDecimal';
    default:
      return capitalizeFirstLetter(type);
  }
}

module.exports = router;