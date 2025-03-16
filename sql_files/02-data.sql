INSERT INTO user (email, password) VALUES 
('john.doe@example.com', 'password123'),
('jane.smith@example.com', 'mypassword456');

INSERT INTO budget (title, creation_date, budget_type, response, user_email) VALUES 
('Monthly Household Budget', '2025-03-01', 'MONTHLY', 
    'This budget outlines expected expenses for March, including groceries, entertainment, and dining out. The plan aims to balance spending while saving for unexpected expenses.', 
    'jane.smith@example.com'),
    
('Vacation Budget', '2025-04-01', 'MONTHLY', 
    'This budget is designed to cover the costs of your upcoming vacation, including flights, hotel accommodations, and activities. The goal is to stay within the planned budget while allowing for flexibility in spending.', 
    'jane.smith@example.com');

INSERT INTO category (title, budget_id, category_type) VALUES 
('Groceries', 1, "INCOME"),
('Entertainment', 1, "INCOME"),
('Dining Out', 1, "INCOME"),
('Flights', 2, "INCOME"),
('Hotel', 2, "INCOME"),
('Activities', 2, "INCOME");

INSERT INTO account (title, balance, category_id) VALUES 
('Walmart', 200.00, 1),  -- Groceries
('AMC Theater', 150.00, 2),  -- Entertainment
('Restaurant XYZ', 100.00, 3),  -- Dining Out
('Delta Airlines', 1000.00, 4),  -- Flights
('Hilton Hotel', 800.00, 5),  -- Hotel
('Theme Park Tickets', 500.00, 6);  -- Activities