

import { useQuery } from 'react-query';

const fetchWeatherData = async (lat:number, lon:number) => {
    let API_KEY= process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useWeatherQuery = (lat:number, lon:number) => {
  return useQuery(['weather', lat,lon], () => fetchWeatherData(lat,lon));
};
