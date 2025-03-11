import Link from "next/link"
import "@/app/globals.css"

export default function Button({ label = "Button", link = "/", color = "(--liver)", bg = "(--sage)" , hover = "(--moss-green)" }) {
	return <Link href={link} className={"font-display rounded-lg p-0.5 pl-2 pr-2 w-fit h-fit hover:bg-" + hover + " bg-" + bg + " text-" + color}>{label}</Link>;
}