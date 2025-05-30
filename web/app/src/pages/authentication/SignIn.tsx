import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signIn } from "../../services/authService.js"; // Adjust the path to your auth service file
import { useUser } from "../../context/UserContext.tsx";
import { TextInput } from "../../components/ui/TextInput.tsx";
import { CustomButton } from "../../components/ui/CustomButton.tsx";

import loginImage from "../../assets/images/login-image.jpg";
import logo from "../../assets/images/uplb-logo.png";
import { PageFooter } from "../../components/PageFooter.tsx";
import { deriveKey, encryptData } from "../../utils/encryption.js";
import { useAuth } from "../../context/AuthContext.tsx";

export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserName, userLogIn } = useUser();
  const navigate = useNavigate();
  const { manualLogin } = useAuth();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await manualLogin(email, password);
      navigate("/home");
      // const userCredential = await signIn(email, password);
      // if (userCredential) {
      //   console.log("User signed in!");

      //   setUserName(userCredential.user.displayName || userCredential.userDetails.name || "Anonymous");
      //   userLogIn(userCredential.user);

      //   navigate("/home");
      // } else {
      //   alert("User credential not found!");
      // }
    } catch (error) {
      alert("Error signing in: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col select-none">
      <div className="flex flex-row flex-grow items-center">
        <div className="w-3/4 flex flex-col space-y-4 items-center">
          <img src={logo} className="w-1/2" alt="UPLB Logo" />
          <h3 className="text-3xl font-bold pb-4">Sign In</h3>
          <form onSubmit={handleSignIn} className="space-y-4 flex flex-col">
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextInput>
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></TextInput>
            {/* show password checkbox */}
            <div className="flex items-center">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="showPassword"
                onChange={(e) => {
                  const passwordInput = document.querySelector<HTMLInputElement>("#password");
                  if (passwordInput) {
                    passwordInput.type = e.target.checked ? "text" : "password";
                  }
                }}
              />
              <label htmlFor="showPassword" className="ml-2 text-sm caret-transparent">
                Show Password
              </label>
            </div>
            <CustomButton type="submit" className="bg-up_green text-white  hover:bg-up_green-hover">
              Sign In
            </CustomButton>
          </form>

          <p>
            Don't have an account?{" "}
            <CustomButton
              className="text-up_green"
              onClick={() => navigate("/sign-up")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Sign Up
            </CustomButton>
          </p>
        </div>
        <div className="flex flex-grow">
          <img src={loginImage} className="opacity-85" alt="Sign In" />
        </div>
      </div>
      <PageFooter />
    </div>
  );
};
