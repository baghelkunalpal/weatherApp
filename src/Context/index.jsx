import React, { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Delhi');
    const [thisLocation, setLocation] = useState('');
    const apiKey = import.meta.env.VITE_API_KEY;
    const [loading, setLoading] = useState(false);
    const fetchWeather = async () => {
        setLoading(true);
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            const thisData = Object.values(response?.data?.locations)[0];
            setLocation(thisData.address);
            setValues(thisData.values);
            setWeather(thisData.values[0]);
            const apiKey = import.meta.env.VITE_API_KEY;
            console.log('API Key:', apiKey);
            console.log('Place:', place);
                    } catch (error) {
            console.error('Error fetching weather:', error);

            if (error.response) {
                console.error('API Error Response:', error.response.data);
               
            } else if (error.request) {
                console.error('No response received:', error.request);
              
            } else {
                console.error('Other error:', error.message);
                
            }

            alert('An error occurred while fetching weather data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place,
            loading,
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
