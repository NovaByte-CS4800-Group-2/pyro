"use server"
import {checkCredentials, checkUsername, validatePassword} from "@/../server/loginDatabase"
import {createProfile} from "@/../server/profile";

export async function registerUser(username, name, email, zipCode, password, businessAccount) {
	createProfile(username, name, email, zipCode, password, businessAccount);
	return true;
}

export async function loginUser(password, username) {

	if (await checkCredentials(password, username)) {
		return true;
	} else {
		console.log(":(");
		return false;
	}
}

export async function checkPassword(password) {
	return validatePassword(password);
}

export async function checkValidUsername(username) {
	return ! await checkUsername(username);
}