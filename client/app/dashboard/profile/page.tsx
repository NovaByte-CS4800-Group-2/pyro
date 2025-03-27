"use client"
import {addToast, Avatar, CircularProgress} from "@heroui/react";
import {Card, CardHeader, CardBody} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState, useVerifyBeforeUpdateEmail, useUpdateProfile } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function Profile() {
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);
	const [verifyBeforeUpdateEmail, emailUpdating, emailError] = useVerifyBeforeUpdateEmail(auth);
	const [updateProfile, profileUpdating, profileError] = useUpdateProfile(auth);
	const [userProfile, setUserProfile] = useState({
		user_id: 0,
		username: "",
		name: "",
		email: "",
		zip_code: 0,
		profile_picture: null,
		business_account: 0,
	});
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [zipcode, setZipcode] = useState("");
	
	useEffect(() => {
		const loadProfile = async () => {
			if (!user) {
				router.push("/");
			}
			else {
				const response = await fetch(`http://localhost:8080/profile/${user.displayName}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				if (response.ok) {
					const responseData = await response.json();
					const { profile } = responseData;
					const { user_id, username, name, email, zip_code, profile_picture, business_account } = profile;
					const userProf = {user_id, username, name, email, zip_code, profile_picture, business_account};
					setUserProfile(userProf);
				}
				
			}
		};
		if (userProfile.email === "") {
			loadProfile();
		}
	}, [user]);

	useEffect(() => {
		setEmail(userProfile.email);
		setUsername(userProfile.username);
		setZipcode(String(userProfile.zip_code));
	}, [userProfile]);

	const saveEmail = async () => {
		if (email !== userProfile.email) {
			const user_id = userProfile.user_id;
			const response = await fetch(`http://localhost:8080/profile/editEmail`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body:JSON.stringify({ email, user_id }),
			});
			if (response.ok) {
				const promise = verifyBeforeUpdateEmail(email, null);
				if (emailUpdating) {
					addToast({
						color: "primary",
						title: "Email Change",
						description: "An email has been sent to your current email address. Please open it to confirm your change.",
					});
				}
				const res = await promise;
				if (res) {
					userProfile.email = email;
					addToast({
						color: "success",
						title: "Email Change",
						description: "New email saved successfully!",
						timeout: 5000,
						shouldShowTimeoutProgress: true,
					});
				}
				else {
					addToast({
						color: "danger",
						title: "Email Change",
						description: `FIREBASE ERROR >:( ${emailError}`,
						timeout: 5000,
						shouldShowTimeoutProgress: true,
					});
				}
			} else if (response.status == 400) {
				addToast({
					color: "warning",
					title: "Email Change",
					description: "An error occurred, please try again.",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			} else if (response.status == 406) {
				addToast({
					color: "warning",
					title: "Email Change",
					description: `${await response.json()}`,
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});	
			}
		}
	}
	const saveUsername = async () => {
		if (username !== userProfile.username) {
			const user_id = userProfile.user_id;
			const response = await fetch(`http://localhost:8080/profile/editUsername`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body:JSON.stringify({ username, user_id }),
			});
			if (response.ok) {
				const res = await updateProfile({displayName: username});
				if (res) {
					userProfile.username = username;
					addToast({
						color: "success",
						title: "Username Change",
						description: "New username saved successfully!",
						timeout: 5000,
						shouldShowTimeoutProgress: true,
					});
				}
				else {
					addToast({
						color: "danger",
						title: "Username Change",
						description: `FIREBASE ERROR >:( ${profileError}`,
						timeout: 5000,
						shouldShowTimeoutProgress: true,
					});
				}
			} else if (response.status == 400) {
				addToast({
					color: "warning",
					title: "Username Change",
					description: "An error occurred, please try again.",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			} else if (response.status == 406) {
				addToast({
					color: "warning",
					title: "Username Change",
					description: `The username ${username} is taken. Please select a different username.`,
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});				
			}
		}
	}
	const saveZipcode = async () => {
		const zipcodeNum = parseInt(zipcode);
		if (zipcodeNum !== userProfile.zip_code) {
			const user_id = userProfile.user_id;
			const response = await fetch(`http://localhost:8080/profile/editZipcode`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body:JSON.stringify({ zipcode, user_id }),
			});
			if (response.ok) {
				userProfile.zip_code = zipcodeNum;
				addToast({
					color: "success",
					title: "Zipcode Change",
					description: "New zipcode saved successfully!",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			} else if (response.status == 400) {
				addToast({
					color: "warning",
					title: "Zipcode Change",
					description: "An error occurred, please try again.",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			} else if (response.status == 406) {
				addToast({
					color: "warning",
					title: "Zipcode Change",
					description: `Invalid zipcode format. Please correct the error and try again.`,
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});				
			}
		}
	}
	
	if (userProfile.email === "") {
		return (
			<div className="flex flex-col items-center justify-center flex-grow">
				<h2 className="flex flex-row text-2xl font-bold"><CircularProgress className="pr-4" color="primary" aria-label="Loading..." />Loading...</h2>
			</div>
		);
	}
	else {
		return (
			<div className="m-6 flex flex-col flex-grow gap-y-5">
				<Card shadow="lg" className="shadow-lg p-4 border-2 rounded-3xl w-fit h-fit">
					<CardHeader className="py-2 px-6 flex-col items-start max-w-60">
						<h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">{userProfile.username}</h3>
						<h4 className="line-clamp-1 hover:line-clamp-none">{userProfile.name}</h4>
					</CardHeader>
					<CardBody className="pt-2">
						<Avatar isBordered color="primary" src="" className="w-40 h-40"/>
					</CardBody>
				</Card>
				<div className="flex border-2 border-gray-500 rounded-xl p-2 max-w-[500px]">
					<p className="w-[9rem]">Change Username:</p>
					<input type="text" className="w-[50] border-b-2" value={username} onChange={(e) => setUsername(e.target.value)}/>
					<button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] rounded-2xl disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={username === "" || username === userProfile.username} onClick={saveUsername} value="Change">Save</button>
				</div>
				{/*<div className="flex border-2 border-gray-500 rounded-xl p-2 max-w-[500px]">
					<p className="w-28">Change Email:</p>
					<input type="email" className="w-[50] border-b-2" value={email} onChange={(e) => setEmail(e.target.value)}/>
					<button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] rounded-2xl disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={email === "" || email === userProfile.email} onClick={saveEmail} value="Change">Save</button>
				</div>*/}
				<div className="flex border-2 border-gray-500 rounded-xl p-2 max-w-[500px]">
					<p className="w-[8rem]">Change Zipcode:</p>
					<input type="text" inputMode="numeric" className="w-[50] border-b-2" value={zipcode} onChange={(e) => setZipcode(e.target.value)}/>
					<button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] rounded-2xl disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={zipcode === "" || parseInt(zipcode) === userProfile.zip_code} onClick={saveZipcode} value="Change">Save</button>
				</div>
			</div>
		);
	}
}