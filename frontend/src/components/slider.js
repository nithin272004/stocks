import React from 'react'

export default function slider(props) {
 
  const profit=props.totalValue-props.current;
  const profit1=profit?profit.toFixed(2) : "0.00";
  return (

    <div class="card text-center my-1 slider" id="slider">
  <div class="card-header " Style="color:rgb(211, 191, 13)">
    TOTAL PORTFOLIO STATS
  </div>
  <div Style="color: #D3D3D3" class="card-body  ">
  <h2 Style="color: #D3D3D3" >Total Portfolio Value: <h3>${props.totalValue ? props.totalValue.toFixed(2) : "0.00"}</h3></h2>
  <h3  Style="color: #D3D3D3" class="slider-h4">Total Investment:               <h4> ${props.current? props.current.toFixed(2) : "0.00"}</h4></h3>
  <h5 class="slider-h4" Style="color: #D4AF37">Total profit/loss:$ {profit?profit.toFixed(2) : "0.00"}</h5>
  <h5 class="slider-h4" Style="color: #D4AF37">Total profit/loss %: {(profit1/props.current)*100?((profit1/props.current)*100).toFixed(2) : "0.00"}%</h5>
    <p Style="color: #90EE90" class="card-text">Total stocks:   {props.nostocks}</p>
    <a href="#stocks" class="btn btn-primary">Buy a New Stock</a>
  </div>
  
</div>
  )
}