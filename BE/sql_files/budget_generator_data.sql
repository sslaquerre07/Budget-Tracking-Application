-- -----------------------------------------------------
-- Inserting sample data into the User table
-- -----------------------------------------------------
INSERT INTO user (email, password) VALUES 
('john.doe@example.com', 'password123'),
('jane.smith@example.com', 'mypassword456');

-- -----------------------------------------------------
-- Inserting sample data into the Budget table
-- -----------------------------------------------------
INSERT INTO budget (title, creation_date, response) VALUES 
('Monthly Household Budget', '2025-03-01', 'All expenses for March'),
('Vacation Budget', '2025-04-01', 'Budget plan for the vacation trip');

-- -----------------------------------------------------
-- Inserting sample data into the Category table
-- -----------------------------------------------------
INSERT INTO category (title, budget_id, is_expense) VALUES 
('Groceries', 1, true),
('Entertainment', 1, true),
('Dining Out', 1, true),
('Flights', 2, true),
('Hotel', 2, true),
('Activities', 2, true);

-- -----------------------------------------------------
-- Inserting sample data into the Account table
-- -----------------------------------------------------
INSERT INTO account (title, balance, category_id) VALUES 
('Walmart', 200.00, 1),  -- Groceries
('AMC Theater', 150.00, 2),  -- Entertainment
('Restaurant XYZ', 100.00, 3),  -- Dining Out
('Delta Airlines', 1000.00, 4),  -- Flights
('Hilton Hotel', 800.00, 5),  -- Hotel
('Theme Park Tickets', 500.00, 6);  -- Activities
