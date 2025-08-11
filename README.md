# Spell Card Generator - Forja tu Grimorio Digital

![Spell Card Generator Screenshot](https://i.imgur.com/your-screenshot.png) <!-- Reemplazar con una captura de pantalla real -->

Bienvenido al **Spell Card Generator**, una aplicación web creada con React y Vite para que los entusiastas de Dungeons & Dragons 5e puedan crear, gestionar y exportar sus propias cartas de hechizos personalizadas. Olvídate de las fichas de papel y lleva tu grimorio al siguiente nivel.

## ✨ Características Principales

-   **🧙 Creador de Hechizos Intuitivo**: Un formulario con el diseño de una carta de hechizo que te permite añadir nuevos conjuros de forma inmersiva.
-   **✍️ Edición en el Sitio**: Activa el "Modo Edición" y haz clic directamente en cualquier texto de una carta para modificarlo al instante.
-   **📂 Importación Masiva**: Añade docenas de hechizos en segundos, ya sea subiendo un archivo `.json` o pegando el texto directamente.
-   **📥 Exportación a PDF Profesional**: Genera un PDF en formato A4 listo para imprimir, con 9 cartas por página y sus respectivos reversos, optimizado para impresión a doble cara.
-   **🔍 Búsqueda y Paginación**: Encuentra cualquier hechizo al instante con el buscador y navega por tu grimorio con una paginación clara y sencilla.
-   **🎨 Estética D&D Cuidada**: Una interfaz diseñada para ser inmersiva, con un tema de pergamino sobre madera, tipografías fantásticas y un modo oscuro temático.
-   **📱 Diseño Responsivo**: La aplicación se adapta para que puedas gestionar tus hechizos tanto en tu ordenador de escritorio como en una tablet.

## 🛠️ Tecnologías Utilizadas

-   **Frontend**: React, Vite, TypeScript
-   **Generación de PDF**: jsPDF
-   **Estilos**: CSS (con variables para theming)
-   **Iconografía**: Font Awesome

## 🚀 Cómo Empezar

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### Prerrequisitos

-   Node.js (versión 18.x o superior)
-   npm (normalmente se instala con Node.js)

### Instalación

1.  **Clona el repositorio:**
    ```shell
    git clone https://github.com/alexvazvi/SpellCardGenerator.git
    ```

2.  **Navega al directorio del proyecto:**
    ```shell
    cd SpellCardGenerator
    ```

3.  **Instala las dependencias:**
    ```shell
    npm install
    ```

4.  **Inicia el servidor de desarrollo:**
    ```shell
    npm run dev
    ```

¡Y listo! Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal) en tu navegador para ver la aplicación.

## 📄 Formato de Importación JSON

Para usar la funcionalidad de importación, tus archivos o texto JSON deben seguir esta estructura: un array de objetos, donde cada objeto es un hechizo.

```json
[
  {
    "name": "Proyectil Mágico",
    "level": "1",
    "school": "Evocación",
    "castingTime": "1 acción",
    "range": "120 pies",
    "components": "V, S",
    "duration": "Instantánea",
    "description": "Creas tres dardos brillantes de fuerza mágica..."
  }
]
```
Puedes usar el botón "Copiar Ejemplo" en la sección de importación por texto para obtener una plantilla.
