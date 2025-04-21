import { Button, Link } from "@heroui/react";

export default function Submission() {

	return (
		<div className="flex-grow flex flex-col items-center justify-center">
			<div className="flex flex-col gap-y-3 items-center max-w-[500px] shadow-md w-3/4 border-1 border-neutral-200 text-lg p-5 rounded-xl">
				<h2 className="font-semibold text-xl">Congrats!</h2>
				<p className="text-center mb-2">You have been matched successfully! We have sent your email address to your match so be on the lookout for an email from them!</p>
				<Button className="bg-[--bark] text-white text-medium" as={Link} href="/dashboard/matching">Return to matching page</Button>
			</div>
		</div>
	);
}