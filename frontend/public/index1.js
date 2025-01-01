const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stocks');
       // Fallback to empty array if stocks are undefined
      console.log(response.data.totalValue || 0);
      console.log(response.data);// Fallback to 0 if totalValue is undefined
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };
  fetchStocks();

  thin272004
  Fwp5GO0XiDtcszyw
  woWDqn53lhxACbm2