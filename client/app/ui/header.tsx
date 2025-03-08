import { FireIcon } from "@heroicons/react/24/outline";


export default function Header() {
	return <div className="flex justify-center items-center bg-(--liver) border-b-2 border-neutral-800 w-full h-18 text-(--seashell) font-display">
	<FireIcon className="text-(--cocoa-brown) pt-2"
	  width={40}
	  height={40}
	/>
	<h1 className="text-4xl font-bold">Pyro</h1>
  </div>
}