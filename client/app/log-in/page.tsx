"use client";

import Link from "next/link";
import { Input } from "@heroui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "@heroui/react";

export default function Login() {
  // Email and Password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Firebase sign In function
  const [signInWithEmailAndPassword, firebaseUser, firebaseLoading, firebaseError] = useSignInWithEmailAndPassword(auth);
  // Error Validation
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Router for redirecting the user.
  const router = useRouter();

  // Only validate if the user has started typing.
  useEffect(() => {
    if (isMounted) {
      validateForm();
    } else {
      setIsMounted(true);
    }
  }, [email, password]);

  // Display sign in errors.
  useEffect(() => {
    if (firebaseError) {
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
          setErrors({
            email: "",
            password: "",
            form: "Email and password do not match. Please try again.",
          });
          break;
        case 'auth/invalid-email':
          setErrors({
            email: "Invalid email address.",
            password: "",
            form: "",
          });
          break;
        default:
          setErrors({
            email: "",
            password: "",
            form: "Failed to sign in. Please try again.",
          });
      }
    }
  }, [firebaseError])

  // Function to reroute to dashboard if user is logged in.
  useEffect(() => {
    if (firebaseUser != undefined) {
      if (firebaseUser.user.emailVerified) {
        router.push("/dashboard");
      } else {
        signOut(auth);
        setErrors({
          email: "",
          password: "",
          form: "Please follow the link in your verification email before logging in!",
        });   
      }
    }
  }, [firebaseUser]);

  // Function to validate form and show errors for empty fields.
  const validateForm = () => {
    let errors = {
      email: "",
      password: "",
      form: "",
    };
    if (!email) {
      errors.email = "Email is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    setErrors(errors);
    setIsFormValid(!errors.email && !errors.password);
  };

  // Function to sign the user in with Firebase.
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Errors handled in useEffect for firebaseError.
    signInWithEmailAndPassword(email, password)

    // Pushing to dashboard handled in useEffect for firebaseUser.
  };

  // Return html
  return (
    <main className="min-h-screen bg-[--sand] flex flex-col items-center justify-start px-4 py-12 text-[--text-color]">
      <img
        src="/images/slide1.png"
        alt="login banner"
        className="w-full max-w-xl rounded-xl shadow-lg mb-6 object-cover"
      />
      <div className="w-full max-w-4xl bg-[--off-white] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-display font-bold text-center mb-2">
          Log In
        </h1>
        <h2 className="text-sm font-display text-center mb-6">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[--cocoa-brown] hover:underline"
          >
            Register
          </Link>
        </h2>

        <form onSubmit={handleSignIn} className="space-y-6 font-normal">
          {/* email input */}
          <div className="flex flex-col gap-1">
            <Input
              id="email"
              name="email"
              type="text"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              labelPlacement="outside"
              className="w-full rounded-md bg-[--input-bg] border border-[--input-border] focus-within:ring-2 ring-[--cocoa-brown] transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500 text-right">{errors.email}</p>
            )}
          </div>

          {/* password input */}
          <div className="flex flex-col gap-1">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelPlacement="outside"
              className="w-full rounded-md bg-[--input-bg] border border-[--input-border] focus-within:ring-2 ring-[--moss-green] transition"
            />
            {errors.password && (
              <p className="text-sm text-red-500 text-right">
                {errors.password}
              </p>
            )}
          </div>

          {/* login button */}
          <Button
            className="w-full py-2 text-lg bg-[--bark] text-white"
            style={{
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            disabled={!isFormValid}
            type="submit"
          >
            Log In
          </Button>

          <p className="text-sm text-red-500 text-center mt-2">
            {errors.form}
          </p>
        </form>
      </div>
    </main>
  );
}
