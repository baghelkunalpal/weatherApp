import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import search from './assets/icons/search.svg';
import { useStateContext } from './Context';
import { BackgroundLayout, WeatherCard, MiniCard } from './Components';

function App() {
  const [input, setInput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const { weather, thisLocation, values, place, setPlace } = useStateContext();
  const [filteredHistory, setFilteredHistory] = useState([]);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setFilteredHistory([]);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchContainerRef]);

  const submitCity = () => {
    if (input.trim() !== '') {
      setPlace(input);
      setInput('');

      const updatedHistory = [input, ...searchHistory.slice(0, 4)];
      setSearchHistory(updatedHistory);

      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue);

    if (e.key === 'Enter') {
      e.preventDefault(); 
      submitCity();
    } else {
      const filtered = searchHistory.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  };

  const handleSearchHistoryClick = (historyItem) => {
    setPlace(historyItem);
    setInput(historyItem);
    setFilteredHistory([]);
  };

  return (
    <div className='w-full h-screen text-white px-8 z-10'>
      <nav className='w-full p-3 flex justify-between flex-wrap items-center relative '>
        <h1 className='font-bold tracking-wide text-3xl text-black'>Weather App</h1>
        <div className='relative z-10' ref={searchContainerRef}>
          <div className='bg-white overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
            <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem] z-10' />
            <input
              type="text"
              placeholder='Search for any city..'
              className='focus:outline-none ring-2 rounded-lg p-1 w-full text-[#341212] text-lg '
              value={input}
              onChange={handleInputChange}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitCity();
                }
              }}
            />
          </div>
          {filteredHistory.length > 0 && (
            <div className='absolute top-full  p-6 bg-gray-100 w-[260px] rounded-b-md  mr-1right-0 text-gray-500'>
              <strong>Search History:</strong>
              <ul>
                {filteredHistory.map((item, index) => (
                  <li key={index} onClick={() => handleSearchHistoryClick(item)} className='cursor-pointer hover:underline'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
      <BackgroundLayout></BackgroundLayout>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
        />

        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {values?.slice(1, 7).map(curr => (
            <MiniCard
              key={curr.datetime}
              time={curr.datetime}
              temp={curr.temp}
              iconString={curr.conditions}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
