"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { Input } from "@heroui/input";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("personalAccount");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    zipCode: "",
    password: [""],
    confirmPassword: "",
    form: "",
  });

  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    let formData = {
      name,
      email,
      username,
      zipCode,
      password,
      confirmPassword,
      accountType,
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const res = await createUserWithEmailAndPassword(email, password);
        sessionStorage.setItem("user", String(true));
        const responseData = await response.json();
        router.push("/dashboard");
      } else {
        if (response.status === 400) {
          const responseData = await response.json();
          let errors = {
            name: "",
            email: "",
            username: "",
            zipCode: "",
            password: [""],
            confirmPassword: "",
            form: "",
          };
          responseData.errors.forEach((error: String) => {
            if (error.includes("email")) errors.email += error + " ";
            else if (error.includes("Username")) errors.username += error + " ";
            else if (error.includes("Zipcode")) errors.zipCode += error + " ";
            else if (error.includes("Password")) errors.password.push(String(error));
            else errors.form += error + " ";
          });
          setErrors(errors);
        } else {
          setErrors({
            name: "",
            email: "",
            username: "",
            zipCode: "",
            password: [""],
            confirmPassword: "",
            form: "Please make sure all the fields are filled out.",
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
        alt="register banner"
        className="w-full max-w-sm rounded-xl shadow-lg mb-6 object-cover"
      />

      <div className="w-full max-w-md bg-[--off-white] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-display font-bold text-center mb-2">
          Create Account
        </h1>
        <h2 className="text-sm font-display text-center mb-6">
          Already registered?{" "}
          <Link
            href="/log-in"
            className="font-semibold text-[--cocoa-brown] hover:underline"
          >
            Log in
          </Link>
        </h2>

        <form onSubmit={handleSignUp} className="space-y-6 font-normal">
          <Input
            label="Name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <Input
            label="Username"
            placeholder="username123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}

          <Input
            label="Zip Code"
            placeholder="90210"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}

          <div className="flex flex-col gap-y-2">
            <label className="font-medium">Account Type</label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="businessAccount"
                  name="accountType"
                  onChange={(e) => setAccountType(e.target.value)}
                />
                Business
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="personalAccount"
                  name="accountType"
                  defaultChecked
                  onChange={(e) => setAccountType(e.target.value)}
                />
                Personal
              </label>
            </div>
          </div>

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.password.length > 1 && (
            <p className="text-sm text-red-500">{errors.password.join(" ")}</p>
          )}

          <Input
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            labelPlacement="outside"
            className="w-full"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="button w-full py-2 text-lg font-semibold">
            Sign Up
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
