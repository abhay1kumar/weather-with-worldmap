"use client"
import MapboxMap from '@/components/MapBox'
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query'


const Home = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
     <MapboxMap />
    </QueryClientProvider>
  
  )
}

export default Home