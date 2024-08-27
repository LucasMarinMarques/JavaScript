
class Table {

	constructor(oArgs){

		/* Table: registers */
		this.aoRow = [];
		this.nRow  = 100;
		this.iRow  = 1;
		/* Table: registers */

		this.sTableClassName = oArgs.className || "";
		this.sTableTagName   = oArgs.tagName   || "";

		/* Table: Params */
		this.aoCell = [
			{
			  label: "Código",
			  align: "center",
			  order: "asc",
			  fnRender: function(oRow){
				  return oRow.codigo;
			  }
			},
			{
			  label: "Descrição",
			  align: "left",
			  fnRender: function(oRow){
				  return oRow.descricao;
			  }
			},
			{
				  label: "Cor",
				  align: "left",
				  fnRender: function(oRow){
					  return oRow.cor;
				  }
			},
			{
				  label: "Tamanho",
				  align: "center",
				  fnRender: function(oRow){
					  return oRow.tamanho;
				  }
			},
			{
				  label: "Situação",
				  align: "left",
				  options: {
					0:"Cancelado",
					1:"Impresso",
					2:"Em Andamento",
					3:"Encerrado",
					4:"Atendido"
				  },
				  hidden:true,
				  fnRender: function(oRow){
					  return this.options[oRow.situacao];
				  }
			},
			{
			  label: "Data Fabricação",
			  align: "left",
			  hidden: false,
			  fnRender: function(oRow,sParam){

				  if(sParam == "fnOrder"){
					return oRow.dataFabricacao;
				  }

				  return new Date(oRow.dataFabricacao).toLocaleString();
			  }
			},
			{
				  label: "Fornecedor",
				  align: "left",
				  hidden: true,
				  fnRender: function(oRow){
					  return oRow.fornecedor.nome;
				  }
			}
		];
		/* Table: Params */


		/* table: Constructor */
		this.eTable = document.createElement("table");
		this.eTHead = this.eTable.createTHead();
		this.eTBody = this.eTable.createTBody();

		this.oRowSelected = new Map();
		this.bMultiple    = true;
		this.nStep        = 10;
		this.nPage        = 0;

		this.eSearch             = document.createElement("input");
		this.eSearch.placeholder = "Digite sua busca";
		this.eSearch.onkeyup     = this.fnSearch.bind(this);
		this.aoFiltered          = this.aoRow;

		/* table: step */
		this.eStep          = document.createElement("select");
		this.eStep.onchange = this.fnStep.bind(null,this);
		this.eStep.options.add((new Option(10)))
		this.eStep.options.add((new Option(25)))
		this.eStep.options.add((new Option(50)))
		

		this.eTableTools           = document.createElement("table");
		this.eTableTools.className = "table-tools";
		this.oRowTools             = this.eTableTools.insertRow();
		this.eCellSearch           = this.oRowTools.insertCell();
		this.eCellStep             = this.oRowTools.insertCell();
		
		this.eCellSearch.append(this.eSearch);
		this.eCellStep.append(this.eStep);


	}

	fnCreateTHead(){

		let oThis = this;

		let eRow = this.eTHead.insertRow();

		/* select */
		function fnInsertCellSelect(){

			let eCell     = eRow.insertCell();
			let eCheckbox = "<input type='checkbox'>";

			function fnEverySelected(oRow){

				let idRow = oThis.fnGetRowId(oRow);

				return oThis.oRowSelected.get(idRow);
			}

			let bSelectedAll = oThis.aoRow.every(fnEverySelected);

			if(bSelectedAll){
				eCheckbox = "<input type='checkbox' checked>";
			}

			eCell.innerHTML = eCheckbox;
			eCell.align     = "center";
			eCell.className = "select blank";
			eCell.hidden    = false;

			function fnRowSelectAll(){

				let bSelected = this.firstChild.checked;

				if(bSelected){

					function fnSetSelected(oRow){

						let idRow = oThis.fnGetRowId(oRow);

						oThis.oRowSelected.set(idRow,oRow);
					}

					oThis.aoRow.forEach(fnSetSelected);

				}else{
					oThis.oRowSelected.clear();
				}

				oThis.fnBuild(oThis.aoRow);

			}

			eCell.addEventListener("click", fnRowSelectAll);

		}


		fnInsertCellSelect();
		/* select */

		function fnInsertCellBlank(width="1%"){

			let eCell = eRow.insertCell();

			eCell.innerHTML = "";
			eCell.align     = "center";
			eCell.className = "blank";
			eCell.hidden    = false;
			eCell.width     = width;

		}

		["responsivo"].forEach(fnInsertCellBlank);


		function fnInsertCell(oCell,iCell){

			let eCell = eRow.insertCell();

			eCell.innerHTML = oCell.label;
			eCell.align     = oCell.align;
			eCell.className = oCell.order;
			eCell.hidden    = oCell.hidden;
			eCell.width     = "1%";

			/* table: order */
			function fnOrder(oCellEvent){

				let sOrder = oCellEvent.order;

				/* Sinalizar */
				function fnRemoveCellOrder(oCell){
					delete oCell.order;
				}

				oThis.aoCell.forEach(fnRemoveCellOrder);

				oCellEvent.order = sOrder == "asc" ? "desc" : "asc";
				/* Sinalizar */

				/* Ordernar */
				function fnCompare(oRowCompare,oRowCurrent){

					let Compare = oCellEvent.fnRender(oRowCompare,"fnOrder");
					let Current = oCellEvent.fnRender(oRowCurrent,"fnOrder");

					return Compare < Current ? -1 : 1;

				}

				oThis.aoRow = oThis.aoRow.sort(fnCompare);

				if(oCellEvent.order == "desc"){
					oThis.aoRow = oThis.aoRow.reverse();
				}
				/* Ordernar */


				oThis.fnBuild(oThis.aoRow);

			}
			/* table: order */

			eCell.addEventListener("click", fnOrder.bind(null,oCell))

		}

		this.aoCell.forEach(fnInsertCell);

		//fnInsertCellBlank("100%")

	}



	fnGetRowId(oRow){

		function fnMapCellValue(oCell){
			return oCell.fnRender(oRow);
		}

		return this.aoCell.map(fnMapCellValue).join("");

	}

	fnCreateRow(oThis,oRow){

		let eTBody         = oThis.eTBody;
		let eRow           = eTBody.insertRow();
		let eRowResponsive = eTBody.insertRow();
			eRowResponsive.className = "row-responsive";
			eRowResponsive.hidden    = true;


		let idRow = oThis.fnGetRowId(oRow);

		/* select */
		function fnInsertCellSelect(){

			let eCell = eRow.insertCell();

			let eCheckbox = "<input type='checkbox'>";

			if(oThis.oRowSelected.has(idRow)){
				eCheckbox = "<input type='checkbox' checked>";
			}

			eCell.innerHTML = eCheckbox;
			eCell.align     = "center";
			eCell.className = "select";
			eCell.hidden    = false;

			function fnRowSelect(oRow){

				let bSelected = this.firstChild.checked;
				let idRow     = oThis.fnGetRowId(oRow);

				if(!oThis.bMultiple){
					oThis.oRowSelected.clear();
				}

				if(bSelected){
					oThis.oRowSelected.set(idRow,oRow);
				}else{
					oThis.oRowSelected.delete(idRow);
				}

				oThis.fnBuild(oThis.aoRow);

			}


			eCell.addEventListener("click", fnRowSelect.bind(eCell,oRow));

		}

		fnInsertCellSelect();
		/* select */


		/* Responsivo */
		function fnExpand(eRowResponsive){

			let eCell = this;

			eCell.classList.toggle("expand");

			eRowResponsive.hidden = !eRowResponsive.hidden;

		}

		function fnInsertCellResponsive(){

			let eCell = eRow.insertCell();

			eCell.innerHTML = "";
			eCell.align     = "center";
			eCell.className = "responsive";
			eCell.hidden    = false;

			eCell.addEventListener("click", fnExpand.bind(eCell,eRowResponsive));

		}

		fnInsertCellResponsive();
		/* Responsivo */


		let aoCellVisible = oThis.aoCell.filter(oCell => !oCell.hidden);
		let aoCellHidden  = oThis.aoCell.filter(oCell =>  oCell.hidden);


		function fnInsertCell(oCell,iCell,aCell){

			let eCell = eRow.insertCell();

			eCell.innerHTML = oCell.fnRender(oRow);
			eCell.align     = oCell.align;
			eCell.hidden    = oCell.hidden;
			eCell.width     = (iCell == (aCell.length - 1)) ? "100%" : "1%";

		}

		aoCellVisible.forEach(fnInsertCell);


		let eCellResponsive = eRowResponsive.insertCell();
			eCellResponsive.colSpan = (aoCellVisible.length + 2);


		let eTableExpand = document.createElement("table");
			eTableExpand.className = "table-expand"

		eCellResponsive.append(eTableExpand);

		function fnInsertCellExpand(oCell,iCell,aCell){

			let eRowExpand = eTableExpand.insertRow();
			let eCellLabel = eRowExpand.insertCell();
			let eCellValue = eRowExpand.insertCell();

			eCellLabel.innerHTML = oCell.label;
			eCellLabel.width     = "1%";

			eCellValue.innerHTML = oCell.fnRender(oRow);
			eCellValue.width     = "100%";

		}


		aoCellHidden.forEach(fnInsertCellExpand);



	}


	/* table: select */
	/* importante: A seleção dos registros não pode recarregar os dados em tela */





	/* table: select */






	/* table: paging */
	fnCreatePaging(){

		let oRowPaging         = this.eTHead.insertRow();
		let oCellPagingInfo    = oRowPaging.insertCell();
		let oCellPagingButtons = oRowPaging.insertCell();

		oRowPaging.className         = "table-paging";
		oCellPagingInfo.className    = "info";
		oCellPagingButtons.className = "buttons";
		oCellPagingInfo.colSpan      = (this.aoCell.filter(oCell => !oCell.hidden)).length + 1;

	}

	fnPaging(aoRow=[]){

		let oThis          = this;
		let nStep          = oThis.nStep;
		let nPage          = oThis.nPage;
		let nTotalElements = aoRow.length;
		let nTotalPages    = Math.ceil(((nTotalElements / nStep)-1));
		let bFirst         = (nPage == 0);
		let bLast          = (nTotalPages == nPage);
		let nInit          = ((nStep * nPage) + 1);
		let nLimit         = bLast ? nTotalElements : ((nStep * nPage) + nStep);
		let nIndex         = (nInit - 1);

		let eInfo = document.querySelector("td.info");

		eInfo.innerHTML = "Mostrando de "+nInit+" até "+nLimit+" de "+nTotalElements+" registros.";


		let eButtons = document.querySelector("td.buttons");


		let aoButtons = [
			{
			  "bind": "Primeira",
			  "page": 0,
			  "disabled": (nPage == 0)
			},
			{
			  "bind": "Anterior",
			  "page": (nPage-1),
			  "hidden": false,
			  "disabled": (nPage-1) < 0
			},
			{
			  "bind": 1,
			  "page": 0,
			  "hidden": (nPage == 0)
			},
			{
			  "bind": "...",
			  "page": nPage,
			  "disabled": true,
			  "hidden": (nPage-5) <= 0
			},
			{
			  "bind": (nPage-3),
			  "page": (nPage-4),
			  "hidden": (nPage-4) <= 0
			},
			{
			  "bind": (nPage-2),
			  "page": (nPage-3),
			  "hidden": (nPage-3) <= 0
			},
			{
			  "bind": (nPage-1),
			  "page": (nPage-2),
			  "hidden": (nPage-2) <= 0
			},
			{
			  "bind": (nPage),
			  "page": (nPage-1),
			  "hidden": (nPage-1) <= 0
			},
			{
			  "bind": (nPage+1),
			  "page": (nPage),
			  "class": "selected",
			  "hidden": false
			},
			{
			  "bind": (nPage+2),
			  "page": (nPage+1),
			  "hidden": (nPage+1) >= nTotalPages
			},
			{
			  "bind": (nPage+3),
			  "page": (nPage+2),
			  "hidden": (nPage+2) >= nTotalPages
			},
			{
			  "bind": (nPage+4),
			  "page": (nPage+3),
			  "hidden": (nPage+3) >= nTotalPages
			},
			{
			  "bind": (nPage+5),
			  "page": (nPage+6),
			  "hidden": (nPage+6) >= nTotalPages
			},
			{
			  "bind": "...",
			  "page": nPage,
			  "disabled": true,
			  "hidden": (nPage+4) >= nTotalPages
			},
			{
			  "bind": nTotalPages+1,
			  "page": nTotalPages,
			  "hidden": bLast
			},
			{
			  "bind": "Próxima",
			  "page": (nPage + 1),
			  "hidden": false,
			  "disabled": (nPage+1) > nTotalPages
			},
			{
			  "bind": "Última",
			  "page": nTotalPages,
			  "hidden": false,
			  "disabled": (nPage == nTotalPages)
			}
		];

		function fnAddButton(oButton){

			let eButton;

			eButton = document.createElement("button")
			eButton.innerHTML = oButton.bind;
			eButton.className = oButton.class;
			eButton.hidden    = oButton.hidden;
			eButton.disabled  = oButton.disabled;
			eButton.addEventListener("click",function(){
				oThis.nPage = oButton.page;
				oThis.fnBuild(aoRow);
			})

			eButtons.append(eButton);

		}

		eButtons.innerHTML = "";

		aoButtons.forEach(fnAddButton);

		let aoRowPage =  aoRow.filter((oRow,iRow) => iRow >= nIndex && iRow < nLimit );

		return aoRowPage;

	}
	/* table: paging */



	/* table: search */
	fnSearch(event){

	   let oThis   = this;
	   let sSearch = event.target.value;

	   oThis.aoFiltered = oThis.aoRow;

	   if(sSearch){

			let asSearch = (sSearch.toUpperCase()).split(" ");

			function fnFind(oRow){

				function fnMap(oCell){
					return oCell.fnRender(oRow);
				}

				let sCellValues = oThis.aoCell.map(fnMap).join("").toUpperCase();

				return asSearch.every(sSearch => (sCellValues).includes(sSearch));

			}

			oThis.aoFiltered = oThis.aoRow.filter(fnFind);

	   }

	   oThis.fnBuild(oThis.aoFiltered);

	}
	/* table: search */




	fnStep(oThis,eStep){

	   oThis.nStep = parseInt(eStep.target.value);

	   oThis.fnBuild(oThis.aoFiltered);

	}
	/* table: step */


	fnSetData(aoRow){
		this.aoRow = aoRow;
		this.aoFiltered = aoRow;
		this.fnBuild(aoRow);
	}


	/* table: build */
	fnBuild(aoRow){
		
		let oThis   = this;
		let eReplace = document.getElementsByTagName(oThis.sTableTagName)[0];

		if(eReplace){
			
			oThis.eTable.className = oThis.sTableClassName;

			eReplace.after(oThis.eTable);
			eReplace.after(oThis.eTableTools);
			eReplace.remove()
			
		}	

		this.eTHead.innerHTML = "";
		this.eTBody.innerHTML = "";

		this.fnCreatePaging();

		this.fnCreateTHead();

		let aoRowPage = this.fnPaging(aoRow);

		aoRowPage.forEach(this.fnCreateRow.bind(null,this));

	}
	/* table: build */


}


export default Table



