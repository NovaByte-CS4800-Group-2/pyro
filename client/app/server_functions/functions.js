"use server"
import {checkCredentials, checkUsername} from "@/../server/loginDatabase"
import {createProfile} from "@/../server/profile";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify} from "jose"; 
import {NextRequest, NextResponse} from "next/server";

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

	// !! call sessionLogin here to start the session
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

export async function logout(username){
	return null; 
	//!!! call sessionLogOut here to cancel session 
}