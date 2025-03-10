import Link from "next/link";
import {loginUser} from "@/app/server_functions/functions"
import Form from "next/form";

export default function Login() {
  return (
	<>
	  <div className="mt-10 ml-30 mr-30 text-center flex flex-col">
		<h1 className="text-3xl font-display pb-2 font-bold">Log In</h1>
		<h2 className="text-l font-display">Don't have an account? <Link href="/register" className="font-semibold hover:underline">Sign Up</Link></h2>
	  	{/* TODO: Add URL to submit to (action) */}
		<Form action={loginUser} className="flex flex-col m-auto mt-8 font-normal">
		<label htmlFor="username" className="self-start">Username</label>
				<input id="username" type="text" className="border-(liver) border-2 mb-8 p-2"></input>
				<label htmlFor="password" className="self-start">Password</label>
				<input id="password" type="password" className="border-(liver) border-2 mb-8 p-2"></input>
			<Link href="/"><input className="button m-auto text-(--liver)" type="submit" value="Log In"></input></Link>
		</Form>
	  </div>
	</>
  );
}
