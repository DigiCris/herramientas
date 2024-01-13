/*
Author: Cristian Marchese
Date: 12/01/2024
*/
/*
Intención del trabajo: Un WYSIWYG básico usando bootstrap
1) Tener un menú generado con init() en la cual tengamos modelos de bootstrap
2) Los componentes pueden ser incrementados agregando el componente a la carpeta e inicializandolos en init
3) Poder instanciar Layouts de 12 columnas, para eso se hizo fila.html. Luego poder ir uniendo los divs
   para darle el tamaño que se desee a cada fila.
4) Poder ir trayendo los componentes, ya se arrastrando o seleccionandolo en que div se quieren y
   clickeando el componente.
5) Al instanciar un componente en su div correspondiente que aparezca un form con caracteristicas a
   retocar que será dependiente del componente. Por ejemplo:
   a) boton: Texto, centrado, posicion, función que llama.
   b) Menu: items con sus links, despliegues si es que tiene, colores
   c) Card: imagen, texto, titulo, centrado
   d) Imagen: tamaño, posicion, centrado, etc
   e) Input: placeholder, value, onchange, etc
6) Cuando le aplicamos los cambios tenemos que poder ir viendo lo que van produciendo.
7) Una vez terminado con un boton de compilar debe generarse un html apropiado con todo el contenido
   adentro del div que fuimos agregando y el css que también se retocó. Además un script en javascript
   que contendrá las funciones que fueron especificadas en el proceso listas para completar.
   Las mismas pueden tener comentado lo que deben recibir, lo que deben hacer y lo que deben devolver,
   para poder ser consumida por un programa de inteligencia artificial para generarlas.
   Para las pruebas pueden completarse con un alert() para mostrar que están funcionando. La idea es
   poner los archivos en la carpeta output.
8) Otros componentes fueras de bootstrap pueden ser agregados luego.

Nota: debe ser corrida en un server para no tener problema de CORS
*/


/*
Declaración de variables globales a ser usadas en el script
*/
// variables que tienen que ver con la seleccion de columnas para el componente fila.html
var columnas;
var seleccionando;
var seleccionInicial;
var seleccionActual;

/*
Descripcion: Esta función se encarga de generar los divs con la función onClick que hará que cuando se
clickee en ese div se genere un componente dentro del div de content y luego carga el objeto dentro
de ese div que generó con el simple hecho de que podamos saber que estamos clickeando.
*/
async function init(){
    // ID donde guardarlo,          ID para llamarlo, funcion,                   arg1,              arg2
    await generarDiv("button1","button1","cargarContenidoDesdeURL", "./components/button1.html");
    await cargarContenidoDesdeURL('./components/button1.html','button1'+i);    

    await generarDiv("button2","button2","cargarContenidoDesdeURL", "./components/button2.html");
    await cargarContenidoDesdeURL('./components/button2.html','button2'+i);   

    await generarDiv("button3","button3","cargarContenidoDesdeURL", "./components/button3.html");
    await cargarContenidoDesdeURL('./components/button3.html','button3'+i);   

    await generarDiv("layout","fila","cargarContenidoDesdeURL", "./components/fila.html", "content");
    await cargarContenidoDesdeURL('./components/fila.html','fila'+i);   

  }

  /*
  descripción: Este metodo se encarga de inicializar todas las variables que harán falta para el programa
  */
  function inicializarVariables(){
    /*Estas son para las columnas seleccionadas dentro del div de layout (fila.htmls)*/
    columnas = document.querySelectorAll('.columna');
    seleccionando = false;
    seleccionInicial = null;
    seleccionActual = null;
  }

  /*
  descripcion: llamo al init() para que se ejecute
  */
  document.addEventListener('DOMContentLoaded', function() {
    // Aquí puedes agregar el código que deseas ejecutar cuando la página se haya cargado completamente
    console.log('La página ha sido cargada');
    init(); 
  });

  /*
  descripcion: Esta función se encarga de buscar lo que hay en una URL determinada y cargar su contenido
  en un div que tiene como id content.
  Parametros:
    url: (string) Dirección donde está el contenido que quiero cargar. ejemplo: components/fila.html
    content: (string) id del div en donde quiero cargar el contenido que fui a buscar
    mode: (string) puede ser "a" o "w". a agrega, w sobreescribe el div. Agregar es por defecto si no
          se especifica. (modificado 13/01/2024)
  */
    async function cargarContenidoDesdeURL(url, content = 0, mode = 'a') {
      if (content == 0 || content == undefined || content == 'undefined') {
        content = obtenerIdPorClase("seleccionada");
      }
      var contentAux = 0;
      if (Array.isArray(content)) {
        contentAux = content;
        content = contentAux[0];
      }
      var xhr = new XMLHttpRequest();
      await xhr.open("GET", url, true);
      xhr.onreadystatechange = await function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var contenido = xhr.responseText;
          var regex = /id="([^"]+)"/g;
          var match;
          while ((match = regex.exec(contenido)) !== null) {
            var idOriginal = match[1];
            var nuevoIdCompleto = idOriginal + i;
            contenido = contenido.replace(match[0], 'id="' + nuevoIdCompleto + '"');
            i++;
          }
          var contentDiv = document.getElementById(content);
          if (mode === 'w') {
            contentDiv.innerHTML = contenido; // Sobrescribir el contenido existente
          } else {
            contentDiv.insertAdjacentHTML("beforeend", contenido); // Agregar el contenido al final
          }
        }
      };
      await xhr.send();
      if (Array.isArray(contentAux)) {
        for (j = 1; j < contentAux.length; j++) {
          cargarContenidoDesdeURL(url, contentAux[j], mode);
        }
        return;
      }
    
      await setTimeout(agregarEventosColumnas, 1000);
      await agregarEventosColumnas();
    }

var i=0;
/*
Descripcion: Esta función se encarga de generar los divs con la función onClick que hará que cuando se
clickee en ese div se realice una función determinada pasada como functionName y que recibe 2 params.
Parametros:
  idContainer: (string) id del contenedor (padre) donde incorporaremos este div que generamos
  idItem: (string) Id que pretendemos ponerle al item. Siempre se le concatena un i incremental para
          evitar que vayamos a tener 2 veces el mismo id. El mismo valor que al id se le pone a la clase.
  functionName: (string) Nombre de la funcion a la que se llamará cuando se de click a este div. La misma
          tiene 2 parametros. url y targetId. Ejemplo: cargarContenidoDesdeURL, para cargar contenido
          desde una url a un div en el html.
  url: (string) URL que se pasa por parametro a la funcion functionName. En el caso del ejemplo nos da
          la direccion en donde encontramos el contenido a cargar.
  targetId: (string) id que se pasa por parametro a la funcion functionName. En el caso del ejemplo nos
          da la ID del elemento contenedor en donde pondremos el contenido generado.
*/
function generarDiv(idContainer, idItem, functionName, url, targetId) {
  //alert(idItem+i)
  i++;
  var div = document.createElement('div');
  div.className = idItem+i;
  div.id = idItem+i;
  div.setAttribute('onclick', ""+functionName+"('"+url+"', '"+targetId+"')");

  var targetDiv = document.getElementById(idContainer);
  targetDiv.appendChild(div);
}








/*
descripción: Esto se usa para las fila.html. Primero inicializa las variables que tienen que ver con la 
             selección de columnas para unir las celdas. Y después escucha cuando el mouse selecciona
             usando la funcion mousedown, enter y up. A los que selecciona le agrega la clase seleccionada.
             Esto hay que correrlo cada vez que hay una nueva fila para que las columnas escuchen la
             selección, sino, si agegamos filas, las celdas no las estarán escuchando de por sí.
*/
agregarEventosColumnas(); // esto es para que se ejecute desde el comienzo
function agregarEventosColumnas() {
  inicializarVariables();
  columnas.forEach(function(columna) {
    columna.addEventListener('mousedown', function(event) {
      event.preventDefault();
      seleccionando = true;
      seleccionInicial = columna;
      seleccionActual = columna;
      columna.classList.add('seleccionada');
    });

    columna.addEventListener('mouseenter', function() {
      if (seleccionando) {
        seleccionActual = columna;
        seleccionarColumnas();
      }
    });
  });

  window.addEventListener('mouseup', function() {
    if (seleccionando) {
      seleccionando = false;
      seleccionInicial = null;
      seleccionActual = null;
      //combinarColumnas();
    }
  });

}

/*
descripción: esta es una función para elimiar las columnas seleccionadas removiendo la clase.
             la misma se llama desde adentro de agregarEventosColumnas().
*/
function seleccionarColumnas() {
  columnas.forEach(function(columna) {
    columna.classList.remove('seleccionada');
  });

  var inicio = Array.from(columnas).indexOf(seleccionInicial);
  var fin = Array.from(columnas).indexOf(seleccionActual);

  if (inicio > fin) {
    [inicio, fin] = [fin, inicio];
  }

  for (var i = inicio; i <= fin; i++) {
    columnas[i].classList.add('seleccionada');
  }
}



/*
Descripción: Esta función es la encargada de combinar todas las columnas de las fila.html agregadas,
             una vez seleccionadas y precionado el botón que lance esta función. Solo permite combinar
             celdas de columnas que tengan el mismo ID.
*/
function combinarColumnas() {
  var columnasSeleccionadas = Array.from(document.querySelectorAll('.seleccionada'));
  
  var filas = new Set();
  columnasSeleccionadas.forEach(function(columna) {
    filas.add(columna.parentNode.id);
  });
  
  if (filas.size > 1) {
    console.log('No se pueden combinar columnas de filas diferentes.');
    return;
  }
  
  var sumaX = 0;

  columnasSeleccionadas.forEach(function(columna) {
    var classes = columna.classList;
    classes.forEach(function(clase) {
      if (clase.startsWith('col-') && clase !== 'columna') {
        sumaX += parseInt(clase.split('-')[1]);
      }
    });
  });

  var columnaNoBorrada = columnasSeleccionadas[0];
  var nuevasClases = Array.from(columnaNoBorrada.classList).filter(function(clase) {
    return !clase.startsWith('col-');
  });
  nuevasClases.push('col-' + sumaX);

  columnasSeleccionadas.forEach(function(columna, index) {
    if (index !== 0) {
      columna.parentNode.removeChild(columna);
    } else {
      columna.className = nuevasClases.join(' ');
    }
  });
}







/*
Descripcion: obtiene el id de un div en cuya clase contenga una clase pasada por parametro. Si es mas 
de un div  devolver un arreglo con los id, sino devolver el que es, sino existe que salte una alerta 
diciendo que debe seleccionar algun casillero. La idea de esta funcion fue que pudiera buscar el
casillero seleccionado para meter el componente que se desee.
parametros:
  clase: (string) clase pasada por parametro para que devuelva el div.
*/
function obtenerIdPorClase(clase) {
  var elementos = Array.from(document.querySelectorAll('div.' + clase));
  var ids = elementos.map(function(elemento) {
    return elemento.id;
  });

  if (ids.length === 0) {
    alert('Debe seleccionar algún casillero.');
  } else if (ids.length === 1) {
    return ids[0];
  } else {
    return ids;
  }
}






///////////////////////////////////////////////////////////////////////////////////////////////////////
// Date: 13/01/2024
/////////////////////////////////////////////////////////////////////////////////////////////////////


var estilos = {}; // Objeto para almacenar los estilos y su estado
var estilosAnteriores = []; // Array para almacenar los estilos anteriores
var estilosPosteriores = []; // Array para almacenar los estilos posteriores
var cssForm = ""; // indica cual es el elemento al cual se lee está modificando el css

/*
descripción: Función que maneja el doble click de los componentes para cambiar su css. Primero obtiene
             el id de quien lo llamó y se lo manda a addToChangeCss, la cual verificará si el formulario
             cargado es el correcto o si debe cambiarlo y luego agregará el id del elemento a cambiar.
*/
function handleDoubleClick(event) {
  event.stopPropagation(); // evita que se siga propagando y que se llame muchas veces a este handle con un doble click solo
  var id = event.target.id; // obtiene el id de quien lo llamo
  addIdToChangeCss(id);
}


/*
var idAddIdToChangeCss: En una variable global que contiene el id de lo clickeado así cuando se hace
                        el llamado recursivo para saber si el formulario está listo no tengo que estarle
                        mandando quien lo llamo y no colmo el stack.
Descripción addToChangeCss: verificará si el formulario cargado es el correcto o si debe cambiarlo y luego
            agregará el id del elemento a cambiar. Para eso compara el tipo actual del elemento que hizo
            doble click pasado como parametro desde el handler del evento y sacado la parte numerica (para
            obtener el tipo. Ejemplo: button145 es tipo button). Luego compara con cssForm que es una
            variable global que tiene el ultimo form cargado, si es del mismo tipo lo agrega en el campo
            correspondiente al CSS-id, si es diferente, hace el cambio de form y también lo agrega pero
            lo hace a travez de la función verificarExistencia()
Parametros:
              id: (string) el id del componente al cual quiero cambiarle el css
*/
var idAddIdToChangeCss;
function addIdToChangeCss(id){
  var tipo = id.replace(/\d+/g, '');
  if(tipo==cssForm){// agrego
    document.getElementsByClassName("CSS-id")[0].value += (", "+id);
  } else{ //cambio
    changeForm(id); // llama a la función que modificará el formulario para modificar el css
    idAddIdToChangeCss = id;
    verificarExistencia(id);
  }
}

/*
descripción: Función recursiva que verifica la existencia del campo CSS-id que es donde se cargan los id
             de los elementos que van a ser cambiado sus css. Mientras no aparece se sigue llamando cada
             250ms sin hacer nada, cuando aparece en dicho campo se carga el id del elemento que lo llamo
             que está cargado globalmente en idAddIdToChangeCss para evitar desbordamiento de pila.
Nota: CSS-id es el nombre que tiene que tener la clase de cualquier formulario de css donde esté los id
      a cambiar para que funcione correctamente todo.
*/
function verificarExistencia() {
  const elementoDeseado = document.getElementsByClassName("CSS-id")[0];
  if (elementoDeseado) {
    document.getElementsByClassName("CSS-id")[0].value = idAddIdToChangeCss;
  } else {
    setTimeout(verificarExistencia, 250); // Intentar de nuevo después de 100ms
  }
}

/*
Descripción: Función que recibe un id, le saca la parte numerica para saber que tipo es, realiza un switch
             case para identificarlo y carga el formulario de cada componente dentro de formulario-container.
Parametros:
  id: (string) Es el id del elemento al cual le queremos modificar el css.
*/
function changeForm(id) {
  var tipo = id.replace(/\d+/g, '');
  switch (tipo) {
    case 'button':
      cssForm = 'button';
      //estilo = prompt('Ingrese el texto en formato CSS para el botón:');
      cargarContenidoDesdeURL('./buttonCssForm.html','formulario-container','w');
      break;
    case 'col':
      cssForm = 'col';
      //estilo = prompt('Ingrese el texto en formato CSS para la fila:');
      cargarContenidoDesdeURL('./colCssForm.html','formulario-container','w');
      break;
    default:
      console.log('Tipo desconocido');
      break;
  }
}

/*
Descripción: Función que recibe unoo mas id, y el estilo css el cual tiene que ser agregado solo
             las sentencias. por ejemplo para centrar datos en una columna (col) podríamos escribirlo
             usando flex de la siguiente forma: display:flex; flex-wrap:wrap; justify-content:center; 
             align-items:center; align-content:center;. El estilo generado lo carga en la página en
             una etiqueta style con un id="my-styles", lo cual servirá luego para exportarlo. También
             guarda los estilos anteriores y posteriores para luego poder irlos recorriendo y aplicar
             un undo y redo. También debemos resaltar que si el Id ya existía lo sobreescribe, sino
             lo crea. A pesar de recibir muchos id los guarda de a uno para luego poder deshacer o
             rehacer de a 1.s
Parametros:
  id: (string) Es el id del elemento al cual le queremos modificar el css. Si recibe varios, separarlo
      por "," (comas)
  estilo: (string) Estilo por el que desea cambiarle al id correspondiente. ejemplo: font-size: 1px;.
*/
function change(ids, estilo) {
  var idArray = ids.split(',').map(function(id) {
    return id.trim();
  });

  if (estilo.trim() !== '') {
    idArray.forEach(function(id) {
      estilosAnteriores.push({ id: id, estilo: estilos[id] }); // Guardar el estilo anterior

      estilos[id] = estilo; // Actualizar el objeto de estilos
    });

    var styleElement = document.getElementById('my-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'my-styles';
      document.head.appendChild(styleElement);
    }

    var contenidoEstilos = '';
    for (var key in estilos) {
      if (estilos.hasOwnProperty(key)) {
        contenidoEstilos += '#' + key + ' { ' + estilos[key] + ' }\n';
      }
    }

    styleElement.innerHTML = contenidoEstilos;

    // Limpiar el array de estilos posteriores
    estilosPosteriores = [];
  }
}

/*
Descripción: Función que se ejecuta cuando se preciona el botón de deshacer y recorre los estilos
             anteriores realizando los cambiós sobre <style id="my-styles"> para volver a la versión
             anterior. En caso de que ya no haya más para un componente lo deja vació volviendo al
             estado inicial
*/
function undo() {
  if (estilosAnteriores.length > 0) {
    var ultimoEstilo = estilosAnteriores.pop();
    var id = ultimoEstilo.id;
    var estilo = ultimoEstilo.estilo;

    estilosPosteriores.push({ id: id, estilo: estilos[id] }); // Guardar el estilo actual en estilos posteriores

    estilos[id] = estilo; // Restaurar el estilo anterior

    var styleElement = document.getElementById('my-styles');
    if (styleElement) {
      var contenidoEstilos = '';
      for (var key in estilos) {
        if (estilos.hasOwnProperty(key)) {
          contenidoEstilos += '#' + key + ' { ' + estilos[key] + ' }\n';
        }
      }

      styleElement.innerHTML = contenidoEstilos;
    }
  }
}

/*
Descripción: Función que se ejecuta cuando se preciona el botón de rehacer y recorre los estilos
             posteriores realizando los cambiós sobre <style id="my-styles"> para volver a la versión
             posterior.
*/
function redo() {
  if (estilosPosteriores.length > 0) {
    var siguienteEstilo = estilosPosteriores.pop();
    var id = siguienteEstilo.id;
    var estilo = siguienteEstilo.estilo;

    estilosAnteriores.push({ id: id, estilo: estilos[id] }); // Guardar el estilo actual en estilos anteriores

    estilos[id] = estilo; // Restaurar el estilo siguiente

    var styleElement = document.getElementById('my-styles');
    if (styleElement) {
      var contenidoEstilos = '';
      for (var key in estilos) {
        if (estilos.hasOwnProperty(key)) {
          contenidoEstilos += '#' + key + ' { ' + estilos[key] + ' }\n';
        }
      }

      styleElement.innerHTML = contenidoEstilos;
    }
  }
}

/*
Descripción: Agrega todos los elementos para que escuchen los doble clicks
*/
var elementos = document.querySelectorAll('*');
elementos.forEach(function(elemento) {
  elemento.addEventListener('dblclick', handleDoubleClick);
});