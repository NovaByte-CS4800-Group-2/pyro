"use client"
import Form from "next/form";
import { registerUser } from "@/app/server_functions/functions";

export default function RegisterForm() {
	return <Form action={registerUser} 
			className="flex flex-col w-full max-w-80 m-auto mt-8 font-normal">
			<label htmlFor="name" className="self-start">Name</label>
			<input id="name" name="name" type="text" className="border-(liver) border-2 mb-6 p-2"></input>
			<label htmlFor="email" className="self-start">Email</label>
			<input id="email" name="email" type="email" className="border-(liver) border-2 mb-6 p-2"></input>
			<label htmlFor="username" className="self-start">Username</label>
			<input id="username" name="username" type="text" className="border-(liver) border-2 mb-6 p-2"></input>
			<div className="flex justify-between">
				<label htmlFor="zipcode" className="self-start">Zip Code</label>
				{/* TODO: Add pop-up dialog when link is clicked. */}
				<a className="text-sm mt-0.75 underline text-blue-500" href="/">Why we need it</a>
			</div>
			<input id="zipcode" name="zipcode" type="text" inputMode="numeric" pattern="[0-9]{5}" className="border-(liver) border-2 mb-6 p-2"></input>
			<label htmlFor="password" className="self-start">Password</label>
			<input id="password" name="password" type="password" className="border-(liver) border-2 mb-6 p-2"></input>
			<label htmlFor="confirm-password" className="self-start">Confirm Password</label>
			<input id="confirm-password" name="confirm-password" type="password" className="border-(liver) border-2 mb-8 p-2"></input>
			<button className="button m-auto text-(--liver)" type="submit">Sign Up</button>
		</Form>;
}