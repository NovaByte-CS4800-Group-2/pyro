  "use client";

import Link from "next/link";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import { useCreateUserWithEmailAndPassword, useSendEmailVerification, useUpdateProfile } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Register() {
  // Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("personalAccount");
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Create Account function
  const [createUserWithEmailAndPassword, firebaseCredential, firebaseLoading, firebaseError] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile] = useUpdateProfile(auth);
  const [sendSignInLinkToEmail, verificationSending, verificationError] = useSendEmailVerification(auth);

  // Error Validation State
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  useEffect(() => {
    if (name && email && username && zipCode && password && confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, email, username, zipCode, password, confirmPassword]);  

  // Router to redirect the user.
  const router = useRouter();

  // Display firebase registration errors.
  useEffect(() => {
    if (firebaseError) {
      switch(firebaseError.code) {
        case "auth/email-already-in-use":
          setErrors({
            name: "",
            email: "This email is already registered to an account. Please use a different one.",
            username: "",
            zipCode: "",
            password: "",
            confirmPassword: "",
            form: "",
          });
          break;
        case "auth/password-does-not-meet-requirements":
          setErrors({
            name: "",
            email: "",
            username: "",
            zipCode: "",
            password: "Your password must be at least 8 characters long and contain an uppercase letter, a symbol, and a number.",
            confirmPassword: "",
            form: "",
          });
          break; 
        default:
          setErrors({
            name: "",
            email: "",
            username: "",
            zipCode: "",
            password: "",
            confirmPassword: "",
            form: firebaseError.code,
          });
      }
    }
  }, [firebaseError]);

  // Sign Up function
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
  
    let formData = {
      user_id: "",
      name,
      username,
      zipCode,
      password,
      confirmPassword,
      accountType,
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential && userCredential.user) {
        await updateProfile({ displayName: username });
  
        formData.user_id = userCredential.user.uid;
        console.log(formData);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
    
        if (!response.ok) {
          await userCredential.user.delete();
          const responseData = await response.json();
    
          const newErrors = {
            name: "",
            email: "",
            username: "",
            zipCode: "",
            password: "",
            confirmPassword: "",
            form: "",
          };
    
          responseData.errors.forEach((err: string) => {
            if (err.toLowerCase().includes("email")) newErrors.email += err + " ";
            else if (err.toLowerCase().includes("username")) newErrors.username += err + " ";
            else if (err.toLowerCase().includes("zipcode")) newErrors.zipCode += err + " ";
            else if (err.toLowerCase().includes("password")) newErrors.password += err + " ";
            else newErrors.form += err + " ";
          });
    
          setErrors(newErrors);
          return;
        } else {
          if (await sendSignInLinkToEmail()) {
              // The link was successfully sent. Redirect to verification page.
              await signOut(auth);
              router.push("/register/verification");
          } else if (verificationError)  {
            setErrors({
              name: "",
              email: "",
              username: "",
              zipCode: "",
              password: "",
              confirmPassword: "",
              form: "Error sending verification email, please try again.",
            })
          }    
        }
    
      } 
    } 
    catch (err) {
      console.error("Sign-up error:", err);
      setErrors({
        name: "",
        email: "",
        username: "",
        zipCode: "",
        password: "",
        confirmPassword: "",
        form: "An unexpected error occurred. Please try again.",
      });
    }
  };
  

  // Return html
  return (
    <main className="min-h-screen bg-[--greige-mist] flex flex-col items-center justify-start px-4 py-12 text-[--text-color]">
      <img
        src="/images/slide1.png"
        alt="register banner"
        className="w-full max-w-xl rounded-xl shadow-lg mb-6 object-cover"
      />

      <div className="w-full max-w-4xl bg-[--porcelain] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-display font-bold text-center mb-2">
          Create Account
        </h1>
        <h2 className="text-sm font-display text-center mb-6">
          Already registered?{" "}
          <Link
            href="/log-in"
            className="font-semibold text-[--bark] hover:underline"
          >
            Log in
          </Link>
        </h2>

        <form onSubmit={handleSignUp} className="space-y-6 font-normal">
          <Input
            required
            label="Name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.name && <p className="text-sm text-[--deep-terracotta]">{errors.name}</p>}

          <Input
            required
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.email && <p className="text-sm text-[--deep-terracotta]">{errors.email}</p>}

          <Input
            required
            label="Username"
            placeholder="username123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.username && <p className="text-sm text-[--deep-terracotta]">{errors.username}</p>}

          <Input
            required
            label="Zip Code"
            placeholder="90210"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.zipCode && <p className="text-sm text-[--deep-terracotta]">{errors.zipCode}</p>}

          <div className="flex flex-col gap-y-2">
            <label className="font-medium">Account Type</label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-2">
                <input
                  required
                  type="radio"
                  value="businessAccount"
                  name="accountType"
                  onChange={(e) => setAccountType(e.target.value)}
                />
                Business
              </label>
              <label className="flex items-center gap-2">
                <input
                  required
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
            required
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.password.length > 1 && (
            <p className="text-sm text-[--deep-terracotta]">{errors.password}</p>
          )}

          <Input
            required
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            labelPlacement="outside"
            className="w-full rounded-md border border-[--brown]"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-[--deep-terracotta]">{errors.confirmPassword}</p>
          )}

            <button
              type="submit"
              className="button w-full py-2 text-lg font-semibold"
              style={{
                opacity: isFormValid ? 1 : 0.5,
                cursor: isFormValid ? "pointer" : "not-allowed",
              }}
              disabled={!isFormValid}
            >
              Sign Up
            </button>

          {errors.form && (
            <p className="text-sm text-[--deep-terracotta] text-center mt-2">
              {errors.form}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
