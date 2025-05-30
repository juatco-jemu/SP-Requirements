import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createOfflineAccount } from "../../services/authService.js"; // Import your offline service for saving credentials
import { useUser } from "../../context/UserContext.tsx";
import { PageFooter } from "../../components/PageFooter.tsx";

import loginImage from "../../assets/images/login-image.jpg";
import logo from "../../assets/images/uplb-logo.png";
import { TextInput } from "../../components/ui/TextInput.tsx";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { signUp } from "../../services/authService.js";
import { toast } from "react-toastify";

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const navigate = useNavigate();
  const { getUserDetails } = useUser();

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const userDetails = { name: name, designation: designation };
      await signUp(email, password, userDetails);
      toast.success("Account created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      getUserDetails();
      navigate("/home");
    } catch (error) {
      alert("Error signing up: " + (error as any).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col select-none">
      <div className="flex flex-row flex-grow items-center">
        <div className="flex flex-grow">
          <img src={loginImage} className="opacity-85" alt="Sign In" />
        </div>
        <div className="w-3/4 flex flex-col space-y-4 items-center">
          <img src={logo} className="w-1/2" alt="UPLB Logo" />
          <h3 className="text-3xl font-bold pb-4">Sign Up</h3>
          <form onSubmit={handleSignUp} className="space-y-4 flex flex-col">
            <TextInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextInput
              type="text"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <TextInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
              Sign Up
            </CustomButton>
          </form>
          <p>
            Already have an account?{" "}
            <CustomButton
              className="text-up_green"
              onClick={() => navigate("/sign-in")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Sign In
            </CustomButton>
          </p>
        </div>
      </div>
      <PageFooter />
    </div>
  );
};
