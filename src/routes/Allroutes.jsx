import {Routes, Route} from 'react-router-dom';
import Films from '../components/Films';
import TVShows from '../components/TV-Shows';


export const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/TV-Shows" element={<TVShows />} />
      <Route path="/films" element={<Films />} />
    </Routes>
  )
}
