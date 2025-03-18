"use client"
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	// Router for redirecting to the dashboard.
	const router = useRouter();
	const [user] = useAuthState(auth);
	let userSession = null;
	
	console.log({user})
	
	if (typeof window !== 'undefined' && window.sessionStorage) {
		userSession = sessionStorage.getItem("user");
	}
	
	if (!user && !userSession){
		return router.push("/")
	}
	return (
		<div>
			{children}
		</div>
	);
}