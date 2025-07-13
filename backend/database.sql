CREATE DATABASE sports_booking;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
    id SERIAL PRIMARY KEY,            
    name VARCHAR(100) NOT NULL,       
    description TEXT,                 
    location VARCHAR(255),            
    price_per_hour DECIMAL(10,2) NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    field_id INT REFERENCES fields(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,  
    time_slot_id INT REFERENCES time_slots(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guest_name VARCHAR(100),
    guest_phone VARCHAR(20),
    created_by INT REFERENCES users(id);
);

CREATE TABLE reset_password (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    slot_name VARCHAR(50) NOT NULL,  
    start_time TIME NOT NULL,        
    end_time TIME NOT NULL           
);
