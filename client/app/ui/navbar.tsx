import Link from "next/link";
import "@/app/globals.css";

export default function Navbar() {
  return (
    <div className="flex flex-col bg-(--moss-green) lg:text-xl md:text-lg sm:text-md font-bold">
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">Forum</Link>
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">Fundraisers</Link>
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">Resources</Link>
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center hover:bg-(--moss-green)">Matching Requests</Link>
	</div>
  );
}
