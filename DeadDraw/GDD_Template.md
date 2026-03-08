# **Game Name Here**

## _Game Design Document_

---

##### **Copyright notice / author information / boring legal stuff nobody likes**

##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

DeadDraw es un roguelite de cartas de un solo jugador con una estética cyberpunk oscura, inspirado en el diseño del juego de cartas Scoundrel y presentado con una interfaz moderna inspirada en la de Balatro. El jugador encarna a un mercenario silencioso que se ve dentro del mundo criminal en una ciudad dominada por dos facciones.Tras haber perdido algo de mucho valor a manos de los mafiosos, el protagonista deberá abrirse paso a través de una serie de cuartos controlados por distintos enemigos, tomando decisiones que constantemente pondrán a prueba sus habilidades de supervivencia y de estrategia. La narrativa se comunica principalmente por medio de ambientación visual, es decir se evita los diálogos directos, reforzando así, el tono crudo y decadente del mundo en el que vive nuestro protagonista.

El objetivo principal del jugador es el de completar “runs” para avanzar en la historia y derrotar a jefes de cada facción. Sin embargo, una vez alcanzado este punto, el juego permite continuar el run de manera indefinida hasta que el jugador sea derrotado, de esta manera se fomenta la búsqueda de puntajes altos y aumentando la rejugabilidad.


### **Gameplay**
El gameplay de Dead Draw se estructura alrededor de un loop de decisiones cuarto por
cuarto. Cada cuarto presenta al jugador un conjunto limitado de cartas que representan
amenazas, recursos y oportunidades. El jugador debe elegir qué carta resolver y en qué
orden, considerando tanto el impacto inmediato como las consecuencias a futuro. Al limpiar
un cuarto, el jugador avanza al siguiente, donde el mazo se expande progresivamente y las
decisiones se vuelven más complejas. Este proceso se repite hasta que el jugador muere o
derrota al jefe correspondiente al tipo de run elegido.
Aunque el loop es consistente, cada run se siente diferente debido a la variación en los
mazos, la distribución de cartas y las decisiones tomadas por el jugador, reforzando la
naturaleza roguelite del juego.


### **Mindset**

Nuestro objetivo es que el jugador se sienta inmerso en un mundo cyberpunk donde quiera cobrar venganza a las dos facciones de la mafia, poniendo al jugador en situaciones en donde la planeación a futuro y la suerte juegan un rol grande para la supervivencia del personaje, este tiene que tomar decisiones para realizar sacrificios o tomar grandes riesgos que pueden arruinar el run. 
Queremos que los jugadores sientan adrenalina y nervios al pasar a cada cuarto por no saber qué es lo que los depara en el siguiente cuarto, podría ser desde la vida que necesitaban para sobrevivir o el enemigo más fuerte del juego.


## _Technical_

---

### **Screens**

1. Menu
    1. Opciones
2. mapa
3. nivelespeleas()
4. tienda

_(example)_

### **Controls**

El jugador solo interactuara con el juego por medio de su mouse ya sea para seleccionar las cartas y los comodines, para decidir donde poner las cartas y para seleccionar su nivel.

### **Mechanics**

Las cartas podrán tener mejoras que dependiendo de la situación  pueden beneficiar al jugador o no. Además, no solo las cartas de arma o de vida podrán mejorarse, sino que también las cartas de enemigos podrán modificarse para el beneficio del propio jugador.


Asimismo, habrá comodines que solo podrán conseguirse durante las runs. Estos otorgarán al jugador power-ups más poderosos que los que las cartas pueden llegar a tener. Sin embargo, el jugador deberá decidir qué comodín elegir, ya que habrá casos en los que los comodines contrarresten ciertas cartas o incluso a otros comodines.

Loop principal.
En cada cuarto el jugador se enfrentará a cuatro cartas extraídas del mazo. Cada carta representará un tipo de interacción diferente dependiendo de su palo, como enemigos, armas, vida u otros efectos especiales.
El jugador deberá decidir cómo interactuar con cada carta según su tipo. Por ejemplo, puede enfrentarse a un enemigo, equipar un arma, recuperar vida o activar un efecto especial.
Después de que el jugador interactúe con una carta, esta podrá ser descartada o mantenerse temporalmente si su efecto continúa activo, como en el caso de armas equipadas o modificadores.
Una vez que el jugador haya resuelto las interacciones con las cartas del cuarto, las cartas restantes se descartan y se roban cuatro nuevas cartas, generando el siguiente cuarto.
Este proceso se repite hasta que el jugador pierda toda su vida o complete la run, terminando así la partida.

Baraja.
El juego contará con una baraja de poker clasica, se usaran las 52 cartas naturales de un deck.

Cuartos.
El jugador avanzará a través de distintos cuartos. En cada cuarto deberá interactuar con las cartas disponibles y, conforme vaya eliminando cartas de su baraja, podrá progresar al siguiente cuarto. En cada uno de estos cuartos se repetirá el loop principal del juego.

Elección de cuarto.
En algunos casos, al terminar de interactuar con las cuatro cartas de un cuarto, el jugador podrá elegir a qué tipo de cuarto avanzar.
Dependiendo de la situación, el juego podrá presentar la opción de ir a una tienda, a un cuarto de evento, o en algunos casos mostrar ambas opciones para que el jugador decida cuál tomar.
Esta elección permitirá al jugador decidir si prefiere buscar beneficios, obtener comodines o continuar enfrentando mayores riesgos durante la run.

Tienda.
Durante algunas runs el jugador podrá encontrar una tienda. En estos cuartos el jugador podrá obtener comodines u otros beneficios que le ayuden a continuar avanzando durante la partida.
La tienda ofrecerá distintas opciones que el jugador podrá elegir dependiendo de sus recursos y de la situación actual de la run.

Cuartos de evento.
Además de los cuartos normales, el jugador podrá encontrarse con cuartos especiales de evento. En estos cuartos el jugador podrá obtener comodines de forma aleatoria.
Sin embargo, estos eventos no siempre beneficiarán al jugador. Algunos podrán otorgar comodines útiles, mientras que otros podrán aumentar significativamente la dificultad de la run o aplicar efectos negativos al jugador.

Cartas jugables.
Cada palo o casa definirá el comportamiento de la carta.

Rombos: Estas cartas son elegibles como “Armas”, usables para poder pelear con las cartas enemigas.

Corazones: Con esta carta el jugador podrá curarse cierta cantidad de daño. (nota: las cartas de cura solo podrán ser usadas una vez por cuarto)

Picas: Estas cartas representarán a los enemigos. El jugador deberá enfrentarlas utilizando un arma o recibiendo daño directo.

Tréboles: Estas cartas otorgarán efectos especiales o modificadores que podrán beneficiar o afectar al jugador dependiendo de la situación.

Valor de las cartas.
El valor numérico de cada carta definirá la intensidad de su efecto. En el caso de enemigos, el número representará el daño que pueden causar. Para armas o curaciones, el número indicará la cantidad de daño que se puede infligir o la cantidad de vida que se puede recuperar.

Sistema de combate.
Cuando el jugador decida enfrentarse a una carta enemiga, deberá utilizar una carta de arma o recibir el daño correspondiente. Si el jugador cuenta con un arma equipada, el valor del arma se utilizará para enfrentar al enemigo. Dependiendo de los valores de ambas cartas, el jugador podrá derrotar al enemigo o recibir daño.

Equipamiento de armas.
El jugador solo podrá tener un arma equipada a la vez. Al elegir una nueva carta de arma, el jugador deberá decidir si mantener la actual o reemplazarla por la nueva. El arma equipada podrá utilizarse para enfrentar cartas enemigas.

Eliminación de cartas del mazo.
A lo largo de la run, ciertas cartas podrán ser eliminadas del mazo. Esto permitirá que el jugador modifique gradualmente su baraja, cambiando las probabilidades de las cartas que aparecerán en los siguientes cuartos.

Condición de derrota.
El jugador perderá la partida cuando su vida llegue a cero. Cuando esto ocurra, la run terminará y el jugador deberá comenzar nuevamente.

Progresión de dificultad.
Conforme el jugador avance a través de los cuartos, las cartas que aparezcan podrán volverse más peligrosas. Esto aumentará el riesgo de cada decisión y obligará al jugador a administrar mejor sus recursos.

Cuartos especiales.
Cada cierta cantidad de cuartos aparecerá un cuarto especial que funcionará como un encuentro de jefe. En estos cuartos las reglas normales del juego se verán modificadas mediante atributos especiales que afectarán la forma en la que el jugador interactúa con las cartas.
Estos atributos podrán alterar el comportamiento de los enemigos, armas o cartas de curación. Por ejemplo, los enemigos podrán ignorar parte del daño de las armas o ciertas cartas podrán tener menor efectividad.
Estos encuentros obligarán al jugador a adaptarse a nuevas condiciones y utilizar mejor sus recursos para poder avanzar al siguiente cuarto.

Mejoras permanentes.
Al finalizar una run, el jugador podrá obtener mejoras permanentes que se mantendrán para las siguientes partidas. Estas mejoras permitirán facilitar el progreso del jugador a lo largo del juego.
Las mejoras podrán aumentar la vida máxima del jugador, mejorar la calidad del mazo inicial o modificar ciertas mecánicas para hacer algunos encuentros más manejables.
De esta forma, cada run permitirá al jugador fortalecer progresivamente sus capacidades y aumentar sus probabilidades de avanzar a cuartos más difíciles en futuras partidas.

Comodines.
Durante una run el jugador podrá obtener comodines. Estos funcionarán como cartas especiales que se agregarán temporalmente al mazo durante esa partida.
Los comodines otorgarán efectos más poderosos que las cartas normales, como aumentar significativamente el daño contra enemigos o modificar ciertas mecánicas del juego.
Sin embargo, los comodines no siempre beneficiarán completamente al jugador. En algunos casos podrán tener efectos negativos que acompañen a su poder. Por ejemplo, un comodín puede permitir al jugador causar x3 de daño a los enemigos, pero a cambio el jugador recibirá x2 de daño cuando sea atacado.
Esto obligará al jugador a decidir cuidadosamente si tomar o no un comodín durante la run.


## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**
1. el jugador comensara con un pequeño tutariol de como se juega el scoundril
2. el jugador decidira a que nivel decide ir ya sea el de vida o el de dinero
3. dependiendo el nivel que elija seran los enemigos yy los bosses que pueden aparecer, asu ves el diseño de nivel tambien cambia, siendo el de vida un estilo syberpunk mas oscuro y el de dinero un tipo de estilo cyberpunk mas colorido.
4. una ves el jugador llega al boss final este mismo nivel tendra un estilo diferente a el de los demas niveles.
5. Cuando el jugador vence al jefe final puede decidir si terminal la run en ese momento o seguir jugando hasta que este mismo pierda.

_(example)_

## _Development_

---

### **Abstract Classes / Components**

1.game
2.Health
3.cards
4.cubitos
5.player

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. cards
    1. armas
    2. vida
    3. enemigos
    4. mazo
2. tablero
    1. niveles de vida
    2. niveles de dinero
    3. niveles de los bosses
    4. niveles de los bosses finales
3. barra de vida

## _Sounds/Music_

---

### **Style Attributes**



### **Sounds Needed**

1. Effects
    1. hover sobre la carta
    2. cuando el jugadro clickea la carta 
    3. cunado el jugador vuelvbe a colocar la carta

### **Music Needed**

2. ambiente
    1. musica relajada en el mapa
    2. musica un poco tensa dentro de los niveles
    3. musica con mucha energia en los bosses y bosses finales


## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_


## dd/mm/aaaa
1. Hacer las clases 20/03/2026
    1. cartas
    2. objetos
    3. barra de vida
    4. game
2. hacer las base de datos con las tablas necesarias 5/04/2026
    1. cartas
    2. jugador
3. progrmar las mecanicas del juego 20/04/2026
    1. daño de carta
    2. curacion de carta
    3. vida y daño del enemigo
    4. poder de las cartas
    5. poder de los comodines
4. implementacion de los sprites 5/05/2026
    1. sprites de cartas
    2. sprites de tablero
    3. sprites de comodines

