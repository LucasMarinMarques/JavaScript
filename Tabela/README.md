# Índice 

* [Module](#Module)
* [Worker](#Worker)

# Descrição do projeto

### Objetivos    

Apresentar um componente em  **JavasSript** declarando uma **classe** e definindo os membros da classe, como o métodos e o construtor. 

Apresentar o mecanismo **Worker** que permitem que uma operação de um dado script seja executado em segundo plano. 

Apresentar a utilização do **Module** que permite organizarmos melhor o projeto.

### Padronização do código para os tipos de variáveis: 

*  s   - String 
*  n   - Número
*  b   - Booleano
*  a   - Array
*  o   - Objeto
*  fn  - Função

# Module

Os módulos são importados de arquivos externos com a instrução **import**;

O arquivo javascript que recebe a instrução import precisa ser difinido 
com o atributo type module exemplo: script **type="module"** src="main.js";

Os módulos funcionam apenas com protocolo HTTP(s).


    import Table from "./table-class.js";  

    let oTable = new Table({
        "tagName"  : "table-produtos",
        "className": "table"
    });



## Worker

Este é um mecanismo que executa um dado JavaScript em segundo plano, sem afetar o desempenho da página.

Os trabalhadores funcionam apenas com o protocolo HTTP(s).

    let oTableWorker = new Worker("table-worker.js");

    oTableWorker.postMessage({
        "nRow": 100
    })

    oTableWorker.onmessage = function(event){
        
        let aoRow = event.data;

        oTable.fnSetData(aoRow);

    }


# Autor

<img loading="lazy" src="https://avatars.githubusercontent.com/u/8208696?v=4" width=115><br><sub>Lucas Marin Marques</sub>