import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [responseData, setResponseData] = useState([]);
  const [symbol, setSymbol] = useState([]);
  const [markPrice, setMarkPrice] = useState([]);

  // socket connection

  useEffect(() => {
    // connect established
    const ws = new WebSocket("wss://production-esocket.delta.exchange");
    // channel subscribed
    ws.onopen = (event) => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          payload: {
            channels: [
              {
                name: "ticker",
                symbols: [...symbol],
              },
            ],
          },
        })
      );
    };
    // Data received
    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      setMarkPrice((prev) => [...prev, json.open]);
    };
  }, [symbol]);

  // Produce API call

  async function getProduct() {
    const url = `https://api.delta.exchange/v2/products`;
    const response = await fetch(url);
    const data = await response.json();
    setResponseData(data.result.slice(0, 20));

    const markPrice = data.result.slice(0, 20).map((val) => {
      return val.underlying_asset.symbol + val.settling_asset.symbol;
    });

    setSymbol([...markPrice]);
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className='App'>
      <table>
        <tr>
          <th>Symbol</th>
          <th>Description</th>
          <th>Underlying Asset</th>
        </tr>
        {responseData.map((value, index) => {
          return (
            <tr key={index}>
              <td>{value.symbol}</td>
              <td>{value.description}</td>
              <td>{value.underlying_asset.symbol}</td>
            </tr>
          );
        })}
      </table>
      <div>
        <h4
          style={{
            marginTop: "3px",
            border: "2px solid rgb(205 200 200)",
            padding: "1.2rem 0rem 1.2rem 0rem",
            width: "150px",
          }}
        >
          Mark Price
        </h4>

        {markPrice?.filter(Boolean)?.map((value, index) => {
          return (
            <p
              key={index}
              style={{
                marginTop: "3px",
                border: "2px solid rgb(205 200 200)",
                padding: "1.2rem 0rem 1.2rem 0rem",
                width: "150px",
              }}
            >
              {value}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default App;
