import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { GenresProvider } from './context/genres.context.jsx';
import { SearchProvider } from './context/search.context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <GenresProvider>
          <App />
        </GenresProvider>
      </SearchProvider>
    </BrowserRouter>
  </StrictMode>,
)
