# Historias de Usuario - DeadDraw

---

## Historia de usuario #1: Ambiente Inmersivo

**Como** usuario  
**quiero** un juego inmersivo que cambie de ambiente cada vez que lo juego, con elementos de tipo cartas  
**para** tener una experiencia única y variada en cada partida

### Validación:
- El ambiente visual cambia entre runs
- Las cartas se presentan con diseño cyberpunk
- El jugador percibe diferencias visuales entre sesiones

**Restricciones:** El juego debe mantener una estética cyberpunk coherente en todos los ambientes  
**Prioridad:** Alta  
**Estimación:** 13 hrs  
**Tipo:** No funcional

---

## Historia de usuario #2: Niveles con Enemigos

**Como** usuario  
**quiero** múltiples niveles con enemigos con los que pueda interactuar mediante ataques directos o juego de cartas  
**para** tener variedad de desafíos y mecánicas de combate

### Validación:
- Existen múltiples niveles con dificultad progresiva
- Los enemigos tienen valores numéricos visibles
- El jugador puede enfrentarlos con cartas de arma o directamente

**Restricciones:** Cada nivel debe tener al menos un tipo de enemigo diferente  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #3: Base de Datos Estructurada

**Como** administrador de base de datos  
**quiero** almacenar información estructurada y optimizada con interacción entre página web y videojuego  
**para** garantizar integridad y accesibilidad de los datos del sistema

### Validación:
- Las tablas están normalizadas en 3FN
- Existe comunicación entre la web y el videojuego
- Los datos se persisten correctamente

**Restricciones:** La base de datos debe cumplir con la Tercera Forma Normal (3FN)  
**Prioridad:** Alta  
**Estimación:** 13 hrs  
**Tipo:** Funcional

---

## Historia de usuario #4: Página Web con Guardado

**Como** usuario  
**quiero** una página web integrada con el juego donde pueda guardar mi información  
**para** retomar mi progreso en cualquier momento desde el navegador

### Validación:
- La página web carga el juego correctamente
- El sistema guarda y carga el progreso del usuario
- La información persiste entre sesiones

**Restricciones:** El guardado debe estar vinculado a la cuenta del usuario autenticado  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #5: Secciones de la Página Web

**Como** usuario  
**quiero** múltiples secciones en la página web: inicio, tutorial, historia/background y personajes  
**para** explorar el lore y aprender a jugar antes de comenzar una partida

### Validación:
- Las secciones Inicio, Tutorial, Historia y Personajes existen y son navegables
- Cada sección tiene contenido relevante
- La navegación entre secciones es fluida

**Restricciones:** Las secciones deben ser accesibles sin necesidad de iniciar sesión  
**Prioridad:** Media  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #6: Interacción desde la Web

**Como** usuario  
**quiero** poder interactuar con el videojuego directamente desde la página web  
**para** jugar sin necesidad de descargar software adicional

### Validación:
- El juego corre en el navegador sin instalación
- Los controles responden correctamente desde la web
- La experiencia es fluida en los navegadores principales

**Restricciones:** La página debe ser compatible con los navegadores modernos más populares  
**Prioridad:** Alta  
**Estimación:** 13 hrs  
**Tipo:** Funcional

---

## Historia de usuario #7: Estadísticas para Admin

**Como** administrador  
**quiero** estadísticas múltiples y visualizaciones interactivas para ver quién juega más, menos y otros patrones de uso  
**para** tomar decisiones informadas sobre el desarrollo y balance del juego

### Validación:
- El panel muestra estadísticas de jugadores activos
- Existen visualizaciones gráficas interactivas
- Los datos se actualizan en tiempo real o periódicamente

**Restricciones:** Solo administradores autenticados pueden acceder al panel de estadísticas  
**Prioridad:** Media  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #8: Tablas con FK y PK

**Como** administrador  
**quiero** que la base de datos tenga más de dos tablas, cada una con llaves foráneas y primarias bien definidas  
**para** garantizar relaciones consistentes entre entidades del sistema

### Validación:
- Existen más de dos tablas en el esquema
- Cada tabla tiene una PK definida
- Las relaciones entre tablas usan FK correctamente

**Restricciones:** No deben existir tablas huérfanas sin relación con otras entidades  
**Prioridad:** Alta  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #9: Cardinalidad Definida

**Como** administrador  
**quiero** que la cardinalidad de las tablas esté bien definida con relaciones 1:N y 1:1  
**para** asegurar que el modelo de datos refleja correctamente la lógica del negocio

### Validación:
- El diagrama ER muestra relaciones 1:N y 1:1
- Las FK respetan las cardinalidades definidas
- No existen ambigüedades en las relaciones

**Restricciones:** Todas las relaciones deben estar documentadas en el diagrama entidad-relación  
**Prioridad:** Alta  
**Estimación:** 3 hrs  
**Tipo:** Funcional

---

## Historia de usuario #10: Tercera Forma Normal

**Como** administrador  
**quiero** que la base de datos esté en Tercera Forma Normal (3FN)  
**para** eliminar redundancias y garantizar la integridad de los datos

### Validación:
- No existen dependencias transitivas en ninguna tabla
- Cada atributo depende únicamente de la PK
- Se verificó el cumplimiento de 1FN, 2FN y 3FN

**Restricciones:** Cualquier modificación futura al esquema debe mantener la 3FN  
**Prioridad:** Alta  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #11: Control de Acceso por Rol

**Como** administrador  
**quiero** que el sistema tenga usuario y contraseña, y que cualquier usuario acceda a tutorial, personajes e inicio, pero no a estadísticas  
**para** proteger información sensible y controlar el acceso por roles

### Validación:
- Los usuarios no autenticados acceden a Inicio, Tutorial y Personajes
- Las estadísticas solo son visibles para administradores
- El sistema redirige correctamente según el rol del usuario

**Restricciones:** El sistema de autenticación debe usar contraseñas hasheadas  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #12: Acceso al Videojuego

**Como** administrador  
**quiero** controlar qué usuarios tienen permiso para jugar el videojuego  
**para** gestionar el acceso y eventuales restricciones por cuenta

### Validación:
- Solo usuarios autorizados pueden iniciar el juego
- El sistema verifica permisos antes de cargar el videojuego
- El administrador puede habilitar o deshabilitar el acceso de un usuario

**Restricciones:** El control de acceso debe validarse tanto en frontend como en backend  
**Prioridad:** Media  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #13: Personajes Interactivos

**Como** usuario  
**quiero** diferentes personajes que interactúen en el ambiente del juego  
**para** enriquecer la narrativa y la experiencia de juego

### Validación:
- Existen al menos dos facciones con personajes diferenciados
- Los personajes tienen representación visual y estadísticas
- Los personajes interactúan con el jugador según la lógica del juego

**Restricciones:** Los personajes deben ser coherentes con la estética cyberpunk de DeadDraw  
**Prioridad:** Media  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #14: Elementos Retadores

**Como** usuario  
**quiero** elementos retadores como tiempo, daño y dinero dentro del juego  
**para** que cada decisión tenga peso y la experiencia sea estratégicamente desafiante

### Validación:
- El sistema de daño funciona correctamente según el valor de las cartas
- El dinero se acumula y puede gastarse durante el run
- La dificultad escala a medida que avanza el juego

**Restricciones:** Los elementos deben estar balanceados para no hacer el juego injugable  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #15: Ambiente Visual Atractivo

**Como** administrador  
**quiero** un ambiente visual atractivo e inmersivo en todas las secciones de la página web  
**para** ofrecer una experiencia de usuario de alta calidad que refleje la identidad del juego

### Validación:
- Todas las secciones tienen diseño visual consistente con la estética cyberpunk
- Los elementos visuales cargan correctamente
- La interfaz es responsiva

**Restricciones:** El diseño debe respetar la paleta de colores y tipografía definidas para DeadDraw  
**Prioridad:** Media  
**Estimación:** 5 hrs  
**Tipo:** No funcional

---

## Historia de usuario #17: Guardar Partida con Pausa

**Como** usuario  
**quiero** guardar mi partida con una función de pausa visible dentro del videojuego  
**para** retomar exactamente donde lo dejé sin perder progreso

### Validación:
- El botón de pausa está visible durante el juego
- Al pausar se ofrece la opción de guardar
- Al cargar el juego se restaura el estado anterior

**Restricciones:** Solo se puede tener un guardado activo por usuario a la vez  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #18: Cinemáticas en el Juego

**Como** usuario  
**quiero** que haya cinemáticas dentro del juego  
**para** sumergirme en la narrativa y sentir que la historia avanza

### Validación:
- Existen cinemáticas al inicio y al derrotar jefes
- Las cinemáticas son omitibles
- El audio y video de las cinemáticas están sincronizados

**Restricciones:** Las cinemáticas deben poder saltarse para no interrumpir runs repetidos  
**Prioridad:** Baja  
**Estimación:** 13 hrs  
**Tipo:** Funcional

---

## Historia de usuario #19: Historia en el Videojuego

**Como** usuario  
**quiero** que el videojuego tenga una historia  
**para** tener motivación narrativa que complemente la jugabilidad

### Validación:
- Existe una narrativa ambiental coherente en el juego
- Las facciones y jefes tienen contexto narrativo
- La historia avanza conforme el jugador progresa

**Restricciones:** La narrativa debe comunicarse de forma ambiental, sin diálogos directos excesivos  
**Prioridad:** Media  
**Estimación:** 8 hrs  
**Tipo:** No funcional

---

## Historia de usuario #20: Jefe Final

**Como** usuario  
**quiero** que haya un jefe final en el juego  
**para** tener un objetivo claro y una culminación satisfactoria de cada run

### Validación:
- Cada tipo de run tiene un jefe final definido
- El jefe final es notablemente más difícil que los enemigos comunes
- Derrotar al jefe desbloquea contenido o beneficios permanentes

**Restricciones:** El jefe final debe ser coherente con la facción del run seleccionado  
**Prioridad:** Alta  
**Estimación:** 8 hrs  
**Tipo:** Funcional

---

## Historia de usuario #21: Final del Juego

**Como** usuario  
**quiero** que el juego tenga un final  
**para** sentir que mi progreso tiene un propósito y una conclusión narrativa

### Validación:
- Existe una pantalla o secuencia de final del juego
- El final se activa al completar los objetivos principales
- Se muestra el puntaje final y estadísticas del run

**Restricciones:** El juego puede continuar después del final narrativo para maximizar puntaje  
**Prioridad:** Media  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #22: Mecánicas Equilibradas

**Como** usuario  
**quiero** que el juego tenga buenas mecánicas bien equilibradas  
**para** que la experiencia sea justa, desafiante y satisfactoria

### Validación:
- El daño, la curación y el costo de habilidades están balanceados
- Ninguna estrategia domina completamente sobre las demás
- Las pruebas de usuario confirman que el juego se siente justo

**Restricciones:** El balance debe revisarse tras cada cambio significativo en las mecánicas  
**Prioridad:** Alta  
**Estimación:** 13 hrs  
**Tipo:** Funcional

---

## Historia de usuario #23: Juego Intuitivo

**Como** usuario  
**quiero** que el juego sea intuitivo  
**para** entender sus mecánicas rápidamente y disfrutar la experiencia

### Validación:
- El juego incluye un tutorial inicial que explica las mecánicas básicas
- El jugador puede acceder a consejos o ayudas

**Restricciones:** El juego mostrará consejos o pistas  
**Prioridad:** Media  
**Estimación:** 13 hrs  
**Tipo:** Funcional

---

## Historia de usuario #24: Mantener el Estilo Gráfico

**Como** usuario  
**quiero** que el juego mantenga su estilo gráfico en todo momento  
**para** tener una experiencia visual coherente durante toda la partida

### Validación:
- Todos los elementos visuales del juego siguen el mismo estilo artístico
- Los sprites, fondos y UI mantienen una paleta de colores consistente

**Restricciones:** El juego en todo momento mantendrá su estilo gráfico  
**Prioridad:** Media  
**Estimación:** 13 hrs  
**Tipo:** No funcional

---

## Historia de usuario #25: Página No Estática

**Como** usuario  
**quiero** que la página del juego tenga animaciones y elementos dinámicos  
**para** tener una experiencia visual más atractiva

### Validación:
- La página tendrá elementos que la hagan más dinámica
- La interfaz del juego no se percibe estática o monótona

**Restricciones:** Las animaciones y los elementos dinámicos no saturarán la página  
**Prioridad:** Media  
**Estimación:** 13 hrs  
**Tipo:** No funcional

---

## Historia de usuario #26: Diversión en el Juego

**Como** usuario  
**quiero** divertirme en el juego  
**para** tener una experiencia de entretenimiento satisfactoria

### Validación:
- Los jugadores reportan experiencia positiva en pruebas de usuario
- El loop de gameplay mantiene al jugador comprometido
- La curva de aprendizaje es accesible y gratificante

**Restricciones:** El juego debe ser entretenido tanto para jugadores casuales como para jugadores frecuentes  
**Prioridad:** Alta  
**Estimación:** 1 hr  
**Tipo:** No funcional

---

## Historia de usuario #27: Contexto Narrativo

**Como** usuario  
**quiero** entender qué va a pasar en el juego  
**para** tener contexto narrativo antes de comenzar a jugar

### Validación:
- Existe una introducción o pantalla de inicio con contexto del juego
- La narrativa ambiental comunica el mundo y la misión del jugador
- El jugador comprende su objetivo principal antes del primer run

**Restricciones:** La introducción debe poder omitirse para runs posteriores  
**Prioridad:** Media  
**Estimación:** 1 pt  
**Tipo:** Funcional

---

## Historia de usuario #28: Victoria y Derrota

**Como** usuario  
**quiero** tener condiciones claras de ganar o perder  
**para** entender el objetivo del juego y recibir retroalimentación sobre mi desempeño

### Validación:
- Existe una pantalla de game over cuando el jugador pierde
- Existe una pantalla de victoria al completar el run
- Ambas pantallas muestran estadísticas relevantes del run

**Restricciones:** Las condiciones de victoria y derrota deben ser consistentes con las reglas del roguelite  
**Prioridad:** Alta  
**Estimación:** 3 hrs  
**Tipo:** No funcional

---

## Historia de usuario #29: Reglas del Juego Definidas

**Como** jugador  
**quiero** que estén bien definidas las reglas del juego  
**para** tomar decisiones informadas y entender las consecuencias de mis acciones

### Validación:
- Existe una sección de tutorial o guía de reglas accesible
- Las reglas de combate con cartas están claramente explicadas
- El jugador puede consultar las reglas durante el juego

**Restricciones:** Las reglas deben ser consistentes y no cambiar sin justificación clara  
**Prioridad:** Alta  
**Estimación:** 2 hrs  
**Tipo:** No funcional

---

## Historia de usuario #30: Pérdidas y Conservación en Roguelite

**Como** jugador  
**quiero** saber qué pierdo dentro del Roguelite y qué conservo al terminar un run  
**para** planificar mi estrategia considerando la progresión permanente y temporal

### Validación:
- Se muestra claramente qué mejoras son permanentes y cuáles son por run
- Al morir, el jugador ve un resumen de lo perdido y lo conservado
- La pantalla de fin de run distingue entre progresión permanente y temporal

**Restricciones:** La distinción entre elementos permanentes y temporales debe ser visualmente clara  
**Prioridad:** Alta  
**Estimación:** 3 hrs  
**Tipo:** No funcional

---

## Historia de usuario #31: Niveles Diferentes en Cada Run

**Como** jugador  
**quiero** que haya niveles diferentes cada vez que se juegue  
**para** que cada run se sienta único y la rejugabilidad sea alta

### Validación:
- La distribución de cartas varía entre runs
- El orden de los cuartos o enemigos no es idéntico en dos runs consecutivos
- El jugador percibe variación real entre partidas

**Restricciones:** La variación debe mantenerse dentro de la estructura de dificultad progresiva del juego  
**Prioridad:** Alta  
**Estimación:** 4 hrs  
**Tipo:** No funcional

---

## Historia de usuario #32: Progresión del Personaje en Run

**Como** jugador  
**quiero** que mi personaje se vuelva progresivamente más fuerte dentro de un run  
**para** sentir un arco de poder durante la partida y recompensar la toma de decisiones

### Validación:
- El jugador puede adquirir mejoras de vida base o dinero durante el run
- Las habilidades compradas tienen impacto visible en el desempeño
- El personaje al final del run es notablemente más capaz que al inicio

**Restricciones:** La progresión debe estar balanceada para no eliminar el desafío del juego  
**Prioridad:** Alta  
**Estimación:** 3 hrs  
**Tipo:** Funcional

---

## Historia de usuario #33: Adquisición de Poder y Capacidades

**Como** jugador  
**quiero** que el jugador vaya adquiriendo poder, capacidades y energía a lo largo del juego  
**para** tener una sensación de crecimiento constante que motive continuar jugando

### Validación:
- Existen al menos tres tipos distintos de mejoras adquiribles
- Las mejoras tienen efecto perceptible en el gameplay
- El sistema de adquisición es intuitivo y accesible desde la interfaz

**Restricciones:** Las capacidades adquiridas no deben romper el balance del juego  
**Prioridad:** Alta  
**Estimación:** 3 hrs  
**Tipo:** Funcional

---

## Historia de usuario #34: Sistema de Cartas con Efectos

**Como** jugador  
**quiero** que existan cartas distintas con efectos diferentes, tanto positivos como negativos, que pertenezcan al jugador, a los enemigos o al entorno  
**para** que el sistema de cartas sea profundo y las decisiones tengan consecuencias variadas

### Validación:
- Existen cartas de jugador, enemigo y efectos especiales diferenciadas visualmente
- Cada carta tiene un efecto claramente descrito o representado
- Hay cartas con efectos positivos (curación, armas) y negativos (daño, debuffs)

**Restricciones:** Cada carta debe tener un valor numérico visible y un propósito claro dentro del sistema  
**Prioridad:** Alta  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #35: Interacción entre Cartas

**Como** jugador  
**quiero** que las cartas interactúen entre ellas, pudiendo jugarse una después de otra, combinarse y cambiar los efectos y mecánicas del Roguelite  
**para** que el juego tenga profundidad táctica y recompense el conocimiento del sistema de cartas

### Validación:
- Jugar cartas en secuencia puede generar efectos combinados
- El orden de las cartas jugadas afecta el resultado del cuarto
- Existen al menos dos combinaciones de cartas con efectos especiales

**Restricciones:** Las interacciones entre cartas deben estar documentadas o ser descubribles de forma intuitiva  
**Prioridad:** Alta  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---

## Historia de usuario #36: Combate Contra Jefe

**Como** jugador  
**quiero** poder llegar a un jefe en mi run y derrotarlo  
**para** tener un objetivo climático que ponga a prueba todo lo aprendido durante el run

### Validación:
- Cada run tiene un jefe al final accesible tras completar los cuartos previos
- El jefe tiene mecánicas de combate más complejas que los enemigos normales
- Derrotar al jefe desbloquea la conclusión del run y beneficios permanentes

**Restricciones:** El jefe debe ser desafiante pero derrotable con una estrategia correcta  
**Prioridad:** Alta  
**Estimación:** 6 hrs  
**Tipo:** Funcional

---

## Historia de usuario #37: Creación de Deck Propio

**Como** jugador  
**quiero** poder crear mi propio deck  
**para** personalizar mi estrategia de juego y experimentar con diferentes combinaciones de cartas

### Validación:
- Existe una interfaz de construcción de deck accesible desde el menú principal
- El jugador puede seleccionar y organizar cartas desbloqueadas en su deck
- El deck personalizado se usa en el siguiente run del jugador

**Restricciones:** Solo se pueden incluir cartas previamente desbloqueadas por el jugador  
**Prioridad:** Media  
**Estimación:** 5 hrs  
**Tipo:** Funcional

---
