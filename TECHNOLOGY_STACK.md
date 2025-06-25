# NoteCash Technology Stack

This document outlines the technology choices for the NoteCash desktop application.

## Core Frameworks

- **[Tauri](https://tauri.app/)**: For building the cross-platform desktop application shell.
- **[Vue.js 3](https://vuejs.org/)**: For building the user interface.
- **[Quasar Framework](https://quasar.dev/)**: UI component library for Vue.js, providing a rich set of components and a cohesive design system.
- **[TypeScript](https://www.typescriptlang.org/)**: For static typing, improving code quality and maintainability.

## Frontend

- **State Management**: **[Pinia](https://pinia.vuejs.org/)** - The official state management library for Vue.js.
- **Routing**: **[Vue Router](https://router.vuejs.org/)** - The official router for Vue.js.
- **PDF Generation**:
  - **[html2canvas-pro](https://github.com/yorickshan/html2canvas-pro)**: Takes a "screenshot" of your application's UI (e.g., the list of payments) and draws it onto a canvas element.
  - **[jspdf](https://github.com/parallax/jsPDF)**: Takes the image from the canvas created by `html2canvas-pro` and embeds it into a PDF document, allowing the user to save it as a file. They work in tandem to create the final PDF from your UI.
- **Date Handling**:
  - **[date-fns](https://date-fns.org/)**: A modern JavaScript date utility library. It will help with parsing user input for payment dates, formatting them consistently for display (e.g., `yyyy-MM-dd` or `July 16, 2024`), and sorting payments chronologically.

## Backend & System (Tauri Plugins)

The official Tauri plugins are managed in the [`/tauri-apps/plugins-workspace`](https://github.com/tauri-apps/plugins-workspace).

- **Database**:
  - **[@tauri-apps/plugin-sql](https://tauri.app/plugin/sql/)**: For database access. To use it with SQLite, you enable a feature flag.
  - **Driver**: The SQLite driver is included with the plugin and activated using the command: `cargo add tauri-plugin-sql --features sqlite`. This command, run in the `src-tauri` directory, configures the plugin to work with a SQLite database, which will store your data in a single file.
- **Native UI**:
  - **[@tauri-apps/plugin-dialog](https://tauri.app/plugin/dialog/)**: For using native file open/save dialogs.
  - **[@tauri-apps/plugin-shell](https://tauri.app/plugin/shell/)**: To interact with the user's shell, for example, to open the generated PDF file with the default system viewer.
- **File System**:
  - **[@tauri-apps/plugin-fs](https://tauri.app/plugin/file-system/)**: For reading from and writing to the file system.
- **User Experience**:
  - **[@tauri-apps/plugin-window-state](https://tauri.app/plugin/window-state/)**: To save and restore window size and position between application launches. This provides a much better user experience.
- **Application Management**:
  - **[@tauri-apps/plugin-updater](https://tauri.app/plugin/updater/)**: Essential for distributing your application and providing automatic updates to your users.
  - **[@tauri-apps/plugin-log](https://tauri.app/plugin/logging/)**: For robust logging. It can log to the console, a file, and even a remote web server, which is invaluable for debugging issues in production.

This stack gives you a powerful and modern toolset to build a robust and user-friendly desktop application.
