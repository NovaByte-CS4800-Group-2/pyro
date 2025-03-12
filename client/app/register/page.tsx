import Link from "next/link";
import RegisterForm from "../ui/register-form";


export default function Register() {
	return (
		<>
		  <div className="m-10 ml-30 mr-30 text-center flex flex-col">
			<h1 className="text-3xl font-display pb-2 font-bold">Create New Account</h1>
			<h2 className="text-l font-display">Already Registered? <Link href="/log-in" className="font-semibold hover:underline">Log in</Link></h2>
			<RegisterForm />
		  </div>
		</>
  	);
}
