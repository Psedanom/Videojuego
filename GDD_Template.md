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

El jugador solo interactuara con el jeugo por medio de su mouse ya sea para agarrar las cartas, para agarrar los comodines, para decidir donde poner las cartas y para seleccionar su nivel.

### **Mechanics**

Las cartas podrán tener mejoras que dependiendo de la situación  pueden beneficiar al jugador o no. Además, no solo las cartas de arma o de vida podrán mejorarse, sino que también las cartas de enemigos podrán modificarse para el beneficio del propio jugador.


Asimismo, habrá comodines que solo podrán conseguirse durante las runs. Estos otorgarán al jugador power-ups más poderosos que los que las cartas pueden llegar a tener. Sin embargo, el jugador deberá decidir qué comodín elegir, ya que habrá casos en los que los comodines contrarresten ciertas cartas o incluso a otros comodines.

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

