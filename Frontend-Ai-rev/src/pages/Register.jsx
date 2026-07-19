import { useState } from "react";
import { registerUser } from "../services/api";

function Register({
  onHome,
  onSwitchToLogin
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      alert(response.data.message);

      onSwitchToLogin();

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Registration failed"
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
        <p>Create your account</p>

        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

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
            Register
          </button>

        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;