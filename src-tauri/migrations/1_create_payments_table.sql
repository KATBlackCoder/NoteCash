-- Create the payments table
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    payment_date TEXT NOT NULL,
    amount REAL NOT NULL,
    reason TEXT
); 