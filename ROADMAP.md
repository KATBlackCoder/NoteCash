# NoteCash Development Roadmap

This document outlines the planned development phases for the NoteCash application.

---

### Phase 1: Foundation & Core UI

_Objective: Set up the backend, database, and the main user interface for viewing and adding data._

1.  **Database Schema (Rust & Tauri)**
    - [ ] Define the database schema for payments (`id`, `customer_name`, `payment_date`, `amount`, `reason`).
    - [ ] Use `tauri-plugin-sql`'s migration feature in Rust to create the initial `payments` table.
    - [ ] Initialize the database connection when the Tauri application starts.
    - [ ] Update `capabilities` to allow `sql:allow-execute` for writing data.

2.  **Main UI Layout (Vue & Quasar)**
    - [ ] Design the main page (`IndexPage.vue`) using Quasar components (`QLayout`, `QPage`).
    - [ ] Create a form at the top of the page for adding new payments, using `QInput`, `QDate`, and `QBtn`. This form should now include a field for the `reason`.
    - [ ] Add a `QTable` component below the form to display the list of payments, including the new `reason` column.

3.  **State Management (Pinia)**
    - [ ] Create a `payments` store in Pinia to manage the application's state.
    - [ ] Define state for the list of payments and any loading/error states.
    - [ ] Create an action to fetch all payments from the backend.

---

### Phase 2: Core Functionality (CRUD)

_Objective: Implement the core Create, Read, Update, and Delete operations for payments._

1.  **Create & Read Payments**
    - [ ] On application startup, call the Pinia action to fetch and display all existing payments in the `QTable`.
    - [ ] Connect the "Add Payment" form to a Pinia action that calls a Tauri command to `INSERT` the new payment into the database.
    - [ ] After adding a new payment, automatically refresh the list in the UI.

2.  **Update Payments**
    - [ ] Add an "Edit" button to each row in the payments table.
    - [ ] Clicking "Edit" will open a `QDialog` component pre-filled with the selected payment's data.
    - [ ] Implement the save logic in the dialog to call a Tauri `UPDATE` command.
    - [ ] Refresh the UI with the updated data.

3.  **Delete Payments**
    - [ ] Add a "Delete" button to each row.
    - [ ] On click, use the `@tauri-apps/plugin-dialog` to show a confirmation prompt.
    - [ ] If confirmed, call a Tauri `DELETE` command and remove the payment from the list.

---

### Phase 3: PDF Export

_Objective: Allow users to save the payment list as a PDF file._

1.  **Implement PDF Generation**
    - [ ] Add an "Export to PDF" button to the UI.
    - [ ] On click, use `html2canvas-pro` to capture the payments table (or a specially formatted version of it).
    - [ ] Use `jspdf` to convert the resulting canvas image into a PDF document.

2.  **Save PDF to Disk**
    - [ ] Use `@tauri-apps/plugin-dialog` to open a native "Save File" dialog for the user to choose a location and filename.
    - [ ] Use `@tauri-apps/plugin-fs` to write the generated PDF data to the selected file path.
    - [ ] (Optional) Use `@tauri-apps/plugin-shell` to automatically open the saved PDF for the user.

---

### Phase 4: Polishing & Refinements

_Objective: Improve the user experience and add final touches._

1.  **UX Enhancements**
    - [ ] Use `@tauri-apps/plugin-window-state` to save and restore the window's size and position.
    - [ ] Add loading indicators (e.g., `QSpinner`) during database operations.
    - [ ] Provide user feedback on success or failure of operations using Quasar's `QNotify` plugin.

2.  **Error Handling & Logging**
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
