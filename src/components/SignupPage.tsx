import AuthLayout from "./AuthLayout";
import { Link } from "react-router-dom";

const SignupPage = () => {
  return (
    <AuthLayout title="Create your SpringLuck account">
      <form className="login-form">
        <div className="login-inputs">
          <div className="login-inputs-row">
            <input
              className="login-input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
            />
            <input
              className="login-input"
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Full name"
            />
          </div>
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
        <button className="login-form-btn" type="submit">
          Sign up
        </button>
        <div className="form-separator"></div>
        <Link className="signup-link" to="/login">
          Already have an account? Log in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
