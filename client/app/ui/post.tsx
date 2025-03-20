import "@/app/globals.css";

export default function Post({ userProfile = Blob, username = "", date = "", editedDate = "", body = "",}) {
  return (
    <div className="bg-neutral-50 flex text-center ml-2 mr-2 rounded-md overflow-clip">
		<div className="flex gap-1 flex-col bg-neutral-300 p-2 font-bold text-sm">
			<p>{username}</p>
			<div className="bg-neutral-50 rounded-4xl w-15 h-15"></div>
		</div>
		<div className="flex flex-col flex-grow text-xs">
			<div className=" bg-neutral-300 flex justify-between pl-1 pr-1">
				<p>Posted: {date}</p>
				<p>{editedDate != "" ? "Last Edited: " : ""}{editedDate}</p>
			</div>
			<div className="overflow-auto p-1 pt-0.5 pb-0.5 text-start md:text-lg sm:text-sm">
				{body}
			</div>
		</div>
	</div>
  );
}
