-- MySQL Database Schema for Ride Fare Comparator

-- Create database
CREATE DATABASE IF NOT EXISTS ride_fare_comparator;
USE ride_fare_comparator;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Providers table (seed data)
CREATE TABLE providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  app_scheme VARCHAR(100),  -- Deep link scheme
  play_store_url VARCHAR(500),
  supports_bike TINYINT(1) DEFAULT 0,
  supports_auto TINYINT(1) DEFAULT 0,
  supports_cab TINYINT(1) DEFAULT 0,
  supports_parcel TINYINT(1) DEFAULT 0,
  supports_rental TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed providers
INSERT INTO providers (name, logo_url, app_scheme, play_store_url, supports_bike, supports_auto, supports_cab, supports_parcel, supports_rental) VALUES
('Ola', 'https://logo.clearbit.com/ola.com', 'olacabs://', 'https://play.google.com/store/apps/details?id=com.olacabs.customer', 1, 1, 1, 1, 1),
('Uber', 'https://logo.clearbit.com/uber.com', 'uber://', 'https://play.google.com/store/apps/details?id=com.ubercab', 1, 0, 1, 1, 0),
('Namma Yatri', 'https://nammayatri.in/logo.png', 'nammayatri://', 'https://play.google.com/store/apps/details?id=in.yatri', 1, 1, 0, 0, 0),
('Rapido', 'https://logo.clearbit.com/rapido.bike', 'rapido://', 'https://play.google.com/store/apps/details?id=com.rapido', 1, 1, 0, 0, 0),
('Yulu', 'https://yulu.in/logo.png', 'yulu://', 'https://play.google.com/store/apps/details?id=com.yulu.bike', 1, 0, 0, 0, 1),
('Porter', 'https://logo.clearbit.com/porter.in', 'porter://', 'https://play.google.com/store/apps/details?id=in.porter.customer', 0, 0, 0, 1, 0);

-- Ride types table
CREATE TABLE ride_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  category ENUM('bike', 'auto', 'cab', 'parcel', 'rental') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ride_types (name, description, category) VALUES
('Bike', 'Two-wheeler ride', 'bike'),
('Auto', 'Three-wheeler ride', 'auto'),
('Mini Cab', 'Compact car', 'cab'),
('Sedan Cab', 'Sedan car', 'cab'),
('SUV Cab', 'SUV car', 'cab'),
('Parcel Small', 'Small package delivery', 'parcel'),
('Parcel Medium', 'Medium package delivery', 'parcel'),
('Parcel Large', 'Large package delivery', 'parcel'),
('Rental Bike', 'Hourly bike rental', 'rental'),
('Rental Car', 'Hourly car rental', 'rental');

-- Vehicle categories table (provider-specific rates)
CREATE TABLE vehicle_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT,
  ride_type_id INT,
  name VARCHAR(100) NOT NULL,
  base_fare DECIMAL(10,2) DEFAULT 0,
  per_km_rate DECIMAL(10,2) DEFAULT 0,
  per_min_rate DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (ride_type_id) REFERENCES ride_types(id),
  INDEX idx_provider_ride (provider_id, ride_type_id)
);

-- Sample rates (adjust as needed)
INSERT INTO vehicle_categories (provider_id, ride_type_id, name, base_fare, per_km_rate, per_min_rate) VALUES
(1, 1, 'Ola Bike', 15.00, 5.00, 1.00),  -- Ola Bike
(1, 2, 'Ola Auto', 25.00, 8.00, 1.50),
(1, 3, 'Ola Mini', 50.00, 12.00, 2.00),
(2, 1, 'Uber Bike', 18.00, 6.00, 1.20),
(2, 3, 'Uber Go', 45.00, 11.00, 1.80),
(3, 1, 'NY Bike', 12.00, 4.50, 0.90),
(4, 1, 'Rapido Bike', 14.00, 5.50, 1.10),
(5, 1, 'Yulu Bike', 10.00, 3.00, 0.00),  -- Per hour typically
(6, 6, 'Porter Small', 30.00, 10.00, 0.00);

-- Searches table
CREATE TABLE searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  drop_lat DECIMAL(10, 8),
  drop_lng DECIMAL(11, 8),
  ride_type_id INT,
  distance_km DECIMAL(10, 2),
  duration_min INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ride_type_id) REFERENCES ride_types(id),
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_ride_type (ride_type_id)
);

-- Fare results table
CREATE TABLE fare_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  search_id INT,
  provider_id INT,
  vehicle_category_id INT,
  estimated_fare DECIMAL(10,2),
  estimated_time_min INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (search_id) REFERENCES searches(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (vehicle_category_id) REFERENCES vehicle_categories(id),
  INDEX idx_search_provider (search_id, provider_id)
);

-- Example user for testing
INSERT INTO users (email, password, name) VALUES ('test@example.com', '$2a$10$ifIiOSUK4kJLAMlNKyVU.umVOLPHoLvBbM59FGvixcJZ4.QzIctFa', 'Test User');  -- Hash for 'password123'

-- Indexes for performance
CREATE INDEX idx_fare_search ON fare_results(search_id);
CREATE INDEX idx_search_coords ON searches(pickup_lat, pickup_lng, drop_lat, drop_lng);

