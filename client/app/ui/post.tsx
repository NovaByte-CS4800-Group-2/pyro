import "@/app/globals.css";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { MouseEventHandler } from "react";

export default function Post({ key = -1, username = "Default User", date = "", editeddate = "", body = "",}) {
	let newDate = date.replace("T07:00:00.000Z", "");
	let newEditDate;
	if (editeddate == "null")
		newEditDate = "";
	else
		newEditDate = editeddate.replace("T07:00:00.000Z", "");
	return (
    <div key={key} className="bg-neutral-50 flex text-center ml-2 mr-2 rounded-md overflow-clip shadow-md max-w-175">
		<div className="flex gap-1 flex-col bg-neutral-300 p-2 font-bold text-sm max-w-20">
			<p className="line-clamp-1 hover:line-clamp-none">{username}</p>
			<div className="bg-neutral-50 rounded-4xl w-15 h-15"></div>
			<div className="flex justify-center">
				<HandThumbUpIcon className="w-1/3 hover:text-green-800"></HandThumbUpIcon>
				<HandThumbDownIcon className="w-1/3 hover:text-red-900"></HandThumbDownIcon>
			</div>
		</div>
		<div className="flex flex-col flex-grow text-xs">
			<div className=" bg-neutral-300 flex justify-between pl-1 pr-1">
				<p>Posted: {newDate}</p>
				<p>{newEditDate != "" ? "Last Edited: " : ""}{newEditDate}</p>
			</div>
			<div className="overflow-auto p-1 pt-0.5 pb-0.5 text-start md:text-lg sm:text-sm">
				{body}
			</div>
		</div>
	</div>
  );
}
