import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, CheckCircle2, Lock } from "lucide-react";
import { useAuthContext } from "../Context/AuthContext";
import logo from "../assets/logo_Indowud.png";

/** Landing page for the emailed reset link: /reset-password?token=… */
const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { handleResetPassword, loading } = useAuthContext();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords don't match");
    try {
      await handleResetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired.");
    }
  };

  const inputClass =
    "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169698] focus:border-transparent transition disabled:bg-gray-100";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[#E6F8F6]">
      <header className="bg-gradient-to-r from-[#169698] to-[#128083] shadow-md">
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <img src={logo} alt="Logo" className="w-10 h-10" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md space-y-5"
        >
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#169698] to-[#128083] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              {done ? <CheckCircle2 className="w-8 h-8 text-white" /> : <KeyRound className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-3xl font-bold text-[#169698]">Set a new password</h2>
          </div>

          {!token ? (
            <p className="text-red-600 text-sm text-center">
              This link is missing its reset token. Request a new one from the{" "}
              <Link to="/login" className="underline">login page</Link>.
            </p>
          ) : done ? (
            <p className="text-green-700 text-sm text-center">Password updated. Taking you to the login page…</p>
          ) : (
            <>
              {["New password", "Confirm password"].map((label, i) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={i === 0 ? password : confirm}
                      onChange={(e) => (i === 0 ? setPassword : setConfirm)(e.target.value)}
                      required
                      minLength={8}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#169698] to-[#128083] text-white py-3 rounded-lg font-semibold disabled:opacity-60"
              >
                {loading ? "Saving…" : "Update password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
