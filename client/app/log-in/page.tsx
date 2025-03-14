"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { redirect, usePathname } from "next/navigation";
import { loginUser } from "../server_functions/functions";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({
		username: "",
		password: "",
		form: "",
	});
	const [isFormValid, setIsFormValid] = useState(false);
	// 0 on first render so that validation will not run until inputs change (For some reason useEffect() runs twice on entering, this is why the comparison is > 1 rather than > 0).
	const isMounted = useRef(0);
	const pathName = usePathname();

	useEffect(() => {
		if (isMounted.current > 1) {
			validateForm();
		}
		if (pathName?.includes("log-in")) {;
			isMounted.current ++;
		} else {
			isMounted.current = 0;
		}
	}, [username, password]);

	const validateForm = () => {
		let errors = {
			username: "",
			password: "",
			form: "",
		};

		if (!username) {
			errors.username = "Username is required.";
		}
		if (!password) {
			errors.password = "Password is required.";
		}

		setErrors(errors);
		setIsFormValid(!errors.username && !errors.password);
	}

	const handleSubmit = async () => {
		if (isFormValid && await loginUser(password, username)) {
			redirect("/dashboard")
		} else {
			setErrors({username: "", password: "", form: "The given username or password is incorrect. Please try again."});
		}
	}

  	return (
		<>
		<div className="mt-10 ml-30 mr-30 text-center flex flex-col">
			<h1 className="text-3xl font-display pb-2 font-bold">Log In</h1>
			<h2 className="text-l font-display">Don't have an account? <Link href="/register" className="font-semibold hover:underline">Sign Up</Link></h2>
			<form action={handleSubmit} className="flex flex-col m-auto mt-8 font-normal">
				<div className="flex flex-col pb-4">
					<label htmlFor="username" className="self-start">Username</label>
					<input id="username" name="username" type="text" onChange={(e) => setUsername(e.target.value)} style={{border: !errors.username ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"></input>
					{errors.username && <p className="text-sm text-red-500 self-end pr-1">{errors.username}</p>}
				</div>
				<div className="flex flex-col pb-8">
					<label htmlFor="password" className="self-start">Password</label>
					<input id="password" name="password" type="text" onChange={(e) => setPassword(e.target.value)} style={{border: !errors.password ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"></input>
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
