import React, { Suspense, lazy } from 'react';
import {Routes, Route} from 'react-router-dom';

const Home = lazy(() => import('../components/Home'));
const TVShows = lazy(() => import('../components/TV-Shows'));
const Films = lazy(() => import('../components/Films'));
const SeachPage = lazy(() => import('../components/SeachPage'));
const Player = lazy(() => import('../components/Player'));
const Favorites = lazy(() => import('../components/Favorites'));
const LoadingSpinner = () => <div>Loading...</div>;


export const Allroutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/TV-Shows" element={<TVShows />} />
      <Route path="/films" element={<Films />} />
      <Route path='/search/:query' element={<SeachPage />} />
      <Route path="/player/:type?/:playerId" element={<Player />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
    </Suspense>
  )
}
