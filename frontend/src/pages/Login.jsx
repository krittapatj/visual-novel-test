import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // เก็บ JWT ที่ได้จาก Backend
      localStorage.setItem("token", data.token);

      // เก็บข้อมูล user ไว้ใช้แสดงผล
      localStorage.setItem("user", JSON.stringify(data.user));

      // Login สำเร็จ
      navigate("/welcome");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>เข้าสู่ระบบ</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p>
        ยังไม่มีบัญชี?{" "}
        <Link to="/register">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

export default Login;