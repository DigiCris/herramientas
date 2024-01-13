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
    await generarDiv("components","button1","cargarContenidoDesdeURL", "./components/button1.html", "content");
    await cargarContenidoDesdeURL('./components/button1.html','button1'+i);    

    await generarDiv("components","button2","cargarContenidoDesdeURL", "./components/button2.html", "content");
    await cargarContenidoDesdeURL('./components/button2.html','button2'+i);    

    await generarDiv("components","button3","cargarContenidoDesdeURL", "./components/button3.html", "content");
    await cargarContenidoDesdeURL('./components/button3.html','button3'+i);   
    
    await generarDiv("components","fila","cargarContenidoDesdeURL", "./components/fila.html", "content");
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
  init(); 

  /*
  descripcion: Esta función se encarga de buscar lo que hay en una URL determinada y cargar su contenido
  en un div que tiene como id content.
  Parametros:
    url: (string) Dirección donde está el contenido que quiero cargar. ejemplo: components/fila.html
    content: (string) id del div en donde quiero cargar el contenido que fui a buscar
  */
  async function cargarContenidoDesdeURL(url,content) {
    var xhr = new XMLHttpRequest();
    await xhr.open("GET", url, true);
    xhr.onreadystatechange = await function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var contenido = xhr.responseText;
        var contentDiv = document.getElementById(content);
        contentDiv.insertAdjacentHTML("beforeend", contenido);
      }
    };
    await xhr.send();
    await setTimeout(agregarEventosColumnas,1000);
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