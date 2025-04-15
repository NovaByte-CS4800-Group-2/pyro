"use client"

import { Card, CardBody, Link } from "@heroui/react";

export default function Matching() {
	return (
		<div className="flex-grow flex">
			<Link className="max-h-[300px] h-full aspect-square m-10" href="/dashboard/matching/host">
				<Card className="h-full w-full">
					<CardBody>
						<div className="flex justify-center items-center h-full">
							<p className="text-3xl">Apply to Host</p>
						</div>
					</CardBody>
				</Card>
			</Link>
			<Link className="max-h-[300px] h-full aspect-square m-10" href="/dashboard/matching/housing">
				<Card className="h-full w-full">
					<CardBody>
						<div className="flex justify-center items-center h-full">
							<p className="text-3xl">Apply for Housing</p>
						</div>
					</CardBody>
				</Card>
			</Link>
			<div className="flex flex-col min-w-[200px] bg-stone-100 border-r border-stone-300 shadow-sm ml-auto">
				<h2 className="text-lg font-semibold px-4 py-3 text-neutral-800 border-b border-stone-200">
					Application Status
				</h2>
			</div>
		</div>
	);
}
