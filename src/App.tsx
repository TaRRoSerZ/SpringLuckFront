import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import GameContainer from "./components/GameContainer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import GameSection from "./components/GameSection";
import VipHeroSection from "./components/VipHeroSection";
import Footer from "./components/Footer";
import DepositPage from "./components/DepositPage";
import Dashboard from "./components/Dashboard";
import { initKeycloak, getToken } from "./keycloak/keycloak";
import { syncUser } from "./services/authService_new";

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (isInitializing.current) {
      return;
    }

    isInitializing.current = true;

    initKeycloak(
      async () => {
        console.log("Keycloak initialized - user authenticated");

        const token = getToken();
        if (token) {
          const syncSuccess = await syncUser();
          if (syncSuccess) {
            console.log("User synchronized with backend");
          } else {
            console.warn("⚠️ User sync failed, but proceeding anyway");
          }
        }

        setKeycloakInitialized(true);
      },
      () => {
        console.log("Keycloak initialized - user not authenticated");
        setKeycloakInitialized(true);
      }
    );
  }, []);

  if (!keycloakInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--text-color)",
        }}>
        <div className="loader"></div>
      </div>
    );
  }

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
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
