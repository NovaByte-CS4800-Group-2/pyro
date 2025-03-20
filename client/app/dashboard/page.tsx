'use client'

import Post from "../ui/post";
import Subforumbar from "../ui/subforumbar";

export default function Dashboard() {
	
	const getContent = async (subforumID: number) => {
		const response = await fetch("http://localhost:8080/content", {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify(subforumID),
		});

		let html = <></>;
		if (response.ok) {
			const contentData = await response.json();
			contentData.forEach(() => {

			});
		} else if (response.status == 404) {

		}
	}

	
	return (
	<>
		<div className="bg-neutral-200 flex flex-col items-stretch pt-10 min-h-full flex-grow">
			<p className="font-bold text-center">This is the dashboard! You made it!</p>
			<Post username="The Prof" date="3/19/20" editedDate="3/19/25" body="I have two dogs. Their names are Tate and Buffy."/>
		</div>
		<Subforumbar></Subforumbar>
	</>
  );
}