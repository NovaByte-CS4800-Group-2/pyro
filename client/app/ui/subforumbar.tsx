import Link from "next/link";
import "@/app/globals.css";

export default function Subforumbar() {
  return (
    <div className="flex flex-col min-w-1/6 bg-(--moss-green) lg:text-xl md:text-lg sm:text-md font-bold">
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">General</Link>
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">Example 1</Link>
	</div>
  );
}