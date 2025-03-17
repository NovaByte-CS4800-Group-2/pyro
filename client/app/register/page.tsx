"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, } from "next/navigation";
import { checkPassword, checkValidUsername, registerUser } from "../server_functions/functions";


export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		username: "",
		zipCode: "",
		password: [""],
		confirmPassword: "",
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
	}, [name,
		email,
		username,
		zipCode,
		password,
		confirmPassword,
	]);

	const validateForm = async () => {
		let errors = {
			name: "",
			email: "",
			username: "",
			zipCode: "",
			password: [""],
			confirmPassword: "",
			form: "",
		};
		// TODO: For email validation, it isn't working :(
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!name) {
			errors.name = "Name is required.";
		}
		if (!email) {
			errors.email = "Email is required.";
		} else if (re.test(errors.email)) {
			errors.email = "Invalid email format.";			
		}
		if (!username) {
			errors.username = "Username is required.";
		} else if (! await checkValidUsername(username)) {
			errors.username = "This username is taken.";
		}
		if (!zipCode) {
			errors.zipCode = "Zipcode is required.";
		} else if (Number.isNaN(parseInt(zipCode)) || zipCode.length !== 5) {
			errors.zipCode = "Zipcode must be a valid five digit number.";	
		}
		if (!password) {
			errors.password = ["Password is required.", ""];
		} else {
			let passErrors = await checkPassword(password);
			if (passErrors.length != 0) {
				errors.password = passErrors;
			}
		}
		if (!confirmPassword) {
			errors.confirmPassword = "Password confirmation is required.";
		} else if (confirmPassword !== password) {
			errors.confirmPassword = "Passwords do not match."
		}

		setErrors(errors);
		setIsFormValid(true)
		Object.entries(errors).forEach(([key, value]) => {
			if (key === "password") {
				if (value.length !== 1) {
					setIsFormValid(false);
				}
			} else if (value !== "") {
				setIsFormValid(false);
			}
		});
	}

	const handleSubmit = async (formData: FormData) => {
		try {
			const response = await fetch('http://localhost:8080/register', {
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
				if (response.status == 404) {
					setErrors({name: "",
						email: "",
						username: "",
						zipCode: "",
						password: [""],
						confirmPassword: "",
						form: "An error has occurred in creating a new user. Please try again."});
				} else {
					setErrors({name: "",
						email: "",
						username: "",
						zipCode: "",
						password: [""],
						confirmPassword: "",
						form: "An unexpected error has occurred. Please try again."});
				}
			}
		} catch (error) {
			// Handle network errors
			console.error('Fetch error:', error);
		}
	}

	/*
	function displayErrors(array: String[]) {
		let html = ""
		array.forEach((error) => html += `<p className="text-sm text-red-500 self-end pr-1">${error}</p>`)
		console.log(html);
		return html;
	} */
	
	return (
		<>
		  <div className="m-10 ml-30 mr-30 text-center flex flex-col">
			<h1 className="text-3xl font-display pb-2 font-bold">Create New Account</h1>
			<h2 className="text-l font-display">Already Registered? <Link href="/log-in" className="font-semibold hover:underline">Log in</Link></h2>
			<form action={handleSubmit} className="flex flex-col w-full max-w-80 m-auto mt-8 font-normal">
				<div className="flex flex-col pb-4">
					<label htmlFor="name" className="self-start">Name</label>
					<input id="name" name="name" type="text" onChange={(e) => setName(e.target.value)} style={{border: !errors.name ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.name && <p className="text-sm text-red-500 self-end pr-1">{errors.name}</p>}
				</div>
				<div className="flex flex-col pb-4">
					<label htmlFor="email" className="self-start">Email</label>
					<input id="email" name="email" type="email" onChange={(e) => setEmail(e.target.value)} style={{border: !errors.email ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.email && <p className="text-sm text-red-500 self-end pr-1">{errors.email}</p>}
				</div>			
				<div className="flex flex-col pb-4">
					<label htmlFor="username" className="self-start">Username</label>
					<input id="username" name="username" type="text" onChange={(e) => setUsername(e.target.value)} style={{border: !errors.username ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.username && <p className="text-sm text-red-500 self-end pr-1">{errors.username}</p>}
				</div>
				<div className="flex flex-col pb-4">
					<label htmlFor="zipCode" className="self-start">Zip Code</label>
					<input id="zipCode" name="zipCode" type="text" inputMode="numeric" onChange={(e) => setZipCode(e.target.value)} style={{border: !errors.zipCode ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.zipCode && <p className="text-sm text-red-500 self-end pr-1">{errors.zipCode}</p>}
				</div>
				<div className="flex flex-col pb-4 gap-y-2">
					<label className="self-start p-">Account Type</label>
					<div className="flex pl-5 gap-x-3">
						<input id="businessAccount" value="businessAccount" name="accountType" type="radio" className="checked:accent-(--cocoa-brown)"></input>
						<label htmlFor="businessAccount" className="self-start">Business Account</label>				
					</div>
					<div className="flex pl-5 gap-x-3">
						<input defaultChecked id="personalAccount" value="personalAccount" name="accountType" type="radio" className="checked:accent-(--cocoa-brown)"></input>
						<label htmlFor="personalAccount" className="self-start">Personal Account</label>
					</div>
				</div>
				<div className="flex flex-col pb-4">
					<label htmlFor="password" className="self-start">Password</label>
					<input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} style={{border: errors.password.length === 1 ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.password.length > 1 && <p className="text-sm text-red-500 self-end pr-1">{errors.password.join('\n')}</p>}
				</div>
				<div className="flex flex-col pb-4">
					<label htmlFor="confirmPassword" className="self-start">Confirm Password</label>
					<input id="confirmPassword" name="confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)} style={{border: !errors.confirmPassword ? "2px solid var(--liver)" : "2px solid red"}} className="p-2"/>
					{errors.confirmPassword && <p className="text-sm text-red-500 self-end pr-1">{errors.confirmPassword}</p>}
				</div>				
				{/* TODO: Switch to use Button component. */}
				<button className="button m-auto text-(--liver) hover:bg-(--moss-green)" style={{opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? "pointer" : "not-allowed"}} disabled={!isFormValid} type="submit">Sign Up</button>
				{errors.form && <p className="text-sm text-red-500 self-center mt-3 max-w-50">{errors.form}</p>}
			</form>
		  </div>
		</>
  	);
}
