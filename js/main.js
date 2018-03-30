var numero =2;
var bias =0.5;
var w1=0.7;
var w2=0.7;

function anadir(lugar) {
    numero++;
    valor=0;
    (lugar==0)? valor=-1 : valor=1;
    var campo='<div id="numero_'+numero+'" class="col-md-12"><div class="form-group" style=" margin-top:8px;">';
            campo+='<label class="sr-only" for="Punto_x">Punto X</label>';
            campo+='<input class="form-control punto" placeholder="Punto X">';
        campo+='</div>';
        campo+='<div class="form-group" style="margin-left:5px; margin-top:8px;">';
            campo+='<label class="sr-only" for="Punto_y">Punto Y</label>';
            campo+='<input class="form-control punto" placeholder="Punto Y">';
        campo+='</div>';
        campo+='<div class="form-group btn-group" style="margin-left:3px; margin-top:8px;">';
            campo+='<button onclick="anadir('+lugar+')" type="button" class="btn btn-primary">+</button>';
            campo+='<button onclick="$(\'#numero_'+numero+'\').remove()" type="button" class="btn btn-danger">--</button>';
        campo+='</div>';
    campo+='<br><input type="hidden" class="punto" value="'+(valor)+'"></div>';
    $("#form_"+lugar).append(campo);
};

function anadirP(){
    numero++;
    var campo='';
    campo+='<div id="numero_'+numero+'" class="col-md-12" style=" margin-top:8px;">';
        campo+='<div class="form-group" style="margin-top:8px;">';
            campo+='<label class="sr-only">Punto X</label>';
            campo+='<input id="puntoP_'+numero+'0" onkeyup="verificar('+numero+')" class="form-control puntoP" placeholder="Punto X">';
        campo+='</div>';
        campo+='<div class="form-group" style="margin-left:5px; margin-top:8px;">';
            campo+='<label class="sr-only">Punto Y</label>';
            campo+='<input id="puntoP_'+numero+'1" onkeyup="verificar('+numero+')" class="form-control puntoP" placeholder="Punto Y">';
        campo+='</div>';
        campo+='<div class="form-group btn-group" style="margin-left:3px; margin-top:8px;">';
            campo+='<button onclick="anadirP()" type="button" class="btn btn-primary">+</button>';
            campo+='<button onclick="$(\'#numero_'+numero+'\').remove()" type="button" class="btn btn-danger">--</button>';
        campo+='</div>';
        campo+='<span id="puntoP_'+numero+'2" class="invisible label label-info">Grupo 1</span>';
    campo+='</div>';
    $("#formP_1").append(campo);
}

/* permite borrar puntos de entrenamiento opsoletos*/
function reiniciarP(){
    var numero_2= $("#numero_2").html();
    $("#formP_1").html(" ");
    $("#formP_1").html('<div id="numero_2" class="col-md-12">'+numero_2+'</div>');
    $("#puntoP_22").addClass("invisible");
}

/*verifica si el dato pasado es null o vacio*/
function esNull(valor){
    if(valor == null || valor.length == 0 || /^\s+$/.test(valor) || isNaN(valor)){
        return true;
    }else{
        return false;
    }  
}

/*verificar los puntos de prueba*/
function verificar(numero){
    var puntoX=$("#puntoP_"+numero+"0").val();
    var puntoY=$("#puntoP_"+numero+"1").val();
    var resultado=0;
    if(!(esNull(puntoX) || esNull(puntoY))){
        resultado=hardlin(formula(puntoX,puntoY));
        if(resultado ==1){
            $("#puntoP_"+numero+"2").html("Grupo 1");
        }else{
            $("#puntoP_"+numero+"2").html("Grupo 2");
        }
        $("#puntoP_"+numero+"2").removeClass("invisible");
        /*graficar puntos de prueba*/
        graficar('P');
        
    }else{
        $("#puntoP_"+numero+"2").addClass("invisible");
    } 
}
/*
    devuelve todos los puntos X, Y y el grupo al que pertenecen (1 o 0)
*/
function devolverPuntos(){
    var puntos=[[]];
    var i=-1;
    var j=0;
    var cont =0;
    $(".punto").each(function() {   
        if((cont%3)==0){
            j=0;
            i++;
            puntos.push([]);
        }
        puntos[i][j]=parseFloat($(this).val());
        //alert(puntos[i][j]);
        j++; 
        cont++;      
    });
    puntos.pop([]);
   return puntos;
}
/* devuelve los puntos de prueba*/
function devolverPuntosPrueba(){
    var puntos=[[]];
    var i=-1;
    var j=0;
    var cont =0;
    $(".puntoP").each(function() {   
        if((cont%2)==0){
            j=0;
            i++;
            puntos.push([]);
        }
        puntos[i][j]=parseFloat($(this).val());
        //alert(puntos[i][j]);
        j++; 
        cont++;      
    });
    puntos.pop([]);
   return puntos;
}
/*
 devuelve el hardlim de un numero
*/
function hardlin(num){
    if(num>=0)
        return 1;
    else
        return -1;
}
/*
    calcula el resultado de la formula
*/
function formula(x,y){
    var resultado=0.0;
    resultado= parseFloat((x*w1)+(y*w2)+bias);
    return resultado;
}
/*
vo => valor obtenido
ve => valor esperado

permite entrenar al red neuronal
*/
function entrenar(vo,ve,x,y){
    var error =0;
    error= ve-vo;
    x= (x*error);
    y= (y*error);
    
    w1=w1+x;
    w2=w2+y;
    
    bias=bias+error;
}
/*
    devuelve los puntos de acuerdo al grupo es decir 1 o -1
*/
function devolverPuntosXY(grupo){
    var puntos = [[]];
    var puntosXY=[[]];
    puntos=devolverPuntos();
    var j=0;
    for(var i=0; i<(puntos.length);i++){
        if(grupo==puntos[i][2]){
            puntosXY[j][0]=parseFloat(puntos[i][0]);
            puntosXY[j][1]=parseFloat(puntos[i][1]);
            puntosXY.push(new Array());
            j++;
        }      
    }
    puntosXY.pop([]);
    return puntosXY;
}

/* devuelve el punto X o Y mas alto de todos los ingresados*/
function devolverXYmax(puntosXY){
    var pointMax=0;
    
    for(var i=0;i<(puntosXY.length);i++){      
        /*puntos X */
        if(Math.abs(puntosXY[i][0])>pointMax){
            pointMax=Math.abs(puntosXY[i][0]);          
        }
        
        /*puntos Y*/
        if(Math.abs(puntosXY[i][1])>pointMax){
            pointMax=Math.abs(puntosXY[i][1]);          
        }
        //alert(puntosXY[i][0]);
    }
    return pointMax;
}

/*valida que los puntos de entrenamiento esten bien ingresados*/
function validarPuntos(){
    var ban=true;
    var valor;
    $(".punto").each(function() {
        valor=$(this).val();
        if(esNull(valor)){
            ban=false;
        }           
    });
   return ban;
}

/*
    grafica los puntos y la linea divisora
    tipo=> indica si grafica entrenamiento o prueba
*/
function graficar(tipo){
    
    var puntosXY=[[]];
    var pointMin=[[]];
    var puntosP=[[]];
    puntosXY1= devolverPuntosXY(1);
    puntosXY2= devolverPuntosXY(-1);
    pointMax=devolverXYmax(puntosXY1.concat(puntosXY2))+5;/* le sumo 5 para que los puntos mas altos no queden al borde del grafico  y asi sean mas visibles*/
    
    
    /**/
    var y1=(-bias/w2);
    var x1=(-bias/w1);
    var y3=0;
    var x3=pointMax;
    var y4=0;
    var x4=(pointMax*-1);
    y3=((x3-0)*((0-y1)/(x1-0)))+y1;
    y4=((x4-0)*((0-y1)/(x1-0)))+y1;
    
    /*puntos de prueba*/
    if(tipo=='P'){
        puntosP=devolverPuntosPrueba();
    }
    //alert(pointMax);
    $('#grafico').highcharts({
        xAxis: {
            min: (pointMax*-1),
            max: (pointMax),            
        },
        yAxis: {
            min: (pointMax*-1),
            max: (pointMax)
        },
        title: {
            text: 'Red Neuronal (W1=> '+w1.toFixed(2)+' , W2=> '+w2.toFixed(2)+' , Bias=> '+bias.toFixed(2)+' )'
        },
        series: [{
            type: 'line',
            name: 'Eje Y',
            color: '#000000',
            data: [[0, (pointMax)], [0, (pointMax*-1)]],
            marker: {
                enabled: true
            },
            states: {
                hover: {
                    lineWidth: 0,
                }
            },
            enableMouseTracking: false
        },{
            type: 'line',
            name: 'Eje X',
            color: '#000000',
            data: [[(pointMax), 0], [(pointMax*-1), 0]],
            marker: {
                enabled: true
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Grupo 1',
            color: '#07f',
            data: puntosXY1,
            marker: {
                radius: 4
            }
        }, {
            type: 'scatter',
            name: 'Grupo -1',
            color: '#00cb2d',
            data: puntosXY2,
            marker: {
                radius: 4
            }
        },{
            type: 'scatter',
            name: 'Puntos de Prueba',
            color: '#00d2f0',
            data: puntosP,
            marker: {
                radius: 4
            }
        },{
            type: 'line',
            name: 'Linea de División',
            color: '#f00',
            data: [[x4, y4],[0, y1], [x1, 0],[x3, y3]],
            marker: {
                //enabled: true,
                //radius: 4
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }]
    });
    document.documentElement.scrollTop=10000;
}
/*es el miain de la ejecucion del programa, es es la encargada de resolver el algoritmo*/
/* tipo => indica de donde procede el evento*/
function calcular(){
    var puntos=[[]];
    var aux=0.0;
    var repetir=-1;
    var ban=true;
    var num=0;
    /*inicializar pesos y bias**/
    w1=0.7;
    w2=0.7;
    bias=0.5;
    if(validarPuntos()){
        puntos=devolverPuntos();
        var i=-1;
        var final=(puntos.length-1);
        while(ban && num<20000000){
            i++;
            num++;
            aux=formula(puntos[i][0],puntos[i][1]);
            //alert("Resultado formula => "+aux);
            aux=hardlin(aux);
            //alert("Resultado harlind => "+aux);
            if(aux!=puntos[i][2]){
                //alert("entrenar");
                entrenar(aux,puntos[i][2],puntos[i][0],puntos[i][1]);
                i--;
                repetir=i;
                //alert(repetir);
                final=(puntos.length-1);
            }
            if(i==final){
                if(repetir>-1){
                    final=repetir;
                    i=-1;
                    //alert("volver a recorrer hasta el punto "+puntos[repetir][0]+" "+puntos[repetir][1]);
                    repetir=-1;
                }else{
                    ban=false;
                } 
            }
            
            /*controlar error*/
            if(num==20000000){
                alert("ERROR: exceso de iteraciones .. estos puntos no son linealmente separables");
            }
        }    
        
        //alert("Peso 1 => "+w1+" Peso 2 => "+w2+" Bias => "+bias);
        graficar('E');
        
    }else{
        alert("ERROR: Por favor llene todos los campos con solo numeros");
        
    }
    

}

