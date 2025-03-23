"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signIn } from "next-auth/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Input } from "@heroui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);

  let userSession = null;
  console.log({ user });
  if (typeof window !== "undefined" && window.sessionStorage) {
    userSession = sessionStorage.getItem("user");
  }

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isMounted == true) {
      validateForm();
    } else {
      setIsMounted(true);
    }
  }, [email, password]);

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

  const handleSignIn = async (formData: FormData) => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log(res);
      sessionStorage.setItem("user", String(true));
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        const responseData = await response.json();
        router.push("/dashboard");
      } else {
        if (response.status == 400) {
          setErrors({
            email: "",
            password: "",
            form: "Both email and password must be entered.",
          });
        } else if (response.status == 401) {
          setErrors({
            email: "",
            password: "",
            form: "The given email or password is incorrect. Please try again.",
          });
        } else {
          setErrors({
            email: "",
            password: "",
            form: "The given email or password is incorrect. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[--sand] flex flex-col items-center justify-start px-4 py-12 text-[--text-color]">
      <img
      src="/images/slide1.png"
      alt="login banner"
      className="w-full max-w-sm rounded-xl shadow-lg mb-6 object-cover"
    />
      <div className="w-full max-w-md bg-[--off-white] rounded-2xl shadow-xl p-8">
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

        <form action={handleSignIn} className="space-y-6 font-normal">
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
          <button
            className="button w-full py-2 text-lg font-semibold"
            style={{
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            disabled={!isFormValid}
            type="submit"
          >
            Log In
          </button>

          {errors.form && (
            <p className="text-sm text-red-500 text-center mt-2">
              {errors.form}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
