"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from "@/app/firebase/config"
import { loginUser } from "../server_functions/functions";
import { signIn } from "next-auth/react";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth); 

	const [errors, setErrors] = useState({
		email: "",
		password: "",
		form: "",
	});
	const [isFormValid, setIsFormValid] = useState(false);
	// false on render so that validation will not run until inputs change.
	const [isMounted, setIsMounted] = useState(false);
	
	// Router for redirecting to the dashboard.
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
	}

	const handleSubmit = async (formData: FormData) => {
		try {
			const response = await fetch('http://localhost:8080/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(Object.fromEntries(formData)),
			});
		
			if (response.ok) {
				const responseData = await response.json();
				// Handle successful response
				console.log('Success:', responseData);
				router.push("/dashboard");
			} else {
				// Handle error response
				console.error('Error:', response.status);
				if (response.status == 400) {
					setErrors({email: "", password: "", form: "Both email and password must be entered."});
				} else if (response.status == 401) {
					setErrors({email: "", password: "", form: "The given email or password is incorrect. Please try again."});
				} else {
					setErrors({email: "", password: "", form: "An unexpected error has occurred. Please try again."});
				}
			}
		} catch (error) {
			// Handle network errors
			console.error('Fetch error:', error);
		}
	}

	const handleSignIn = async (formData: FormData) => {
		// handle sign up logic here (calling API/firebase auth)
		try {
			const res = await signInWithEmailAndPassword(email, password);
			console.log(res)
			sessionStorage.setItem('user', String(true))// when getting it back, use sessionStorage.getItem('user')
			//sessionStorage.setItem('user', true);
			const response = await fetch('http://localhost:8080/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(Object.fromEntries(formData)),
			});
		
			if (response.ok) {
				const responseData = await response.json();
				// Handle successful response
				console.log('Success:', responseData);
				router.push("/dashboard");
			} else {
				// Handle error response
				console.error('Error:', response.status);
				if (response.status == 400) {
					setErrors({email: "", password: "", form: "Both email and password must be entered."});
				} else if (response.status == 401) {
					setErrors({email: "", password: "", form: "The given email or password is incorrect. Please try again."});
				} else {
					setErrors({email: "", password: "", form: "An unexpected error has occurred. Please try again."});
				}
			}
		} catch (error) {
			// Handle network errors
			console.error('Fetch error:', error);
		}
	}

  	return (
		<>
		<div className="mt-10 ml-30 mr-30 text-center flex flex-col">
			<h1 className="text-3xl font-display pb-2 font-bold">Log In</h1>
			<h2 className="text-l font-display">Don't have an account? <Link href="/register" className="font-semibold hover:underline">Sign Up</Link></h2>
			<form action={handleSignIn} className="flex flex-col m-auto mt-8 font-normal">
				<div className="flex flex-col pb-4">
					<label htmlFor="email" className="self-start">Email</label>
					<input id="email" name="email" type="text" onChange={(e) => setEmail(e.target.value)} style={{border: !errors.email ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"></input>
					{errors.email && <p className="text-sm text-red-500 self-end pr-1">{errors.email}</p>}
				</div>
				<div className="flex flex-col pb-8">
					<label htmlFor="password" className="self-start">Password</label>
					<input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} style={{border: !errors.password ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"></input>
					{errors.password && <p className="text-sm text-red-500 self-end pr-1">{errors.password}</p>}
				</div>
				{/* TODO: Switch to use Button component. */}
				<button className="button m-auto text-(--liver) hover:bg-(--moss-green)" style={{opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? "pointer" : "not-allowed"}} disabled={!isFormValid} type="submit">Log In</button>
				{errors.form && <p className="text-sm text-red-500 self-center mt-3 max-w-50">{errors.form}</p>}
			</form>
		</div>
		</>
	);
}
