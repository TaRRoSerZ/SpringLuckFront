import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back to SpringLuck">
      <form className="login-form">
        <div className="login-inputs">
          <input
            className="login-input"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
          <input
            className="login-input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <Link className="forgot-link" to="/forgot-password">
          Forgot Password? Reset here
        </Link>

        <button className="login-form-btn" type="submit">
          Submit
        </button>
        <div className="form-separator"></div>
        <Link className="signup-link" to="/signup">
          Don't have an account? Sign up
        </Link>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
