import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Home';

function App() {
  return (
    <>
      <Header />
      <body>
        <main>
          <Home />
        </main>
      </body>
      <Footer />
    </>
  )
}

export default App
