import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: 24, maxWidth: 480 }}>
      <h1>Welcome</h1>
      <p>Please sign in to continue.</p>
      <button onClick={loginWithGoogle}>Continue with Google</button>
    </div>
  );
}