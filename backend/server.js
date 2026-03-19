
require('dotenv').config()
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

const stocks = [
 {symbol:"RELIANCE.NS", sector:"Energy"},
 {symbol:"TCS.NS", sector:"IT"},
 {symbol:"INFY.NS", sector:"IT"},
 {symbol:"HDFCBANK.NS", sector:"Bank"},
 {symbol:"ICICIBANK.NS", sector:"Bank"},
 {symbol:"SBIN.NS", sector:"Bank"},
 {symbol:"ITC.NS", sector:"FMCG"},
 {symbol:"HINDUNILVR.NS", sector:"FMCG"},
 {symbol:"TATAMOTORS.NS", sector:"Auto"},
 {symbol:"MARUTI.NS", sector:"Auto"}
];

app.get("/stocks", async (req,res)=>{
 try{

   const data = await Promise.all(
     stocks.map(async s=>{
        const r = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${s.symbol}&token=${API_KEY}`
        );

        return {
 symbol:s.symbol.replace(".NS",""),
 sector:s.sector,
 price:r.data.c || 0,
 change:r.data.dp || 0
}
     })
   )

   res.json(data)

 }catch(e){
   res.status(500).json({error:e.toString()})
 }
})

app.listen(5001,()=>{
 console.log("Backend running on http://localhost:5001")
})
