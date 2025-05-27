import {Routes, Route} from 'react-router-dom';
import Films from '../components/Films';
import TVShows from '../components/TV-Shows';
import SeachPage from '../components/SeachPage';
import Home from '../components/Home';
import Player from '../components/Player';


export const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/TV-Shows" element={<TVShows />} />
      <Route path="/films" element={<Films />} />
      <Route path='/search/:query' element={<SeachPage />} />
      <Route path='/player/:type/:playerId' element={<Player />} />
    </Routes>
  )
}
