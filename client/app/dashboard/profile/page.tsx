"use client"
import {addToast, Avatar, Input} from "@heroui/react";
import {Card, CardHeader, CardBody, Button} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function Profile() {
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);
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
		if (userProfile.username === "") {
			loadProfile();
		}
	}, [user]);

	useEffect(() => {
		setEmail(userProfile.email);
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
				userProfile.email = email;
				addToast({
					color: "default",
					title: "Email Change",
					description: "New email saved successfully!",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			} else {
				addToast({
					color: "warning",
					title: "Email Change",
					description: "An error occurred, please try again.",
					timeout: 5000,
					shouldShowTimeoutProgress: true,
				});
			}
		}
	}
	
	if (userProfile.email === "") {
		return (
			<div className="flex flex-col justify-center align-center flex-grow">
				<h2 className="text-2xl font-bold text-center">Loading...</h2>
			</div>
		);
	}
	else {
		return (
			<div className="m-6 flex flex-col align-center flex-grow gap-y-5">
				<Card shadow="lg" className="shadow-lg py-4 border-2 rounded-3xl w-fit h-fit">
					<CardHeader className="py-2 px-6 flex-col items-start max-w-60">
						<h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">{userProfile.username}</h3>
						<h4 className="text-md line-clamp-1 hover:line-clamp-none">{userProfile.name}</h4>
					</CardHeader>
					<CardBody className="pt-2">
						<Avatar isBordered color="primary" src="" size="lg" />
					</CardBody>
				</Card>
				<div className="flex border-2 border-gray-500 rounded-xl p-2">
					<p className="w-28">Change Email:</p>
					<input type="email" className="w-50 border-b-2" value={email} onChange={(e) => setEmail(e.target.value)}/>
					<button className="ml-auto px-3 bg-(--clay-beige) hover:bg-(--ash-olive) rounded-2xl disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={email === "" || email === userProfile.email} onClick={saveEmail} value="Change">Save</button>
				</div>
			</div>
		);
	}
}