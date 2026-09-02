-- Roles
INSERT INTO roles (id, name) VALUES (1, 'ADMIN');
INSERT INTO roles (id, name) VALUES (2, 'CUSTOMER');
INSERT INTO roles (id, name) VALUES (3, 'AUDITOR');

-- Users (passwords are BCrypt-encoded)
INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (1, 'Admin', 'User', '+1234567890', 'admin@minifin.com',
        '$2y$10$2pJ6o8GWN6/y9bCc0tcPheEC9GM1nxKwDgp8w.LSJYyBZLVRsQq/.',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (2, 'John', 'Doe', '+1234561234', 'customer@minifin.com',
        '$2y$10$gsgYr64oQAjrM.oL8RiDD.4lqUFPyYdYRBEzO1ItA6Rz1UtJBZ9Tq',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (3, 'Jane', 'Smith', '+1234565678', 'auditor@minifin.com',
        '$2y$10$9zC.I3cCSpykcKhemzKl4O3HdFhznMNZtfdjNa9kut5JlbWlntLma',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (4, 'Alice', 'Johnson', '+1234561111', 'alice@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (5, 'Bob', 'Williams', '+1234562222', 'bob@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (6, 'Carol', 'Brown', '+1234563333', 'carol@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (7, 'Dave', 'Miller', '+1234564444', 'dave@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (8, 'Eve', 'Davis', '+1234565555', 'eve@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (9, 'Frank', 'Garcia', '+1234566666', 'frank@minifin.com',
        '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
        NULL, TRUE, '2025-01-01 00:00:00');

INSERT INTO users (id, first_name, last_name, phone_number, email, password, profile_picture_url, active, created_at)
VALUES (10, 'Grace', 'Martinez', '+1234567777', 'grace@minifin.com',
         '$2y$10$2OnCg6i6VPjXKFfKAZjX6uqyFVXNDzzlvJSNEm5dIX7mm2ud0Q8lO',
         NULL, TRUE, '2025-01-01 00:00:00');

-- User-Role mappings
INSERT INTO users_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO users_roles (user_id, role_id) VALUES (2, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (3, 3);
INSERT INTO users_roles (user_id, role_id) VALUES (4, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (5, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (6, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (7, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (8, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (9, 2);
INSERT INTO users_roles (user_id, role_id) VALUES (10, 2);

-- Accounts
INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (1, '6600000001', 5000.00, 'SAVING', 'ACTIVE', 'USD', 1);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (2, '6600000002', 10000.00, 'SAVING', 'ACTIVE', 'USD', 2);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (3, '6600000003', 2500.00, 'CURRENT', 'ACTIVE', 'USD', 2);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (4, '6600000004', 7500.00, 'SAVING', 'ACTIVE', 'USD', 3);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (5, '6600000005', 15200.50, 'SAVING', 'ACTIVE', 'USD', 4);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (6, '6600000006', 3400.75, 'CURRENT', 'ACTIVE', 'USD', 4);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (7, '6600000007', 8900.00, 'SAVING', 'ACTIVE', 'USD', 5);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (8, '6600000008', 1200.00, 'CURRENT', 'ACTIVE', 'USD', 5);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (9, '6600000009', 22000.00, 'SAVING', 'ACTIVE', 'USD', 6);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (10, '6600000010', 4500.25, 'SAVING', 'ACTIVE', 'USD', 7);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (11, '6600000011', 980.50, 'CURRENT', 'ACTIVE', 'USD', 7);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (12, '6600000012', 31000.00, 'SAVING', 'ACTIVE', 'USD', 8);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (13, '6600000013', 6700.00, 'SAVING', 'ACTIVE', 'USD', 9);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (14, '6600000014', 2100.00, 'CURRENT', 'ACTIVE', 'USD', 9);

INSERT INTO account (id, account_number, balance, account_type, account_status, currency, user_id)
VALUES (15, '6600000015', 18500.00, 'SAVING', 'ACTIVE', 'USD', 10);

-- Transactions for customer (demo user)
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (2000.00, 'DEPOSIT', '2025-01-16 12:00:00', 'Salary deposit', 'SUCCESS', 2, '6600000002', '6600000002');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (500.00, 'WITHDRAW', '2025-01-21 12:00:00', 'ATM withdrawal', 'SUCCESS', 2, '6600000002', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1200.00, 'TRANSFER', '2025-01-26 12:00:00', 'Rent payment', 'SUCCESS', 2, '6600000002', '6600000005');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (350.00, 'WITHDRAW', '2025-01-31 12:00:00', 'Grocery shopping', 'SUCCESS', 3, '6600000003', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (750.00, 'TRANSFER', '2025-02-05 12:00:00', 'Utility bills', 'SUCCESS', 2, '6600000002', '6600000007');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (5000.00, 'TRANSFER', '2025-02-08 12:00:00', 'Savings transfer', 'SUCCESS', 3, '6600000003', '6600000002');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (100.00, 'DEPOSIT', '2025-02-10 12:00:00', 'Cash deposit', 'SUCCESS', 2, '6600000002', '6600000002');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (200.00, 'WITHDRAW', '2025-02-12 12:00:00', 'Failed ATM attempt', 'FAILED', 2, '6600000002', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1500.00, 'TRANSFER', '2025-02-14 12:00:00', 'Transfer to auditor', 'SUCCESS', 2, '6600000002', '6600000004');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (800.00, 'DEPOSIT', '2025-02-15 06:00:00', 'Freelance payment', 'SUCCESS', 2, '6600000002', '6600000002');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (250.00, 'WITHDRAW', '2025-02-15 10:00:00', 'Coffee shop', 'SUCCESS', 3, '6600000003', NULL);

-- Transactions for alice
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (5000.00, 'DEPOSIT', '2025-01-18 12:00:00', 'Monthly salary', 'SUCCESS', 5, '6600000005', '6600000005');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (300.00, 'TRANSFER', '2025-01-24 12:00:00', 'Insurance payment', 'SUCCESS', 5, '6600000005', '6600000009');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (150.00, 'WITHDRAW', '2025-01-28 12:00:00', 'Cash withdrawal', 'SUCCESS', 6, '6600000006', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (2000.00, 'TRANSFER', '2025-02-03 12:00:00', 'Investment transfer', 'SUCCESS', 5, '6600000005', '6600000012');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (500.00, 'DEPOSIT', '2025-02-10 12:00:00', 'Side project income', 'SUCCESS', 5, '6600000005', '6600000005');

-- Transactions for bob
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (3200.00, 'DEPOSIT', '2025-01-20 12:00:00', 'Paycheck', 'SUCCESS', 7, '6600000007', '6600000007');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (800.00, 'TRANSFER', '2025-01-27 12:00:00', 'Loan repayment', 'SUCCESS', 7, '6600000007', '6600000015');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (200.00, 'WITHDRAW', '2025-02-07 12:00:00', 'Weekend spending', 'SUCCESS', 8, '6600000008', NULL);

-- Transactions for carol
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (8500.00, 'DEPOSIT', '2025-01-26 12:00:00', 'Bonus deposit', 'SUCCESS', 9, '6600000009', '6600000009');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1200.00, 'TRANSFER', '2025-02-01 12:00:00', 'Family support', 'SUCCESS', 9, '6600000009', '6600000010');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (400.00, 'WITHDRAW', '2025-02-09 12:00:00', 'Shopping', 'SUCCESS', 9, '6600000009', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (600.00, 'TRANSFER', '2025-02-13 12:00:00', 'Contribution to shared account', 'PENDING', 9, '6600000009', '6600000013');

-- Transactions for dave
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1800.00, 'DEPOSIT', '2025-01-22 12:00:00', 'Freelance gig', 'SUCCESS', 10, '6600000010', '6600000010');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (650.00, 'TRANSFER', '2025-01-30 12:00:00', 'Shared rent', 'SUCCESS', 10, '6600000010', '6600000005');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (90.00, 'WITHDRAW', '2025-02-11 12:00:00', 'Transport', 'SUCCESS', 11, '6600000011', NULL);

-- Transactions for eve
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (12000.00, 'DEPOSIT', '2025-02-01 12:00:00', 'Contract payment', 'SUCCESS', 12, '6600000012', '6600000012');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (3000.00, 'TRANSFER', '2025-02-06 12:00:00', 'Investment', 'SUCCESS', 12, '6600000012', '6600000015');

-- Transactions for frank
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (2800.00, 'DEPOSIT', '2025-01-24 12:00:00', 'Monthly pay', 'SUCCESS', 13, '6600000013', '6600000013');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (450.00, 'WITHDRAW', '2025-02-04 12:00:00', 'Electronics purchase', 'SUCCESS', 14, '6600000014', NULL);

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (700.00, 'TRANSFER', '2025-02-12 12:00:00', 'Pending transfer', 'PENDING', 13, '6600000013', '6600000010');

-- Transactions for grace
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (6200.00, 'DEPOSIT', '2025-01-28 12:00:00', 'Quarterly bonus', 'SUCCESS', 15, '6600000015', '6600000015');

INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1000.00, 'TRANSFER', '2025-02-08 12:00:00', 'Loan received', 'SUCCESS', 15, '6600000007', '6600000015');

-- Auditor transactions
INSERT INTO transactions (amount, transaction_type, transaction_date_time, description, status, account_id, source_account, destination_account)
VALUES (1500.00, 'TRANSFER', '2025-02-14 12:00:00', 'Transfer from customer', 'SUCCESS', 4, '6600000002', '6600000004');
