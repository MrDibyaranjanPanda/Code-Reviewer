import { useState } from "react";
import { loginUser } from "../services/api";

function Login({
  onHome,
  onSwitchToRegister,
  onLoginSuccess
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      onLoginSuccess();

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Login failed"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button
          className="back-home-button"
          onClick={onHome}
        >
          ← Back to Home
        </button>

        <h1>AI Code Review Assistant</h1>
        <p>Review your Python code with ease</p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={onSwitchToRegister}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;