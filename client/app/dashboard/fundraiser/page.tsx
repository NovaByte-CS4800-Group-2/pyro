"use client"

import Forum from "../../ui/forum";

export default function Fundraiser() {
	return (
		<>
			<div className="bg-[--greige-mist] flex-grow min-h-full pl-2 pr-2">
				<div className="gap-y-5 flex flex-col items-stretch pt-10 pb-8 m-auto w-auto self-center max-w-[1000px]">
					<Forum subforumID="0" />
				</div>
			</div>
		</>
	);
}