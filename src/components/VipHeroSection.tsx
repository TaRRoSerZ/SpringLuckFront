import { Link } from "react-router-dom";
import "../styles/VipHeroSection.css";

export default function VipHeroSection() {
	return (
		<>
			<section className="vip-hero-section">
				<div className="titles">
					<h2 className="vip-h2">Become a VIP</h2>
					<p className="subtitle">
						Join our VIP club for exclusives bonuses and rewards.
					</p>
				</div>
				<Link className="vip-button" to="/vip">
					Join now
				</Link>
				<img
					className="img-vip-hero"
					src="/images/vip-img.png"
					alt="image-vip"
				/>
			</section>
		</>
	);
}
