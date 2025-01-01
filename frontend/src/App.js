import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";
import Slider from "./components/slider.js"
import Navbar from "./components/Navbar.js"
import Contact from "./components/Contact.js"
import Footer from "./components/footer.js"

function App() {
  const [stocks, setStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalCurrValue, setTotalCurrValue] = useState(0);


  const [form, setForm] = useState({ name: '', ticker: '', buyPrice: '' });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stocks');
      console.log(response.data); // Log the entire response to inspect it
      setStocks(response.data.stocks || []);
      setTotalValue(response.data.totalValue || 0);
      setTotalCurrValue(response.data.totalCurrValue || 0);

    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };
  

  const addStock = async () => {
    try {
      await axios.post('http://localhost:5000/api/stocks', form);
      fetchStocks();  // Ensure the latest stock data is fetched after adding a new stock
      setForm({ name: '', ticker: '', buyPrice: '' });
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };
  

  const deleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${id}`);
      fetchStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  return (
    <>
    <Navbar />
    <Slider totalValue={totalValue} current={totalCurrValue} nostocks={stocks.length} lastpurchased={"29.11.24"}  />
    
  
    <div className="App apps" id="stocks">
      <h1 Style="color: #ADD8E6">Portfolio Tracker</h1>
      <div class="slider-tit">
      <h2 >Total Portfolio Value:      <h3>${totalValue ? totalValue.toFixed(2) : "0.00"}</h3></h2>
      <h2>Total Investment Value:    <h4>    ${totalCurrValue ? totalCurrValue.toFixed(2) : "0.00"}</h4></h2>

      </div>
      <div>
        <h3 Style="color: #90EE90">Add Stock</h3>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ticker"
          value={form.ticker}
          onChange={(e) => setForm({ ...form, ticker: e.target.value })}
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
        />
       
        <button class="btn btn-success my-2" onClick={addStock}>Add Stock</button>
      </div>
      <table class="tb">
        <thead class="tr">
          <tr >
            <th>Name</th>
            <th>Ticker</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>High Price   <span class="badge text-bg-info">today's</span></th>
            <th>Low Price     <span class="badge text-bg-info">today's</span></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id}>
              <td>{stock.name}</td>
              <td>{stock.ticker}</td>
              <td>${(stock.buyPrice || 0).toFixed(2)}</td> {/* Fallback to 0 */}
              <td>${(stock.currentPrice || 0).toFixed(2)}</td> {/* Fallback to 0 */}
              <td>${(stock.highPrice || 0).toFixed(2)}</td> {/* Fallback to 0 */}
              <td>${(stock.lowPrice || 0).toFixed(2)}</td> {/* Fallback to 0 */}
              <td>
                <button class="btn btn-danger " onClick={() => deleteStock(stock._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Contact />
    <Footer />
    </>
  );
}

export default App;
