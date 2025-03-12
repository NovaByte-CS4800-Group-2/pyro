"use client"
import Form from "next/form";
import { registerUser } from "@/app/server_functions/functions";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
	name: string
	email: string
	username: string
	zipcode: string
	password: string
	confirmPassword: string
}

export default function RegisterForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = registerUser;

	watch("name");
	watch("email");
	watch("username");
	watch("zipcode");
	watch("password");
	watch("confirmPassword");

	return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-80 m-auto mt-8 font-normal">
			<label htmlFor="name" className="self-start">Name</label>
			<input {...register("name", { required: true })} aria-invalid={errors.name ? "true" : "false"} id="name" type="text" className="border-(liver) border-2 mb-6 p-2"></input>
			{errors.name && <span>This field is required</span>}
			<label htmlFor="email" className="self-start">Email</label>
			<input {...register("email", { required: true })} id="email" type="email" className="border-(liver) border-2 mb-6 p-2"></input>
			{errors.email && <span role="alert">This field is required</span>}
			<label htmlFor="username" className="self-start">Username</label>
			<input {...register("username", { required: true })} id="username" type="text" className="border-(liver) border-2 mb-6 p-2"></input>
			{errors.username && <span>This field is required</span>}
			<div className="flex justify-between">
				<label htmlFor="zipcode" className="self-start">Zip Code</label>
				{/* TODO: Add pop-up dialog when link is clicked. */}
				<a className="text-sm mt-0.75 underline text-blue-500" href="/">Why we need it</a>
			</div>
			<input {...register("zipcode", { required: true, pattern: /[0-9]{5}/i })} id="zipcode" type="text" inputMode="numeric" pattern="[0-9]{5}" className="border-(liver) border-2 mb-6 p-2"></input>
			{errors.zipcode && <span>This field is required</span>}
			<label htmlFor="password" className="self-start">Password</label>
			<input {...register("password", { required: true })} id="password" type="password" className="border-(liver) border-2 mb-6 p-2"></input>
			{errors.password && <span>This field is required</span>}
			<label htmlFor="confirm-password" className="self-start">Confirm Password</label>
			<input {...register("confirmPassword", { required: true })} id="confirm-password" type="password" className="border-(liver) border-2 mb-8 p-2"></input>
			{errors.confirmPassword && <span>This field is required</span>}
			<button className="button m-auto text-(--liver)" type="submit">Sign Up</button>
		</form>;
}