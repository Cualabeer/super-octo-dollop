const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all bookings
router.get('/bookings', async (req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(result.rows);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// Reset & seed DB
router.post('/reset-db', async (req,res)=>{
  try{
    await pool.query('DROP TABLE IF EXISTS bookings');
    await pool.query(`CREATE TABLE bookings(
      id SERIAL PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      reg TEXT,
      service TEXT,
      address TEXT,
      lat FLOAT,
      lng FLOAT,
      price FLOAT,
      created_at TIMESTAMP DEFAULT NOW()
    )`);
    // Seed dummy data
    await pool.query(`INSERT INTO bookings(name,phone,email,reg,service,address,lat,lng,price)
      VALUES('John Doe','07123456789','john@example.com','AB12CDE','Oil & Filter Service','Medway Towns',51.3863,0.5210,85)`);
    res.json({message:'Database reset & seeded successfully'});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// Settings endpoints (simplified)
router.get('/settings', async (req,res)=>{
  res.json([
    {key:'callout_fee', value:process.env.CALL_OUT_FEE},
    {key:'max_distance', value:process.env.MAX_DIRECT_DISTANCE},
    {key:'seo_title', value:'SOS Mechanics | Mobile Mechanic Medway'},
    {key:'seo_meta_description', value:'Trusted mobile mechanic covering Medway Towns.'},
    {key:'seo_keywords', value:'mobile mechanic, Medway, car repair'}
  ]);
});

router.post('/settings', async (req,res)=>{
  // For now, just echo back, can be extended to store in DB
  const {key,value}=req.body;
  res.json({key,value,message:'Setting saved'});
});

module.exports = router;