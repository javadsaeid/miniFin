CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    profile_picture_url VARCHAR(255) UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(15) UNIQUE NOT NULL,
    balance DECIMAL(19, 2) NOT NULL DEFAULT 0,
    account_type ENUM('SAVING', 'CURRENT') NOT NULL,
    account_status ENUM('ACTIVE', 'SUSPENDED', 'CLOSED') NOT NULL,
    currency ENUM('USD', 'EUR', 'NGN') NOT NULL,
    closed_at DATETIME,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(15, 5) NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL,
    transaction_date_time DATETIME NOT NULL,
    description TEXT NOT NULL,
    status ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL,
    source_account VARCHAR(255),
    destination_account VARCHAR(255),
    account_id BIGINT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    body TEXT,
    type ENUM('EMAIL', 'SMS', 'PUSH') NOT NULL,
    created_at DATETIME NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE password_reset_code (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    expiry_date_time DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
