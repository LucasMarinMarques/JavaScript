/*  

# Module

Os módulos são importados de arquivos externos com a import instrução;

O arquivo javascript que recebe a instrução import precisa ser difinido 
com o atributo type module exemplo: <script type="module" src="main.js">;

Os módulos funcionam apenas com protocolo HTTP(s).

*/

import Table from "./table-class.js";  

let oTable = new Table({
    "tagName"  : "table-produtos",
    "className": "table"
});



/*

# Worker

Este é um mecanismo JavaScript executa em segundo plano, sem afetar o desempenho da página.

Os trabalhadores funcionam apenas com o protocolo HTTP(s).

*/

let oTableWorker = new Worker("table-worker.js");

oTableWorker.postMessage({
  "nRow": 100
})

oTableWorker.onmessage = function(event){
	
  let aoRow = event.data;

	oTable.fnSetData(aoRow);

}


