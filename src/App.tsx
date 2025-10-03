import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameContainer from "./components/GameContainer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import GameSection from "./components/GameSection";
import VipHeroSection from "./components/VipHeroSection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeroSection />
              <GameSection />
              <VipHeroSection />
            </>
          }
        />
        <Route path="/game/:id" element={<GameContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
