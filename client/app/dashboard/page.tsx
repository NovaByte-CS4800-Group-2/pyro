'use client'

import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session, status } = useSession({
		required: true,
	});
	return (
		<>
			<div className="flex flex-col items-center mt-10">
				<p className="font-bold">This is the dashboard! You made it!</p>
			</div>
		</>
	);
}
