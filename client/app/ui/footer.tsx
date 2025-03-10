import Link from "next/link";
import "@/app/globals.css";
import Image from "next/image"

export default function Footer() {
	return (
		<div className="flex bg-(--moss-green) border-t-2 border-(--liver) w-full h-18 font-display mt-auto">
			<div className="w-1/3 self-end pb-1 pl-1"><p>© 2025 Nova Byte</p></div>
			<Link target="_blank" href="https://novabyte-cs4800-group-2.github.io/NovaByte-website/" className="flex justify-center items-center w-1/3 bg-(--sage)">
				<Image src="/logo-transparent-svg.svg" alt="The Nova Byte Logo" width={300} height={81}></Image>
			</Link>
			<div className="w-1/3 justify-end flex m-auto pr-5"><Link href="/" className="button text-(--liver)">Contact Us</Link></div>
		</div>
	);
}