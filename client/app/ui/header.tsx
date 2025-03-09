import { FireIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default function Header() {
	return <div className="flex bg-(--liver) border-b-2 border-neutral-800 w-full h-18 text-(--seashell) font-display">
		<div className="w-1/3" />
		<Link href="/" className="flex justify-center items-center w-1/3">
			<FireIcon className="text-(--cocoa-brown) pt-2"
			width={40}
			height={40}
			/>
			<h1 className="text-4xl font-bold">Pyro</h1>
		</Link>
		<nav className="w-1/3 flex justify-end items-center p-5 gap-2"><Link href="/log-in">Log In</Link><Link href="/register">Register</Link></nav>
  	</div>
}