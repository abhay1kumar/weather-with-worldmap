// src/components/Map.tsx

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useWeatherQuery } from '../../lib/weatherApi';
import Summary from './summary';
import Stats from './stats';
import Wind from './wind';
import Clouds from './clouds';

const iconOptions: mapboxgl.MarkerOptions = {
  color: '#E54E52',
};

const MAPBOX_ACCESS_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
interface Cordinates {
  lat: number,
  lon: number
}

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ initialOptions }) => {
  const mapNode = React.useRef(null);
  const [map, setMap] = React.useState<mapboxgl.Map | undefined>();
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [locationLat, setLocationLat] = useState<Cordinates>({ lat: 0, lon: 0 })


  const defaultLocation = {
    lng: 77.3910,
    lat: 28.5355,
  };
  const { data, isLoading, isError } = useWeatherQuery(locationLat.lat, locationLat.lon);

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAPBOX_ACCESS_KEY,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [defaultLocation.lng, defaultLocation.lat],
      zoom: 3,
      ...initialOptions,
    });
    setLocationLat({
      lat: defaultLocation.lat,
      lon: defaultLocation.lng,
    })
    setMap(mapboxMap);
    if (marker) {
      marker.remove();
    }

    const newMarker = new mapboxgl.Marker().setLngLat([defaultLocation.lng, defaultLocation.lat]).addTo(mapboxMap);
    setMarker(newMarker);


    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_ACCESS_KEY,
      mapboxgl: mapboxgl,
      marker: false, // Disable the default marker
    });

    mapboxMap.addControl(geocoder);

    geocoderRef.current = geocoder;

    return () => {
      mapboxMap.remove();
    };

  }, [initialOptions, defaultLocation.lng, defaultLocation.lat]);




  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const { lng, lat } = event.lngLat;
      console.log("event", event)
      setLocationLat({
        lat: lat,
        lon: lng,
      })
      if (marker) {
        marker.remove();
      }
      if (markerRef.current) {
        markerRef.current.remove();
      }
      const marker2 = new mapboxgl.Marker(iconOptions).setLngLat([lng, lat]).addTo(map);
      markerRef.current = marker2;
      marker2.getElement().addEventListener('click', () => {
        console.log('Marker clicked');
      });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  return <>
    <div ref={mapNode} style={{ width: "500", height: "500px" }} />
    {isLoading && <div>Loading...</div>}
    {isError && <div>Error fetching weather data</div>}

    {
      !isLoading && !isError && <>
        <div className="p-8 space-y-4 text-center">
          <div className="text-lg font-black">{data.main.temp}<sup>°C</sup></div>
          <Summary icon={data.weather[0].icon} title={data.name} description={data.weather[0].description} />
        </div>
        <div className="p-6 bg-gradient-to-t from-indigo-400 to blue-900">

          <Stats feelsLike={data.main.feels_like} min={data.main.temp_min} max={data.main.temp_max} />
          <Wind speed={data.wind.speed} deg={data.wind.deg} />
          <Clouds visibility={data.visibility} humidity={data.main.humidity} />

        </div>
      </>
    }
  </>;
}

export default MapboxMap;