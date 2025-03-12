"use client"

import { FireIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import Button from "./button";

export default function Header() {
	const pathname = usePathname();
	let html = <></>;
	/* Changes the nav buttons depending on the current url. */
	if (pathname.includes("dashboard")) {
		html = <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold"></nav>;	
	}
	else if (pathname.includes("register") || pathname.includes("log-in")) {
		html = <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold"><Button label="Back"></Button></nav>;
	}
	else {
		html = <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold"><Button link="/log-in" label="Log In"></Button><Button link="/register" label="Register"></Button></nav>;
	}
	return (
		<div className="flex bg-(--liver) border-b-2 border-(--liver) w-full h-18 font-display">
		<div className="w-1/3" />
		<Link href="/" className="flex justify-center items-center w-1/3 bg-(--liver)">
			<FireIcon className="text-(--cocoa-brown) pt-2 w-9.5"/>
			<h1 className="text-4xl font-bold" style={{ color: "var(--seashell)" }}>Pyro</h1>

		</Link>{html}</div>);
}