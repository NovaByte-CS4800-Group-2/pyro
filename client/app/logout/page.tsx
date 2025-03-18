'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'



export default function Logout(){
	const router = useRouter(); 
	useEffect(() => {
		const handleLogout = async () => {
			try {
				await signOut(auth); 
				sessionStorage.removeItem("user");
				router.push("/");
			} catch (e) {
				console.error("Error signing out:", e);
			}
		};

		handleLogout(); 
	}, [router]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
		<h1 className="text-2xl font-bold">Logging out...</h1>
		</div>
	);
	// trigger the logout when this component is rendered
}