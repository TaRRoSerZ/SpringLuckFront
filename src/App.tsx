import "./App.css";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
							<VipHeroSection />
						</>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
