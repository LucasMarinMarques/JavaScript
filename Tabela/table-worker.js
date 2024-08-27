let aoRow = [];

function fnGenerateValues(oPaging){

	/* Table: registers */
	let nRow  = oPaging.nRow;
	let iRow  = 1; 

	function fnBuild(){

		let anTamanho    = [34, 36, 38, 40, 42, 44, 46, 48];
		let asCor        = ["Azul", "Preto", "Branco", "Verde"];
		let asDescricao  = ["Camiseta", "Calça", "Bermuda"];
		let anSituacao   = [0, 1, 2, 3, 4];
		let asFornecedor = ["Polo Wear","homem.com","Yonders"];

		function fnRandom (aValue) {

			let nRandom = Math.random();
				nRandom = nRandom * aValue.length;
				nRandom = Math.floor(nRandom);

			return aValue[nRandom];

		}

		for(iRow; iRow <= nRow; iRow++){

			let timeStamp =  Math.floor(Date.now() - (Math.random() * 10000000000));

			let oRow = {
				"codigo": iRow,
				"descricao": fnRandom(asDescricao),
				"cor": fnRandom(asCor),
				"tamanho": fnRandom(anTamanho),
				"situacao": fnRandom(anSituacao),
				"dataFabricacao": timeStamp,
				"fornecedor":{
					"nome": fnRandom(asFornecedor)
				}
			}

			aoRow.push(oRow);
		}

	}

	fnBuild();

	postMessage(aoRow);

}
/* Table: registers */

onmessage = function(event){
	fnGenerateValues(event.data);
}


