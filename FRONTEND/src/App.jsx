import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './Home/HomePageDark';
import HomePageLight from './Home/HomePageLight';
import AboutPageDark from './Home/AboutPageDark';
import AboutPage from './Home/AboutPageLight';
import FeaturePageLight from './Home/FeaturePageLight';
import FeaturePageDark from './Home/FeaturePageDark';
import GlobalStyles from './GlobalStyles';

function App() {
  const [isLight, setIsLight] = useState(false);

  return (
    <Router>
      <GlobalStyles />
      <Routes>

        {/* HOME */}
        <Route path="/" element={
          isLight
            ? <HomePageLight key="light" toggleTheme={() => setIsLight(false)} />
            : <HomePage key="dark" toggleTheme={() => setIsLight(true)} />
        } />

        {/* ABOUT */}
        <Route path="/about" element={
          isLight
            ? <AboutPage key="light" toggleTheme={() => setIsLight(false)} />
            : <AboutPageDark key="dark" toggleTheme={() => setIsLight(true)} />
        } />

        {/* FEATURES */}
        <Route path="/features" element={
          isLight
            ? <FeaturePageLight key="light" toggleTheme={() => setIsLight(false)} />
            : <FeaturePageDark key="dark" toggleTheme={() => setIsLight(true)} />
        } />

      </Routes>
    </Router>
  );
}

export default App;