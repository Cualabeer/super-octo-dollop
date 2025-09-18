import pool from "./db.js";

export async function seedDatabase() {
  await pool.query("DROP TABLE IF EXISTS bookings;");
  await pool.query("DROP TABLE IF EXISTS services;");
  await pool.query("DROP TABLE IF EXISTS settings;");

  await pool.query(`
    CREATE TABLE services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      is_repair BOOLEAN DEFAULT FALSE
    );
  `);

  await pool.query(`
    CREATE TABLE bookings (
      id SERIAL PRIMARY KEY,
      name TEXT,
      reg TEXT,
      service TEXT,
      address TEXT,
      lat FLOAT,
      lng FLOAT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE settings (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO services (name, description, price, is_repair) VALUES
    ('Oil & Filter Service', 'Full oil & filter change', 85, false),
    ('Brake Pads Replacement', 'Replace front/rear brake pads', 120, false),
    ('Battery Replacement', 'High-capacity car battery', 150, false),
    ('A/C Re-Gas', 'Air conditioning re-gas', 75, false),
    ('Starter Motor Replacement', 'Replace faulty starter motor', 140, true),
    ('Clutch Replacement', 'Complete clutch replacement', 320, true),
    ('Engine Diagnostics', 'Full engine fault check', 65, false)
  `);

  await pool.query(`
    INSERT INTO settings (key, value) VALUES
    ('callout_fee', '45'),
    ('max_direct_booking_miles', '15'),
    ('seo_title', 'SOS Mechanics | Mobile Mechanic in Medway Towns'),
    ('seo_meta_description', 'Trusted mobile mechanic covering Medway Towns. Emergency callouts from £45.'),
    ('seo_keywords', 'Medway, Chatham, Rochester, Gillingham, Strood, mobile mechanic, car repair')
  `);

  await pool.query(`
    INSERT INTO bookings (name, reg, service, address, lat, lng) VALUES
    ('John Smith', 'AB12CDE', 'Oil & Filter Service', 'Chatham, Medway', 51.3863, 0.5210),
    ('Sarah Lee', 'XY34ZRT', 'Battery Replacement', 'Gillingham, Medway', 51.3842, 0.5506)
  `);
}