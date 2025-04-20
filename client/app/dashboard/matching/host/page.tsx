"use client"

import MatchingForm from "@/app/ui/matchingform";

export default function Host() {

	return (
		<div className="w-full h-full flex flex-col items-center">
			<MatchingForm type={1}></MatchingForm>
		</div>
	);
}