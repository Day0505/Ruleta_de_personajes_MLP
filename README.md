# Creador de personajes de My Little Pony

Este proyecto es una aplicación web simple que permite crear un personaje ficticio mediante una ruleta interactiva. Cada giro selecciona una característica de una lista predefinida, como raza, género, tipo de melena, color de cuerpo o personalidad. Los resultados se muestran en un panel que simula un diario o cuaderno, y al finalizar el proceso se habilita un campo para escribir el talento del personaje si es qu elo tiene.

## Descripción general

La aplicación está construida con HTML, CSS y JavaScript. Su objetivo es ofrecer una experiencia visual sencilla.

## Funcionalidades

- Ruleta interactiva para seleccionar opciones aleatorias.
- Proceso paso a paso con varias fases de creación.
- Panel de resultados con apariencia de diario.
- Campo final para agregar un talento o Cutie Mark.
- Opción para reiniciar la creación y comenzar otra vez.

## Estructura del proyecto

Ruleta de personajes/
├── index.html
├── styles.css
└── app.js

- index.html: contiene la estructura de la página y los elementos visuales principales.
- styles.css: define la apariencia, los colores y el diseño del interfaz.
- app.js: controla la lógica de la ruleta, el avance entre fases y el registro de resultados.

## Funcionamiento

1. El usuario inicia la creación desde la pantalla de bienvenida.
2. Se muestra una fase actual con una lista de opciones.
3. Al hacer girar la ruleta, se selecciona una opción aleatoria.
4. El resultado se registra en el panel del diario.
5. Cuando se completan todas las fases, se habilita el campo final para escribir el talento del personaje.

## Personalización

El contenido de la ruleta y las fases se define en el archivo app.js, dentro del arreglo PHASES. Allí es posible agregar, quitar o modificar opciones y títulos de cada fase.

El aspecto visual se ajusta desde styles.css, donde se pueden cambiar colores, tipografías, tamaños y disposición de los elementos.

## Publicación en GitHub

El proyecto puede publicarse como un sitio estático en GitHub Pages. No requiere instalación adicional ni dependencias de compilación.
