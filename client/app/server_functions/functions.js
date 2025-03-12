"use server"
import {checkCredentials, checkUsername} from "@/../server/loginDatabase"
import {createProfile} from "@/../server/profile";
import { redirect } from "next/navigation";

export async function registerUser(formData) {
	const name = formData.name;
	const email = formData.email;
	const username = formData.username;
	const zipcode = formData.zipcode;
	const password = formData.password;
	const confirmPassword = formData.confirmPassword;
	console.log(formData);
	createProfile(username, name, email, zipcode, password, false);


	redirect('/dashboard');
}

export async function loginUser(formData) {
	const username = formData.get("username");
	const password = formData.get("password");

	if (await checkCredentials(password, username)) {
		redirect('/dashboard');
	} else {
		console.log(":(");
	}
}