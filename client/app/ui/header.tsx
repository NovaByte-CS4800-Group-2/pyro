import { FireIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import "@/app/globals.css";

export default function Header() {
	return <div className="flex bg-(--moss-green) border-b-2 border-(--liver) w-full h-18 font-display">
		<div className="w-1/3" />
		<Link href="/" className="flex justify-center items-center w-1/3 bg-(--sage)">
			<FireIcon className="text-(--cocoa-brown) pt-2 w-9.5"/>
			<h1 className="text-4xl font-bold">Pyro</h1>
		</Link>
		<nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold"><Link href="/log-in" className="button text-(--liver)">Log In</Link><Link href="/register" className="button text-(--liver)">Register</Link></nav>
  	</div>
}