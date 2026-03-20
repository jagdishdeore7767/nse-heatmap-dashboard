
import React,{useEffect,useState} from "react";
import "./style.css";

function App(){

const [stocks,setStocks]=useState([])

useEffect(()=>{
 load()
 const t=setInterval(load,5000)
 return ()=>clearInterval(t)
},[])

const load = async () => {
 try{
   const r = await fetch("https://nse-heatmap-dashboard.onrender.com/stocks")
   const d = await r.json()

   if(Array.isArray(d)){
     setStocks(d)
   }else{
     console.log("API error:", d)
     setStocks([])
   }

 }catch(e){
   console.log("Fetch error", e)
   setStocks([])
 }
}

const gainers=[...stocks].sort((a,b)=>b.change-a.change).slice(0,5)
const losers=[...stocks].sort((a,b)=>a.change-b.change).slice(0,5)

const sectors={}
stocks.forEach(s=>{
 if(!sectors[s.sector]) sectors[s.sector]=[]
 sectors[s.sector].push(s.change)
})

const sectorPerf=Object.keys(sectors).map(sec=>{
 const avg=sectors[sec].reduce((a,b)=>a+b,0)/sectors[sec].length
 return {sector:sec,value:avg.toFixed(2)}
})

return(

<div className="container">

<h1>NSE Heatmap Dashboard</h1>

<h2>Sector Performance</h2>
<div className="sector">
{sectorPerf.map(s=>(
<div key={s.sector} className={s.value>0?"green":"red"}>
{s.sector}<br/>
{s.value}%
</div>
))}
</div>

<h2>Heatmap</h2>
<div className="heatmap">
{stocks.map(s=>(
<div key={s.symbol} className={s.change>0?"green":"red"}>
{s.symbol}<br/>
{s.change}%
</div>
))}
</div>

<div className="lists">

<div>
<h3>Top Gainers</h3>
{gainers.map(s=>(<div key={s.symbol}>{s.symbol} {s.change}%</div>))}
</div>

<div>
<h3>Top Losers</h3>
{losers.map(s=>(<div key={s.symbol}>{s.symbol} {s.change}%</div>))}
</div>

</div>

</div>

)
}

export default App
