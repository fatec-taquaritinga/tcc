//MATHML

function criarPPL(problema){
	var mathml = montaMathML(problema.funcaoObjetivo);
	$("div#inicial div.problema").append(mathml);
	$("div#inicial div.problema").append("<br /><math><mtext mathsize='normal' class='sujeito'>Sujeito a</mtext></math><br />");
		
	for (var i = 1; i<=problema.restricoes.length; i++){ //MathML Restri��es
		mathml = montaMathML(problema.restricoes[i-1],'rest');
		$("div#inicial div.problema").append("<span>"+mathml+"</span><br />");
	}
	mathml = naoNeg(problema.funcaoObjetivo.funcao.variaveis);
	$("div#inicial div.problema").append(mathml);
}

function montaMathML(funcao, local){
	
	var vars = funcao.funcao.variaveis.length;
	var numCoef = funcao.funcao.coeficientes.length;

	var mathml;
	
	for(var i = 1; i<=vars; i++){

		if (i==1){
			if (local=='dicionario' || local=='recalculo' || local =='rec'){
				var x = funcao.variavel;
				var frac = toFrac(roundSigDig(funcao.funcao.constante,15) , 1000, .000000001);
				var check = checkString(frac,"/",true);  //verificar se � uma fra��o
				mathml = '<math><msub><mi>'+x.charAt(0)+'</mi><mn>'+x.charAt(1)+'</mn></msub><mo>=</mo>';
				if (check > 0) {
					mathml += '<mfrac><mn>'+frac.substring(0,check)+'</mn><mn>'+frac.substring(check+1, frac.length)+'</mn></mfrac>';
				} else {
					mathml += '<mn>'+funcao.funcao.constante+'</mn>';
				}
			}else if(local!='rest' && local!='rec2'){
				mathml = '<math><mi>Z</mi><mo>=</mo>';
				if (funcao.funcao.constante != null){
					var frac = toFrac(roundSigDig(funcao.funcao.constante,15) , 1000, .000000001);
					var check = checkString(frac,"/",true);  //verificar se � uma fra��o
					if (check > 0) {
						mathml += '<mfrac><mn>'+frac.substring(0,check)+'</mn><mn>'+frac.substring(check+1, frac.length)+'</mn></mfrac>';
					} else {
						mathml += '<mn>'+funcao.funcao.constante+'</mn>';
					}
				}
			}else if (local == 'rec2'){
				if (funcao.funcao.constante != null){
					var frac = funcao.funcao.constante;
					var check = checkString(frac,"/",true);  //verificar se � uma fra��o
					if (check > 0) {
						mathml = '<mfrac><mn>'+frac.substring(0,check)+'</mn><mn>'+frac.substring(check+1, frac.length)+'</mn></mfrac>';
					} else {
						mathml = '<mn>'+funcao.funcao.constante+'</mn>';
					}
				}
			}else{
				mathml = '<math>';
			}
			
			if(local == 'rec2'){
				var frac = funcao.funcao.coeficientes[i-1];
			} else {
				var frac = toFrac(roundSigDig(funcao.funcao.coeficientes[i-1],15) , 1000, .000000001);
			}
			var check = checkString(frac,"/",true);  //verificar se � uma fra��o
			var sinal = frac.toString().charAt(0);	 //verificar se � negativo
			var elemento = "elemento"+i+"";
			
			if (check > 0){ //fra��o
				var fracao = {numerador: "", denominador: ""};
				fracao.denominador = frac.substring(check+1, frac.length);

				if (sinal == "-") { //fra��o negativa
					fracao.numerador = frac.substring(1,check);
					mathml += '<mo>-</mo>';
				}else{ //frqacao positiva
					fracao.numerador = frac.substring(0,check)
					mathml += '<mo>+</mo>';
				}
				mathml += '<mfrac><mn>'+fracao.numerador+'</mn><mn>'+fracao.denominador+'</mn></mfrac>';
			}else { //inteiro*/	
				if (sinal == "-"){
					mathml += '<mo>-</mo>';
					if(funcao.funcao.coeficientes[i-1] != "-1"){
						mathml += '<mn>'+funcao.funcao.coeficientes[i-1].toString().substring(1,funcao.funcao.coeficientes[i-1].lengh)+'</mn>';
					}
				}else{
					if (local=='dicionario'){ 
						mathml += '<mo>+</mo>'
					}
					if(funcao.funcao.coeficientes[i-1] != "1"){
						mathml += '<mn>'+funcao.funcao.coeficientes[i-1]+'</mn>'
					}
				}
			}
			mathml += '<msub><mi>'+funcao.funcao.variaveis[i-1].charAt(0)+'</mi><mn>'+funcao.funcao.variaveis[i-1].charAt(1)+'</mn></msub>';
		}else{ // DEMAIS ELEMENTOS DA EQUACAO
			
			if(local == 'rec2'){
				var frac = funcao.funcao.coeficientes[i-1];
			} else {
				var frac = toFrac(roundSigDig(funcao.funcao.coeficientes[i-1],15) , 1000, .000000001);
			}
			
			//var frac = toFrac (roundSigDig(funcao.funcao.coeficientes[i-1],15) , 1000, .000000001);
			var check = checkString(frac,"/",true);  //verificar se � uma fra��o
			var sinal = frac.toString().charAt(0);	 //verificar se � negativo
			var elemento = "elemento"+i+"";
		
			if (check > 0){ //SE FOR UMA FRACAO
				var fracao = {numerador: "", denominador: ""};
				fracao.denominador = frac.substring(check+1, frac.length);
				
				if (sinal == "-") { // SE FOR FRACAO NEGATIVA, ACRESCENTA O SINAL DE NEGATIVO ANTES DO COEFICIENTE
					fracao.numerador = frac.substring(1,check);
					mathml += '<mo>-</mo>';
					//$("#"+local+" > math > mrow > mrow:nth-child("+i+") > mo:first-child").text("-");
				}else{ // SE  FOR FRACAO POSITIVA, ACRESCENTA O SINAL DE POSITIVO ANTES DO COEFICIENTE
					fracao.numerador = frac.substring(0,check)
					mathml += '<mo>+</mo>';
				}
				mathml += '<mfrac><mn>'+fracao.numerador+'</mn><mn>'+fracao.denominador+'</mn></mfrac>';
			}
			else { //SE FOR UM NUMERO INTEIRO
				if (sinal == "-"){ // SE FOR UM NUMERO INTEIRO NEGATIVO, ACRESCENTA O SINAL DE NEGATIVO
					mathml += '<mo>-</mo>';

					if(funcao.funcao.coeficientes[i-1] != "-1" ){ // SE FOR UM NUMERO INTEIRO NEGATIVO = -1 OMITE O COEFICIENTE
						mathml += '<mn>'+funcao.funcao.coeficientes[i-1].toString().substring(1,funcao.funcao.coeficientes[i-1].lengh)+'</mn>';
					}
					
				}else{ // SE FOR UM NUMERO INTEIRO POSITIVO APRESENTA O SINAL DE POSITIVO
					mathml += '<mo>+</mo>';

					if(funcao.funcao.coeficientes[i-1] != "1"){ // SE FOR UM NUMERO INTEIRO POSITIVO = 1 OMITE O COEFICIENTE
						mathml += '<mn>'+funcao.funcao.coeficientes[i-1]+'</mn>';
					}
				}
			}
			mathml += '<msub><mi>'+funcao.funcao.variaveis[i-1].charAt(0)+'</mi><mn>'+funcao.funcao.variaveis[i-1].charAt(1)+'</mn></msub>';
			
		}
		
	} //for
	
	var lte = funcao.ineq;
	
	if(lte == "lte"){
		mathml += '<mo>&le;</mo>';
		mathml += '<mn>'+funcao.constante+'</mn>';
	}
	mathml += '</math>';
	return (mathml);	
}//function

function naoNeg(vars) {
	var mathml = '<math>';
	for (var i = 0; i<vars.length; i++) {
		mathml += '<msub><mi>'+vars[i].charAt(0)+'</mi><mn>'+vars[i].charAt(1)+'</mn></msub>';
		if (i != vars.length - 1) {
			mathml += '<mo>,</mo>';
		}
	}
	mathml += '<mo>&ge;</mo><mn>0</mn></math>';
	return mathml;
}

function criarMathDic(dicionario,iteracao){
	
	for (var i = 1; i<=dicionario.funcaoFolga.length; i++){ //MathML base
		var mathml = montaMathML (dicionario.funcaoFolga[i-1], 'dicionario');
		if(iteracao == 0){
			$('#inicial .dicionario').append('<span>'+mathml+'</span><br />');
		} else {
			$('#it'+iteracao+' .dicionario').append('<span>'+mathml+'</span><br />');
		}
	}
	
	// Restri��es de n�o negatividade
	mathml = naoNeg(dicionario.restricoesNn);
	if(iteracao == 0){
		$("div#inicial div.dicionario").append('<span>'+mathml+'</span><br />');
	} else {
		$('#it'+iteracao+' .dicionario').append('<span>'+mathml+'</span><br />');
	}
	//funcao objetivo
	mathml = montaMathML(dicionario.funcaoObjetivo, 'fo');
	if(iteracao == 0){
		$("div#inicial div.dicionario").append('<br /><span>'+mathml+'</span><br />');
	} else {
		$('#it'+iteracao+' .dicionario').append('<br /><span>'+mathml+'</span><br />');
	}
	
	//conjunto solucao
	mathml = mathml_conjunto_solucao (dicionario.getSolucao());
	if(iteracao == 0){
		$("div#inicial div.dicionario").append('<br /><span>'+mathml+'</span><br />');
	} else {
		$('#it'+iteracao+' .dicionario').append('<br /><span>'+mathml+'</span><br />');
	}
	
	// Z m�ximo
	mathml = mathml_z_max(dicionario.maxZ);
	if(iteracao == 0){
		$("div#inicial div.dicionario").append('<br /><span>'+mathml+'</span><br />');
	} else {
		$('#it'+iteracao+' .dicionario').append('<br /><span>'+mathml+'</span><br />');
	}
}

function mathml_conjunto_solucao(solucao){
	var mathml = '<math><mi>S</mi><mo>=</mo><mfenced open="{" close="}" separators=",">';
	
	for (var i = 1; i<=solucao.length; i++) {
		var num = toFrac(roundSigDig(solucao[i-1],15) , 1000, .000000001);
		var check = checkString(num,"/",true);
		
		if (check > 0) {
			mathml += '<mfrac><mn>'+num.toString().substring(0,check)+'</mn><mn>'+num.toString().substring(check+1, num.lengh)+'</mn></mfrac>';
		} else {
			mathml += '<mn>'+num+'</mn>';
		}
	}
	mathml += '</mfenced></math>';
	return mathml;
}

function mathml_z_max(z){
	z = toFrac(roundSigDig(z,15) , 1000, .000000001);
	var check = checkString(z,"/",true);
	var mathml = '<math><mtext class="sujeito">Max</mtext><mspace width="5px"/><mi>Z</mi><mo>=</mo>';
	if (check > 0) {
		mathml += '<mfrac><mn>'+z.toString().substring(0,check)+'</mn><mn>'+z.toString().substring(check+1, z.lengh)+'</mn></mfrac>';
	} else {
		mathml += '<mn>'+z+'</mn>';
	}
	mathml += '</math>';
	return mathml;
}

/*function criarRecalculo(){
	var funcao = arguments[0];
	var iteracao = arguments[1];
	//console.log(funcao);
	var local = 'recalculo';
	var mathml = montaMathML(funcao, local);
	$('#it'+iteracao+' .recalculo').append('<span>'+mathml+'</span><br />');
}*/

function montaMatmlRecalculoPrincipal(){
	var funcao = arguments[0];
	var mathml = montaMathML(funcao,'rec');
	console.log(mathml);
	console.log('---------------');
}

function montaMatmlRecalculoDemais(){
	//this,index,subx,coef
	var funcao = arguments[0];
	var inCoef = arguments[1];
	var mathml;
	var aux = new Folga();
	
	//VERIFICAR SE O COEF DA VARIAVEL QUE ENTRA � UMA FRA��O
	var frac = toFrac(roundSigDig(inCoef,15) , 1000, .000000001);
	var check = checkString(frac,"/",true);  //verificar se � uma fra��o
	mathml = '<math><mn>'+frac+'<mn><msub><mi>'+funcao.variavel.charAt(0)+'</mi><mn>'+funcao.variavel.charAt(1)+'</mn></msub><mo>=</mo>';
	
	mathml += montaMathML(funcao, 'rec2');
	console.log(mathml);
	//PRINTA O MATHML NA TELA
	
	if(inCoef != 1 && inCoef !=0){
		for(var i=0;i<funcao.funcao.variaveis.length;i++){
			aux.funcao.coeficientes[i] = funcao.funcao.coeficientes[i] +'/'+ inCoef;
			aux.funcao.variaveis[i] = funcao.funcao.variaveis[i];
		}
		aux.funcao.constante = funcao.funcao.constante +'/'+ inCoef;
		aux.variavel = funcao.variavel;
	}
	//mathml = '<math><msub><mi>'+aux.variavel.charAt(0)+'</mi><mn>'+aux.variavel.charAt(1)+'</mn></msub><mo>=</mo>';
	mathml = montaMathML(aux, 'rec2');
	console.log(mathml);
}

function mathmlRecalculo(){
	
	switch(arguments[1]){
		case 'inicial':
			var funcao = arguments[0];
			var mathml = montaMathML(funcao,'rec');
			console.log(mathml);
		break;
		case 'manip':
			var funcao = arguments[0];
			var indice = arguments[2];
			var funcaop1 = new Folga();
			var funcaop2 = new Folga();
			var funcaop3 = new Folga();
			
			for(var i = 0; i<funcao.funcao.coeficientes.length; i++){
				if(i==indice){
					for (var j=0;funcao.funcao.variaveis[i].length;j++) {
						funcaop2.funcao.variaveis[i] = funcao.funcao.variaveis[i][j];
						funcaop1.funcao.coeficientes[i] = funcao.funcao.coeficientes[i][j];
						//break;
					}
				}else{
					funcaop1.funcao.variaveis[i] = funcao.funcao.variaveis[i];
					funcaop1.funcao.coeficientes[i] = funcao.funcao.coeficientes[i];
				}
			}
			funcaop1.funcao.variaveis.splice(indice,1);
			funcaop1.funcao.coeficientes.splice();
			this.funcao.variaveis.splice(index,1,subvars);
			this.funcao.coeficientes.splice(index+1,0,subcoefs);
			
			var mathml = montaMathML(funcao,'rec');
			console.log(mathml);
		break;
		default:
			var funcao = arguments[0];
			var inCoef = arguments[1];
			var mathml;
			var aux = new Folga();
			
			/****** PASSANDO O ELEMENTO QUE ENTRA E O QUE SAI *****/
			//VERIFICAR SE O COEF DA VARIAVEL QUE ENTRA � UMA FRA��O
			var frac = toFrac(roundSigDig(inCoef,15) , 1000, .000000001);
			var check = checkString(frac,"/",true);  //verificar se � uma fra��o
			mathml = '<math><mn>'+frac+'<mn><msub><mi>'+funcao.variavel.charAt(0)+'</mi><mn>'+funcao.variavel.charAt(1)+'</mn></msub><mo>=</mo>';
			
			mathml += montaMathML(funcao, 'rec2');
			console.log(mathml);
			//PRINTA O MATHML NA TELA
			/**************************************************/
			
			/****** PASSANDO O COEFICIENTE PARA A DIVIS�O *****/
			if(inCoef != 1 && inCoef !=0){
				for(var i=0;i<funcao.funcao.variaveis.length;i++){
					aux.funcao.coeficientes[i] = funcao.funcao.coeficientes[i] +'/'+ inCoef;
					aux.funcao.variaveis[i] = funcao.funcao.variaveis[i];
				}
				aux.funcao.constante = funcao.funcao.constante +'/'+ inCoef;
				aux.variavel = funcao.variavel;
			}
			mathml = '<math><msub><mi>'+aux.variavel.charAt(0)+'</mi><mn>'+aux.variavel.charAt(1)+'</mn></msub><mo>=</mo>';
			mathml += montaMathML(aux, 'rec2');
			console.log(mathml);
			/**************************************************/
	}

}