import Navbar from "./Navbar";
import Beams from "./reactbits/Beams";
import "../styles/LoginPage.css";
import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <section className="login-page">
      <Navbar />
      <div className="beams-wrapper">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#a7ee43"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={25}
        />
      </div>
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-form-title">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
