const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set on Render
  ssl: { rejectUnauthorized: false }
});

// Admin settings
app.get('/api/admin', async (req,res)=>{
  const result = await pool.query('SELECT * FROM admin_settings ORDER BY updated_at DESC LIMIT 1');
  res.json(result.rows[0] || {});
});

app.post('/api/admin', async (req,res)=>{
  const { seo_title, seo_description, seo_keywords, structured_data, service_lat, service_lng, service_radius } = req.body;
  const result = await pool.query(
    `INSERT INTO admin_settings (seo_title, seo_description, seo_keywords, structured_data, service_lat, service_lng, service_radius)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [seo_title, seo_description, seo_keywords, structured_data, service_lat, service_lng, service_radius]
  );
  res.json(result.rows[0]);
});

// Bookings
app.post('/api/bookings', async (req,res)=>{
  const { name, phone, car_model, reg_number, address, lat, lng, services, total, callout_fee } = req.body;
  const result = await pool.query(
    `INSERT INTO bookings 
     (name, phone, car_model, reg_number, address, lat, lng, services, total, callout_fee)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [name, phone, car_model, reg_number, address, lat, lng, services, total, callout_fee]
  );
  res.json(result.rows[0]);
});

app.get('/api/bookings', async (req,res)=>{
  const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));