"use client"
import {addToast, Avatar, Button, Card, CardHeader, CardBody, CircularProgress, Input, 
		Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import { useAuthState, useVerifyBeforeUpdateEmail, useUpdateProfile, useUpdatePassword } from "react-firebase-hooks/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Forum from "@/app/ui/forum";
import { EmailAuthProvider, reauthenticateWithCredential, } from "firebase/auth";
import Comments from "../../ui/comments"; // Import Comments component

export default function Profile() {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [verifyBeforeUpdateEmail, emailUpdating, emailError] = useVerifyBeforeUpdateEmail(auth);
	const [updateProfile, profileError] = useUpdateProfile(auth);
	const [updatePassword, passwordLoading, passwordError] = useUpdatePassword(auth);
	const profileModal = useDisclosure();
	const passwordModal = useDisclosure();
	// User Info States (from database)
	const [userProfile, setUserProfile] = useState({
		user_id: 0,
		username: "",
		name: "",
		email: "",
		zip_code: 0,
		profile_picture: "",
		business_account: 0,
	});
	const [editing, setEditing] = useState(false);
	// Personal Info States
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [zipcode, setZipcode] = useState("");
	// Profile Picture States
	const [profileURL, setProfileURL] = useState("");
	const [profilePic, setProfilePic] = useState<Blob | ArrayBuffer | Uint8Array<ArrayBufferLike> | undefined>();
	// Password States
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Function to load user profile information.
	useEffect(() => {
		const loadProfile = async () => {
			if (!user) {
				router.push("/");
			}
			else {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${user.displayName}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				if (response.ok) {
					const responseData = await response.json();
					const { profile } = responseData;
					const { user_id, username, name, zip_code, business_account } = profile;
					let profile_picture = ""
					if (user?.photoURL) {
						profile_picture = user?.photoURL;
					}
					const userEmail = user.email || "error";
					const userProf = {user_id, username, name, email: userEmail, zip_code, profile_picture, business_account};
					setUserProfile(userProf);
				}
				
			}
		};
		loadProfile();
	}, [user]);

	// Function to set input states.
	useEffect(() => {
		setEmail(userProfile.email);
		setUsername(userProfile.username);
		setZipcode(String(userProfile.zip_code));
	}, [userProfile]);

	const saveEmail = async () => {
		if (email !== userProfile.email && auth.currentUser) {
			const rep = await verifyBeforeUpdateEmail(email, null);
			if (rep.valueOf()) {
				addToast({
					color: "primary",
					variant: "bordered",
					title: "Email Change",
					description: "An email has been sent to your new email address. Please open it to confirm your change.",
					timeout: 3000,
				});
			}
			else {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Email Change",
					description: "The given email is invalid or already in use. Please try again.",
					timeout: 3000,
				});
			}
		}
	};

	// Function to change username.
	const saveUsername = async () => {
		if (username !== userProfile.username) {
			const user_id = userProfile.user_id;
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/editUsername`, {
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
						variant: "bordered",
						title: "Username Change",
						description: "New username saved successfully!",
						timeout: 3000,
					});
				}
				else {
					addToast({
						color: "danger",
						variant: "bordered",
						title: "Username Change",
						description: `FIREBASE ERROR >:( ${profileError}`,
						timeout: 3000,
					});
				}
			} else if (response.status == 400) {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Username Change",
					description: "An error occurred, please try again.",
					timeout: 3000,
				});
			} else if (response.status == 406) {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Username Change",
					description: `The username ${username} is taken. Please select a different username.`,
					timeout: 3000,
				});				
			}
		}
	};

	// Function to change zipcode.
	const saveZipcode = async () => {
		const zipcodeNum = parseInt(zipcode);
		if (zipcodeNum !== userProfile.zip_code) {
			const user_id = userProfile.user_id;
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/editZipcode`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body:JSON.stringify({ zipcode, user_id }),
			});
			if (response.ok) {
				userProfile.zip_code = zipcodeNum;
				addToast({
					color: "success",
					variant: "bordered",
					title: "Zipcode Change",
					description: "New zipcode saved successfully!",
					timeout: 3000,
				});
			} else if (response.status == 400) {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Zipcode Change",
					description: "An error occurred, please try again.",
					timeout: 3000,
				});
			} else if (response.status == 406) {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Zipcode Change",
					description: `Invalid zipcode format. Please correct the error and try again.`,
					timeout: 3000,
				});				
			}
		}
	};

	// Function to display profile image on file selection.
	const onImageChange = (e: any) => {
		if (e.target.files && e.target.files[0]) {
			setProfilePic(e.target.files[0]);
			setProfileURL(URL.createObjectURL(e.target.files[0]));
		}
	};

	// Function to upload profile image to Firestore.
	const uploadImageToStorage = async (userId: String) => {
		const storage = getStorage();
		const storageRef = ref(storage, 'profilePics/' + userId); // Create a reference
		
		// Upload the file
		if (profilePic) {
			await uploadBytes(storageRef, profilePic);
			
			// Get download URL
			const url = await getDownloadURL(storageRef);
			return url;
		}
		else {
			return null;
		}
	};

	// Function to update user profile picture.
	const updateProfilePic = async () => {
		try {
			const userId = auth.currentUser?.uid;
			if (userId) {
				const photoURL = await uploadImageToStorage(userId);
				if (photoURL) {
					await updateProfile({ photoURL });
					userProfile.profile_picture = photoURL;
					addToast({
						color: "success",
						variant: "bordered",
						title: "Profile Picture Change",
						description: `New profile picture saved successfully!`,
						timeout: 3000,
					});	
				}
				else {
					addToast({
						color: "warning",
						variant: "bordered",
						title: "Profile Picture Change",
						description: `No profile picture given. Please try again.`,
						timeout: 3000,
					});	
				}
			}
			else {
				addToast({
					color: "danger",
					variant: "bordered",
					title: "Profile Picture Change",
					description: `How did you get here??? You're not logged in!`,
					timeout: 3000,
				});	
			}
		} catch(e) {
			console.log(e);
		}
	};

	const updateUserPassword = async () => {
		if (user?.email) {
			const credential = EmailAuthProvider.credential(
				user.email,
				password
			)
			if (credential) {
					await reauthenticateWithCredential(user, credential)
					await updatePassword(newPassword);
			}
			setPassword("");
			setNewPassword("");
			setConfirmPassword("");
		}
	}

	useEffect(() => {
		if (!passwordLoading) {
			if (!passwordError) {
				addToast({
				color: "success",
				variant: "bordered",
				title: "Password Change",
				description: `New password saved successfully!`,
				timeout: 3000,
				});
			}	
			else if (passwordError?.message.includes("auth/password-does-not-meet-requirements")) {
				addToast({
					color: "warning",
					variant: "bordered",
					title: "Password Change",
					description: `The new password given does not meet requirements. Please try again.`,
					timeout: 3000,
				});	
			} else {
				addToast({
					color: "danger",
					variant: "bordered",
					title: "Password Change",
					description: `The given password was incorrect. Please try again.`,
					timeout: 3000,
				});	
			}
		}
	}, [passwordLoading]);

	// Function to toggle edit state.
	const toggleEditing = () => {
		if (editing) {
			setEditing(false);
			setEmail(userProfile.email);
			setUsername(userProfile.username);
			setZipcode(String(userProfile.zip_code));
		} else {
			setEditing(true);
		}
	};

	// Return html
	if (userProfile.email === "") {
		return (
			<div className="flex flex-col items-center justify-center flex-grow">
				<h2 className="flex flex-row text-2xl font-bold"><CircularProgress className="pr-4" color="primary" aria-label="Loading..." />Loading...</h2>
			</div>
		);
	}
	else {
		return (
			<div className="flex-grow flex max-lg:flex-col m-6 gap-y-10 gap-x-2">
					<Card shadow="lg" className="shadow-lg p-4 border-2 rounded-3xl h-fit flex-grow gap-y-1 max-w-[500px]">
						<CardHeader className="py-2 flex flex-col items-center">
							<Avatar className="w-40 h-40 hover:cursor-pointer mb-1" isBordered color="primary" src={userProfile.profile_picture} onClick={profileModal.onOpen}/>
							<h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">{userProfile.username}</h3>
							<h4 className="line-clamp-1 hover:line-clamp-none">{userProfile.name}</h4>
						</CardHeader>
						<CardBody className="pt-2 flex flex-col items-stretch gap-y-3 border-2 border-gray-200 shadow-md bg-neutral-50 rounded-xl">
							<p className="mt-1 font-semibold text-center">Personal Info</p>
							<div className="flex border-b-2 border-gray-200 p-2 items-center">
								<p className="w-[5.5rem]">Username:</p>
								{!editing ? <p>{username}</p> : <input type="text" className="w-[50] border-b-2" value={username} onChange={(e) => setUsername(e.target.value)}/>}
								{!editing ? <></> : <Button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={username === "" || username === userProfile.username} onPress={saveUsername} value="Change">Save</Button>}
							</div>
							<div className="flex border-b-2 border-gray-200 p-2 items-center">
								<p className="w-[5.5rem]">Email:</p>
								{!editing ? <p>{email}</p> : <input type="email" className="w-[50] border-b-2" value={email} onChange={(e) => setEmail(e.target.value)}/>}
								{!editing ? <></> : <Button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={email === "" || email === userProfile.email} onPress={saveEmail} value="Change">Save</Button>}
							</div>
							<div className="flex border-b-2 border-gray-200 p-2 items-center">
								<p className="w-[5.5rem]">Zipcode:</p>
								{!editing ? <p>{zipcode}</p> : <input type="text" inputMode="numeric" className="w-[50] border-b-2" value={zipcode} onChange={(e) => setZipcode(e.target.value)}/>}
								{!editing ? <></> : <Button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive] disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:cursor-not-allowed" disabled={zipcode === "" || parseInt(zipcode) === userProfile.zip_code} onPress={saveZipcode} value="Change">Save</Button>}
							</div>
							<div className="flex border-b-2 border-gray-200 p-2 items-center">
								<p className="w-[5.5rem]">Password:</p>
								<p className="font-semibold">*****</p>
								{!editing ? <></> : <Button className="ml-auto px-3 bg-[--clay-beige] hover:bg-[--ash-olive]" onPress={passwordModal.onOpen}>Change Password</Button>}
							</div>
							<Button className="self-center shadow-sm mt-3 bg-[--clay-beige] hover:bg-[--ash-olive] px-3 py-0.5" onPress={toggleEditing}>{editing ? "Stop Editing" : "Edit Information"}</Button>
						</CardBody>
					</Card>
					<Modal isOpen={profileModal.isOpen} onOpenChange={profileModal.onOpenChange}>
						<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Change Profile Picture</ModalHeader>
								<ModalBody>
									<Input type="file" accept=".jpg, .jpeg, .png" onChange={onImageChange}></Input>
									<img className="aspect-square max-w-[300px] object-cover rounded-full self-center" alt={profileURL ? "Profile Picture" : ""} src={profileURL ? profileURL : undefined}></img>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
									Close
									</Button>
									<Button color="primary" onPress={() => {onClose(); updateProfilePic();}}>
									Save
									</Button>
								</ModalFooter>
							</>
						)}
						</ModalContent>
					</Modal>
					<Modal isOpen={passwordModal.isOpen} onOpenChange={passwordModal.onOpenChange}>
						<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
								<ModalBody>
									<Input
										required
										type="password"
										label="Enter Old Password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										labelPlacement="outside"
										className="w-full"
									/>
									<Input
										required
										type="password"
										label="Enter New Password"
										placeholder="••••••••"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										labelPlacement="outside"
										className="w-full"
									/>
									<Input
										required
										type="password"
										label="Confirm Password"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										labelPlacement="outside"
										className="w-full"
									/>
									{confirmPassword != "" && confirmPassword != newPassword ? <p className="text-red-400 text-sm">Passwords do not match.</p> : <></>}
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
									Close
									</Button>
									<Button color="primary" isDisabled={!password || !newPassword || !confirmPassword || confirmPassword != newPassword} onPress={() => {onClose(); updateUserPassword();}}>
									Save
									</Button>
								</ModalFooter>
							</>
						)}
						</ModalContent>
					</Modal>
					<Card className="flex-grow shadow-md border-2 border-neutral-200 rounded-3xl">
						<CardBody>
							<Tabs>
								<Tab key="posts" title="Posts">
									<Forum userID={String(userProfile.user_id)}></Forum>
								</Tab>
								<Tab key="comments" title="Comments">
									<Comments user_id={String(userProfile.user_id)} />
			  				</Tab>
							</Tabs>
						</CardBody>
					</Card>
			</div>
		);
	}
}