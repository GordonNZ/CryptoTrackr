import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';

// interface for the data from the API
interface CoinData {
  market_cap_rank: number;
  symbol: string;
  image: string;
  name: string;
  current_price: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
}

const Home: React.FC = () => {
  const [data, setData] = useState<CoinData[]>([]);
  const [totalmarketcap, setTotalmarketcap] = useState<number>(0);
  const [tradingVol, setTradingVol] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('NZD');

  // options for the API
  const options = {
    method: 'GET',
    url: 'https://coingecko.p.rapidapi.com/coins/markets',
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: '100',
      page: '1',
      price_change_percentage: '1h,24h,7d',
      sparkline: 'true',
    },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
      'X-RapidAPI-Host': 'coingecko.p.rapidapi.com',
    },
  };

  const globalOptions = {
    method: 'GET',
    url: 'https://coingecko.p.rapidapi.com/global',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
      'X-RapidAPI-Host': 'coingecko.p.rapidapi.com',
    },
  };

  // fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request(options);
        // console.log(response.data);
        setData(response.data);
        const globalResponse = await axios.request(globalOptions);
        console.log(globalResponse.data.data);
        setTotalmarketcap(
          globalResponse.data.data.total_market_cap[
            currency.toLocaleLowerCase()
          ]
        );
        setTradingVol(
          globalResponse.data.data.total_volume[currency.toLocaleLowerCase()]
        );
        console.log(totalmarketcap + ' ' + currency);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currency]);

  return (
    <main>
      <div className='home'>
        <Navbar />
        <div className='cryptoMarketContainer'>
          <header>
            <div className='flex topHeader'>
              <h1 className='headerH1'>Cryptocurrency Prices by Market Cap</h1>
              <div className='flex currencySelect'>
                <p>Currency: </p>
                <select name='currency' className='currencyOptions'>
                  <option
                    value='NZD'
                    onClick={() => {
                      setCurrency('NZD');
                    }}
                  >
                    NZD
                  </option>
                  <option
                    value='USD'
                    onClick={() => {
                      setCurrency('USD');
                    }}
                  >
                    USD
                  </option>
                  <option
                    value='AUD'
                    onClick={() => {
                      setCurrency('AUD');
                    }}
                  >
                    AUD
                  </option>
                </select>
              </div>
            </div>
            <p>Stay up to date in the ever changing world of Cryptocurrency!</p>
            <div>
              <h4>Total Crypto Marketcap</h4>
              {totalmarketcap.toLocaleString('en-NZ')}
              <h4>24 hour Trading Volume</h4>
              {tradingVol.toLocaleString('en-NZ')}
            </div>
          </header>
          {data &&
            data?.map((coin, index) => (
              <div className='coins' key={index}>
                <p className='coinRank'>{coin.market_cap_rank}. </p>
                <p className='coinTicker'>{coin.symbol}</p>
                <img src={coin.image} alt={coin.name} className='coinImage' />
                <p className='coinName'>{coin.name}</p>
                <p className='coinPrice'>
                  ${coin.current_price.toLocaleString('en-NZ')}
                </p>
                <div className='flex priceChanges'>
                  {Number(
                    coin.price_change_percentage_1h_in_currency?.toFixed(1)
                  ) >= 0 ? (
                    <p
                      style={{ color: '#3cd656' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_1h_in_currency?.toFixed(1)}%
                    </p>
                  ) : (
                    <p
                      style={{ color: '#ff2b2b' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_1h_in_currency?.toFixed(1)}%
                    </p>
                  )}
                  {Number(
                    coin.price_change_percentage_24h_in_currency?.toFixed(1)
                  ) >= 0 ? (
                    <p
                      style={{ color: '#3cd656' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_24h_in_currency?.toFixed(1)}
                      %
                    </p>
                  ) : (
                    <p
                      style={{ color: '#ff2b2b' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_24h_in_currency?.toFixed(1)}
                      %
                    </p>
                  )}
                  {Number(
                    coin.price_change_percentage_7d_in_currency?.toFixed(1)
                  ) >= 0 ? (
                    <p
                      style={{ color: '#3cd656' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_7d_in_currency?.toFixed(1)}%
                    </p>
                  ) : (
                    <p
                      style={{ color: '#ff2b2b' }}
                      className='coinPercentageChange'
                    >
                      {coin.price_change_percentage_7d_in_currency?.toFixed(1)}%
                    </p>
                  )}
                </div>
                <p className='coinMarketcap'>
                  ${coin.market_cap.toLocaleString('en-NZ')}
                </p>
                <p className='coinVolume'>
                  ${coin.total_volume.toLocaleString('en-NZ')}
                </p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Home;