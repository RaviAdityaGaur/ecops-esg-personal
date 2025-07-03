import React, { useEffect } from "react";
import { SSO_SITE } from "../../Screens/constants";
export default function LoginRedirect() {
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      window.location.href = "/";
    } else {
      window.location.href = SSO_SITE;
    }
  }, []);
  return <div>Login</div>;
}