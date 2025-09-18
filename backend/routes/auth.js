import express from "express";
const router = express.Router();

// Simple guest auth placeholder
router.get("/me", (req, res) => { 
  res.json({ role: "guest", name: "Guest" }); 
});

export default router;