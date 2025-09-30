import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <>
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </>
  )
}

export default App
