require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const adminRoutes = require('./routes/admin');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/admin', adminRoutes);

// Simple health check
app.get('/admin/health', async (req,res)=>{
  try{
    const result = await pool.query("SELECT NOW()");
    res.json({status:"OK", db_time: result.rows[0].now});
  }catch(err){
    res.status(500).json({status:"FAIL", error:err.message});
  }
});

app.listen(process.env.PORT||3000,()=>console.log(`Backend running on port ${process.env.PORT}`));