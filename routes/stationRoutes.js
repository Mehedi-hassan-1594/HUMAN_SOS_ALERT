const express = require("express");
const db = require("../config/db");
const router = express.Router();

// GET all stations
router.get("/",(req,res)=>{
  db.query("SELECT id,name,address FROM police_stations",(err,results)=>{
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST add station
router.post("/",(req,res)=>{
  const {name,address}=req.body;
  db.query("INSERT INTO police_stations(name,address) VALUES(?,?)",[name,address],(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"✅ Station added", id: result.insertId});
  });
});

// PUT update station
router.put("/:id",(req,res)=>{
  const {name,address}=req.body;
  db.query("UPDATE police_stations SET name=?, address=? WHERE id=?",[name,address,req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"✅ Station updated"});
  });
});

// DELETE station
router.delete("/:id",(req,res)=>{
  db.query("DELETE FROM police_stations WHERE id=?",[req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"✅ Station deleted"});
  });
});

module.exports = router;
