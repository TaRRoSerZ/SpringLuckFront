import "../styles/LoginPage.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <section className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-img-wrapper">
          <h2 className="login-title">Welcome back to SpringLuck</h2>
          <img
            className="login-illustration"
            src="/images/login-img.png"
            alt="Login Illustration"
          />
        </div>
        <div className="login-form-wrapper">
          <h3 className="login-form-title">Login</h3>
          <form className="login-form">
            <div className="login-inputs">
              <input
                className="input"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              <input
                className="input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>

            <button className="login-form-btn" type="submit">
              Submit
            </button>
            <div className="form-separator"></div>
            <Link className="signup-link" to="/signup">
              Don't have an account? Sign up
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
