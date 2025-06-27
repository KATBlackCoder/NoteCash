# NoteCash

NoteCash is a simple, cross-platform desktop application designed for tracking payments. Built with a modern technology stack, it provides a clean interface for managing payment records, including customer names, dates, amounts, and reasons for payment.

The application allows users to add, view, edit, and delete payments, as well as export the payment list to a PDF file.

## Technology Stack

The project is built with a combination of web technologies and Rust for a fast, secure, and maintainable desktop experience.

- **Core Frameworks**: [Tauri](https://tauri.app/), [Vue.js 3](https://vuejs.org/), [Naive UI](https://www.naiveui.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Database**: SQLite via `@tauri-apps/plugin-sql`

For a complete list of technologies and plugins used, please see the [TECHNOLOGY_STACK.md](TECHNOLOGY_STACK.md) file.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- [Rust](https://www.rust-lang.org/) and its build tools.

### Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    This command will start the frontend development server and the Tauri application in development mode.
    ```bash
    npm run tauri dev
    ```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Volar (Vue Tooling)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
