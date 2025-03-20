import Link from "next/link";
import "@/app/globals.css";

export default function Subforumbar() {
  return (
    <div className="fixed right-0 top-18 h-[calc(100vh-4.5rem)] w-60 bg-[--moss-green] flex flex-col lg:text-xl md:text-lg sm:text-md font-bold z-50">
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">General</Link>
		<Link href="" className="bg-(--sage) border-(--moss-green) p-5 border-2 text-center border-b-1 hover:bg-(--moss-green)">Example 1</Link>
	</div>
  );
}