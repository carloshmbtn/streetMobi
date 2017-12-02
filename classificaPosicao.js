/*
	http://www.mappingsupport.com/p/gmap4.php?ll=27.717297%2C7.832677&t=t1&z=2&coord=utm

	http://www.rcn.montana.edu/resources/converter.aspx

	Ponto Superior Esquerdo(x=32,y=47) :: 731999, 7747006 ~= -20.360974, -54.777463
	Ponto Superior Direito (x=61, y=47):: 760989, 7747006 ~= -20.360974, -54.499886
	Ponto Inferior Esquerdo(x=32, y=20):: 731999, 7720007 ~= -20.604839, -54.777463
	Ponto Inferior Direito (x=61, y=20):: 760989, 7720007 ~= -20.604839, -54.499886

	http://www.movable-type.co.uk/scripts/latlong.html
	29 em X (->) == 28.94km
	27 em Y (/\) == 27.12km

*/


//Recebe um inteiro e devolve um estado.
function classificaEstado(estadoInt){

	switch(estadoInt){
		default:
			return "MS";
	}
}

//Recebe um inteiro e devolve uma cidade.
function classificaCidade(cidadeInt){
	switch (cidadeInt){
		default:
			return "CG";
	}
}


/*
	As funções get(Final/Initial) devolvem as coordenadas x e y dos delimitadores da cidade passada por parametro.
	Aqui em Campo Grande MS por exemplo, a primeira coordenada x válida é (-20.360974) e a última (-54.777463)	
	As coordenadas são usadas para classificar os pontos, dependendo da distancia deles ao ponto (x,y) inicial.

	Se a coordenada (x, y) de uma cidade for (0,0) e o ponto estiver na coordenada (20,10)
*/


//Recebe um identificador de cidade e devolve o primeiro x válido para ela.
function getInitialX(cidadeInt){
  	switch (cidadeInt){
		default:
			return -20.360974;
	}
}

//Recebe um identificador de cidade e devolve  o último x válido para ela.
function getFinalX(cidadeInt){
  	switch (cidadeInt){
		default:
			return -20.604839;
	}
}

//Recebe um identificador de cidade e devolve  o primeiro y válido para ela.
function getInitialY(cidadeInt){
  	switch (cidadeInt){
		default:
			return -54.777463;
	}
}


//Recebe um identificador de cidade e devolve  o último y válido para ela.
function getFinalY(cidadeInt){
  	switch (cidadeInt){
		default:
			return -54.499886;
	}
}


/*
	Recupera o número de áreas de uma cidade. Esse número é usado na classificação 
	da posição do usuário. 

	desloc = (posInicial - posFinal)/numAreas (distancia total da cidade, de ponta a ponta. dividida pelo numero de areas na cidade)
	class  = (posInicial - posAtual)/desloc   (distancia entre o ponto inicial da cidade e a posicao atual, dividido pelo deslocamento)
*/
function getNumAreasX(cidadeInt){
  	switch (cidadeInt){
		default:
			return 29;
	}
}

function getNumAreasY(cidadeInt){
  	switch (cidadeInt){
		default:
			return 27;
	}
}


/*
Recebe uma coordenada no formato dd.dddddd 
		(http://www.mappingsupport.com/p/gmap4.php?ll=27.717297%2C7.832677&t=t1&z=2&coord=utm)
E devolve um identificador, que permite classificar essa coordenada
*/

module.exports = {
    classificaPontoMapa: function(cidadeInt, estadoInt, x, y){
	    if (typeof cidadeInt  === 'undefined') {
        	cidadeInt = 1;
      	}
      	if (typeof estadoInt  === 'undefined') {
        	estadoInt = 1;
      	}

      	if (typeof coordX  === 'undefined') {
        	coordX = -20.360974;
      	}
      	if (typeof coordY  === 'undefined') {
        	coordY = -54.777463;
      	}

      	/*
      		Como definimos a cidade como um retângulo, o que importa para classificar a posição do usuário é a 
		    distância em x e em y dele até o ponto (0, 0), pra ficar mais facil podemos pegar o valor absoluto 
		    de x e y
      	 */

      	var coordX = Math.abs(x) * 1000000;
      	var coordY = Math.abs(y) * 1000000;

      	res = [];//["Estado", "Cidade", 20.360974, -54.777463];
	    res[0] = classificaEstado(estadoInt);
	    res[1] = classificaCidade(cidadeInt);

	    /*Recupera x e y iniciais para a cidade passada (Ponto superior esquerdo)*/
	    xInicial = Math.abs(getInitialX(cidadeInt)) * 1000000;
	    yInicial = Math.abs(getInitialY(cidadeInt)) * 1000000;


	    /*Recupera x e y finais para a cidade passada (Ponto inferior direito)*/
	    xFinal = Math.abs(getFinalX(cidadeInt)) * 1000000;
	    yFinal = Math.abs(getFinalY(cidadeInt)) * 1000000;


	    /*Recupera o número de áreas da cidade passada*/
	    areasX = getNumAreasX(cidadeInt);
	    areasY = getNumAreasY(cidadeInt);

	    var deslocX = Math.abs(Math.floor((xInicial - xFinal)/areasX));

	    var deslocY = Math.abs(Math.floor((yInicial - yFinal)/areasY));

	    /*A cada x Deslocamento Area de x + 1*/
    //	console.log("Deslocamentos: " + deslocX + " " + deslocY);

	    var classfX = Math.abs(xInicial - coordX);
	    var classfY = Math.abs(yInicial - coordY);

	    classfX = Math.floor(classfX/deslocX);
	    classfY = Math.floor(classfY/deslocY);
	    res[2] = classfX;
	    res[3] = classfY;

	    return res;	
    }
}



/*var a = classificaPontoMapa(1,1,-20.364353,-54.754546);*/
//var a = classificaPontoMapa(1,1,-20.366043,-54.761498);
/*var a = classificaPontoMapa(1,1,-20.506220,-54.616343);
console.log("A[0]: " + a[0]);
console.log("A[1]: " + a[1]);
console.log("A[2]: " + a[2]);
console.log("A[3]: " + a[3]);*/
