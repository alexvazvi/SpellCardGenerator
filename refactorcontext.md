# Plan de Refactorización y Mejora de la Página "Cartas Guardadas"

## Objetivo Principal

El objetivo es transformar la página de "Cartas Guardadas" (`SavedCardsPage.tsx`) para que, en lugar de mostrar una lista simple, muestre las cartas guardadas como previsualizaciones interactivas y giratorias. Para lograrlo, es necesario refactorizar los componentes de previsualización de cartas para que sean reutilizables.

---

### Fase 1: Refactorización de Componentes de Previsualización

**Contexto:** Los componentes `GenericCardPreview` y `CardBackPreview` están actualmente definidos dentro de `CardGeneratorPage.tsx`, lo que impide su reutilización en otras partes de la aplicación.

**Acciones:**

1.  **Extraer `GenericCardPreview`:**
    *   **Crear un nuevo fichero:** `src/components/GenericCardPreview.tsx`.
    *   **Mover el código:** Cortar todo el código del componente `GenericCardPreview` (desde la declaración de la función hasta su cierre) de `CardGeneratorPage.tsx` y pegarlo en el nuevo fichero.
    *   **Añadir importaciones necesarias:** Asegurarse de que el nuevo fichero importa `React`, `Rnd` y los tipos necesarios como `ElementName`.
    *   **Exportar el componente:** Añadir `export default GenericCardPreview;` al final del nuevo fichero.

2.  **Extraer `CardBackPreview`:**
    *   **Crear un nuevo fichero:** `src/components/CardBackPreview.tsx`.
    *   **Mover el código:** Realizar la misma operación que en el paso anterior, pero con el componente `CardBackPreview`.
    *   **Añadir importaciones y exportar** el componente.

3.  **Actualizar `CardGeneratorPage.tsx`:**
    *   **Eliminar el código antiguo:** Borrar las declaraciones de los dos componentes que acabamos de mover.
    *   **Importar los nuevos componentes:** Añadir las siguientes líneas en la parte superior de `CardGeneratorPage.tsx`:
        ```javascript
        import GenericCardPreview from '../../components/GenericCardPreview';
        import CardBackPreview from '../../components/CardBackPreview';
        ```

---

### Fase 2: Creación del Componente `SavedCardItem`

**Contexto:** Necesitamos un componente reutilizable para mostrar cada carta guardada de forma individual, con su propia funcionalidad de giro y botones de acción.

**Acciones:**

1.  **Crear el fichero del componente:** `src/components/SavedCardItem.tsx`.
2.  **Implementar la lógica del componente:**
    *   **Props:** El componente debe aceptar las siguientes propiedades: `card` (el objeto completo de la carta guardada), `onLoad` (función para cargar la carta) y `onDelete` (función para eliminarla).
    *   **Estado Interno:** Debe tener su propio estado para controlar si la carta está girada: `const [isFlipped, setIsFlipped] = useState(false);`.
    *   **Estructura JSX:**
        *   Un contenedor principal con la clase `saved-card-item`.
        *   Un `card-flipper-container` a menor escala (usando `transform: scale()`).
        *   Dentro, usar los componentes `<GenericCardPreview />` y `<CardBackPreview />` que hemos extraído.
        *   **Importante:** A estos componentes de previsualización se les deben pasar las propiedades de la carta (`card.cardProps`, `card.titleProps`, etc.) pero con las funciones interactivas (`onElementClick`, `handleDragStart`, etc.) desactivadas o pasadas como funciones vacías, ya que en esta vista la carta no es editable.
        *   Debajo de la previsualización, añadir los botones de "Cargar" y "Eliminar".

---

### Fase 3: Reconstrucción de `SavedCardsPage.tsx`

**Contexto:** La página actual es funcional pero muy simple. Hay que restaurar la estructura anterior y añadir la nueva visualización de cartas.

**Acciones:**

1.  **Restaurar Estructura:**
    *   Volver a añadir la maquetación de ejemplo que incluía las "Barajas" y la sección "To-Do" para no perder esa estructura futura.
2.  **Añadir Nueva Sección:**
    *   Crear un nuevo contenedor con el título "Cartas sin Baraja".
3.  **Implementar la Lógica:**
    *   Usar `useEffect` para leer las cartas del `localStorage`.
    *   Dentro de la nueva sección, mapear el listado de cartas guardadas.
    *   Por cada `card` en el listado, renderizar el componente `<SavedCardItem card={card} onLoad={handleLoadCard} onDelete={handleDeleteCard} />`.
    *   Asegurarse de que las funciones `handleLoadCard` y `handleDeleteCard` están correctamente implementadas.

---

### Fase 4: Estilos Finales (CSS)

**Acciones:**

1.  **Crear `SavedCardItem.css` (o añadir a `SavedCardsPage.css`):**
    *   Crear los estilos para `.saved-card-item`, dándole un tamaño y un fondo.
    *   Aplicar un `transform: scale(0.6)` o similar al contenedor de la previsualización para hacerla más pequeña. Usar `transform-origin: top left;` para que el escalado se comporte de forma predecible.
    *   Estilizar los botones de "Cargar" y "Eliminar".
2.  **Ajustar `SavedCardsPage.css`:**
    *   Crear los estilos para la nueva sección "Cartas sin Baraja", usando un `grid` para mostrar los `SavedCardItem` de forma ordenada.
