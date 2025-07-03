import React, { useEffect } from "react";
function AuthRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("auth");
    if (token) {
      localStorage.setItem("auth", token);
    }
    window.location.href = "/";
  }, []);
  return <div>Redirecting...</div>;
}
export default AuthRedirect;