import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameContainer from "./components/GameContainer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import GameSection from "./components/GameSection";
import VipHeroSection from "./components/VipHeroSection";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";

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
              <Footer />
            </>
          }
        />
        <Route path="/game/:id" element={<GameContainer />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
