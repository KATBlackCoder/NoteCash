# NoteCash Development Roadmap

This document outlines the planned development phases for the NoteCash application.

---

### Phase 1: Foundation & Core UI ✅

_Objective: Set up the backend, database, and the main user interface for viewing and adding data._
_Tauri Plugins Needed: `tauri-plugin-sql`_
_NPM Packages Needed: `pinia`, `naive-ui`, `@vicons/carbon`, `vfonts`_

1.  **Database Schema (Rust & Tauri)**
    - [x] Define the database schema for payments (`id`, `customer_name`, `payment_date`, `amount`, `reason`).
    - [x] Use `tauri-plugin-sql`'s migration feature in Rust to create the initial `payments` table.
    - [x] Initialize the database connection when the Tauri application starts.
    - [x] Update `capabilities` to allow `sql:allow-execute` for writing data.

2.  **Main UI Layout (Vue & Naive UI)**
    - [x] Design the main page using Naive UI components (e.g., `n-layout`, `n-space`).
    - [x] Create a form at the top of the page for adding new payments, using `n-input`, `n-date-picker`, and `n-button`. This form should now include a field for the `reason`.
    - [x] Add an `n-data-table` component below the form to display the list of payments, including the new `reason` column.

3.  **State Management (Pinia)**
    - [x] Create a `payments` store in Pinia to manage the application's state.
    - [x] Define state for the list of payments and any loading/error states.
    - [x] Create an action to fetch all payments from the backend.

4.  **UI/UX Improvements**
    - [x] Implement proper navigation with Vue Router.
    - [x] Create separate pages for adding payments and viewing payment records.
    - [x] Add a consistent header with navigation links.
    - [x] Implement theme toggle functionality (light/dark mode).
    - [x] Use proper font styling with vfonts (Lato for text, Fira Code for code).

---

### Phase 2: Core Functionality (CRUD) ✅

_Objective: Implement the core Create, Read, Update, and Delete operations for payments._
_Tauri Plugins Needed: `@tauri-apps/plugin-dialog`_

1.  **Create & Read Payments**
    - [x] On application startup, call the Pinia action to fetch and display all existing payments in the `n-data-table`.
    - [x] Connect the "Add Payment" form to a Pinia action that calls a Tauri command to `INSERT` the new payment into the database.
    - [x] After adding a new payment, automatically refresh the list in the UI.

2.  **Update Payments**
    - [x] Add an "Edit" button to each row in the payments table.
    - [x] Clicking "Edit" will open an `n-modal` component pre-filled with the selected payment's data.
    - [x] Implement the save logic in the dialog to call a Tauri `UPDATE` command.
    - [x] Refresh the UI with the updated data.

3.  **Delete Payments**
    - [x] Add a "Delete" button to each row.
    - [x] On click, use the `@tauri-apps/plugin-dialog` to show a confirmation prompt.
    - [x] If confirmed, call a Tauri `DELETE` command and remove the payment from the list.

---

### Phase 3: PDF Export ✅

_Objective: Allow users to save the payment list as a PDF file._
_Tauri Plugins Needed: `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`, `@tauri-apps/plugin-opener`_
_NPM Packages Needed: `html2canvas-pro`, `jspdf`_

1.  **Implement PDF Generation**
    - [x] Add an "Export to PDF" button to the UI.
    - [x] On click, use `html2canvas-pro` to capture the payments table (or a specially formatted version of it).
    - [x] Use `jspdf` to convert the resulting canvas image into a PDF document.

2.  **Save PDF to Disk**
    - [x] Use `@tauri-apps/plugin-dialog` to open a native "Save File" dialog for the user to choose a location and filename.
    - [x] Use `@tauri-apps/plugin-fs` to write the generated PDF data to the selected file path.
    - [x] ~~(Optional) Use `@tauri-apps/plugin-opener` to automatically open the saved PDF for the user.~~

---

### Phase 4: Polishing & Refinements 🔄

_Objective: Improve the user experience and add final touches._
_Tauri Plugins Needed: `@tauri-apps/plugin-window-state`, `@tauri-apps/plugin-log`_
_NPM Packages Needed: `date-fns`_

1.  **UX Enhancements**
    - [x] Implement consistent date formatting using `date-fns` across the application.
    - [ ] Use `@tauri-apps/plugin-window-state` to save and restore the window's size and position.
    - [ ] Add loading indicators (e.g., `n-spin`) during database operations.
    - [ ] Provide user feedback on success or failure of operations using Naive UI's `notification` system.

2.  **Error Handling & Logging**
    - [x] Implement basic error handling for database operations.
    - [ ] Implement comprehensive error handling for all Tauri command calls.
    - [ ] Use the `@tauri-apps/plugin-log` to log errors to a file for easier debugging.

3.  **Final Styling**
    - [ ] Review and finalize the application's theme and layout for a clean, professional look.

---

### Future Enhancements

_Ideas for future versions of NoteCash._

- [ ] Customer management (separate table for customers).
- [ ] Reporting and charts (e.g., total income per month).
- [ ] Data filtering and searching in the main table.
- [ ] Data import/export via CSV.
- [ ] Application settings page (e.g., currency, date format).
