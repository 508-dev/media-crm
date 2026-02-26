import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, displayName || undefined);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: 10,
              marginBottom: 15,
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 5 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 5 }}
          >
            Password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label
            htmlFor="displayName"
            style={{ display: "block", marginBottom: 5 }}
          >
            Display Name (optional)
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px 20px",
            fontSize: 16,
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
