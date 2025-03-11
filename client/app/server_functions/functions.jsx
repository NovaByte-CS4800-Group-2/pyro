"use server"
import {createProfile} from "../../../server/profile";


export async function registerUser(formData) {
	const name = formData.get("name");
	const email = formData.get("email");
	const username = formData.get("username");
	const zipcode = formData.get("zipcode");
	const password = formData.get("password");
	const confirmPassword = formData.get("confirm-password");
	if (name & email & username & zipcode & password & confirmPassword) {
		createProfile(username, name, email, zipcode, password, false);
	}
}

export async function loginUser() {
	
}