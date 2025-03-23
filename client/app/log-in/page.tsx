"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Input } from "@heroui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);
  const [errors, setErrors] = useState({ email: "", password: "", form: "" });
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMounted) validateForm();
    else setIsMounted(true);
  }, [email, password]);

  const validateForm = () => {
    setErrors({
      email: email ? "" : "Email is required.",
      password: password ? "" : "Password is required.",
      form: "",
    });
  };

  const handleSignIn = async (formData: FormData) => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem("user", String(true));
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const msg =
          response.status === 400
            ? "Email and password required."
            : response.status === 401
            ? "Incorrect credentials."
            : "Unexpected error occurred.";
        setErrors({ email: "", password: "", form: msg });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="min-h-screen overflow-auto bg-[--sand] px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg bg-[--off-white] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top image section */}
        <div className="w-full bg-[--sage-green] p-6 flex flex-col items-center text-[--soil-brown]">
          <img
            src="images/slide1.png" // Replace this path with your actual image
            alt="Cover"
            className="rounded-xl shadow w-full max-w-sm object-cover"
          />
        </div>

        {/* Login form section */}
        <div className="w-full p-8 text-[--text-color]">
          <h2 className="text-3xl font-display font-bold mb-2">Log in</h2>
          <p className="text-sm mb-6">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[--cocoa-brown] hover:underline"
            >
              Register
            </Link>
          </p>

          <form action={handleSignIn} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              labelPlacement="outside"
              className="w-full rounded-md bg-[--input-bg] border border-[--input-border] focus-within:ring-2 ring-[--cocoa-brown] transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelPlacement="outside"
              className="w-full rounded-md bg-[--input-bg] border border-[--input-border] focus-within:ring-2 ring-[--moss-green] transition"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            <button
              type="submit"
              className="button w-full py-2 text-lg font-semibold"
            >
              Log In
            </button>

            {errors.form && (
              <p className="text-sm text-red-500 text-center">{errors.form}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
