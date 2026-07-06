import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, reloadUser, loading } = useAuth();
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleSignIn = () => {
    setError("");
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
    const popup = window.open(
      `${backendUrl}/api/users/google`,
      "VastraAura Google Sign In",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups for this site.");
      return;
    }

    const messageListener = async (event) => {
      // Validate origin
      if (event.origin !== backendUrl) return;

      if (event.data?.type === "vastraaura:auth") {
        const { success, token, nextPath, message } = event.data.payload || {};
        if (success) {
          if (token) {
            localStorage.setItem("alaira_token", token);
          }
          await reloadUser();
          toast.success("Signed in with Google successfully!");
          
          const from = location.state?.from || nextPath || "/";
          navigate(from, { replace: true });
        } else {
          setError(message || "Google sign-in failed. Please try again.");
          toast.error("Sign-in failed.");
        }
        window.removeEventListener("message", messageListener);
      }
    };

    window.addEventListener("message", messageListener);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 pastel-mesh flex items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-md glass-card rounded-[32px] p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F7C7DC] rounded-full filter blur-3xl opacity-40 -mr-6 -mt-6"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#EAF5FF] rounded-full filter blur-3xl opacity-40 -ml-6 -mb-6"></div>

        <div className="text-center relative z-10">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-[#FFF4F7] text-[#E5497C] items-center justify-center mb-4">
            <Sparkles size={22} />
          </span>
          <h1 className="font-display font-semibold text-[#1C1924] text-2xl md:text-3xl tracking-tight">
            Sign In to Alaira House
          </h1>
          <p className="mt-2 text-[14.5px] text-[#4A4652] leading-relaxed">
            Connect using your Google account to manage your orders, wishlist, and send luxury gifts.
          </p>
        </div>

        {error && (
          <div className="mt-6 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">
            {error}
          </div>
        )}

        <div className="mt-8 relative z-10">
          <button
            data-testid="google-signin-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#1C1924] text-white hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 text-[14.5px] font-semibold cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center text-[12px] text-[#8b8790] relative z-10 leading-relaxed">
          By signing in, you agree to our Terms of Service <br /> and Privacy Policy.
        </div>
      </div>
    </main>
  );
}
