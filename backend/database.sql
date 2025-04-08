CREATE DATABASE sports_booking;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user', 
    status VARCHAR(20) DEFAULT 'active', 
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
    start_time TIME NOT NULL,        
    end_time TIME NOT NULL,          
    status VARCHAR(20) DEFAULT 'pending',  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, 
    status VARCHAR(20) DEFAULT 'sent', 
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE field_availability (
    id SERIAL PRIMARY KEY,              
    field_id INT REFERENCES fields(id) ON DELETE CASCADE,  
    day_of_week VARCHAR(10) NOT NULL,    
    start_time TIME NOT NULL,            
    end_time TIME NOT NULL               
);

CREATE TABLE reset_password (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

