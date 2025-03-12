"use server"
import {checkCredentials, checkUsername} from "@/../server/loginDatabase"
import {createProfile} from "@/../server/profile";
import { redirect } from "next/navigation";

export async function registerUser(formData) {
	const name = formData.get("name");
	const email = formData.get("email");
	const username = formData.get("username");
	const zipcode = formData.get("zipcode");
	const password = formData.get("password");
	const confirmPassword = formData.get("confirm-password");
	console.log(formData);
	createProfile(username, name, email, zipcode, password, false);

	redirect('/');
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