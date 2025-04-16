"use client"

export default function Dashboard() {
	return (
		<>

		</>
	);
}

// "use client";

// import {
//   HandThumbDownIcon,
//   HandThumbUpIcon,
// } from "@heroicons/react/24/outline";
// import {
//   HandThumbDownIcon as DownFilled,
//   HandThumbUpIcon as UpFilled,
// } from "@heroicons/react/24/solid";
// import { useEffect, useState } from "react";

// interface VoteProps {
//   contentId: number;
//   userId: number;
// }

// export default function Vote({ contentId, userId }: VoteProps) {
//   const [upvotes, setUpvotes] = useState(0);
//   const [downvotes, setDownvotes] = useState(0);
//   const [userVote, setUserVote] = useState<number | null>(null); // 1 (up), -1 (down), or null

//   useEffect(() => {
//     // Get total upvotes/downvotes
//     const fetchVotes = async () => {
//       try {
//         const [up, down, user] = await Promise.all([
//           fetch(`http://localhost:8080/content/up/votes/${contentId}`).then((res) => res.json()),
//           fetch(`http://localhost:8080/content/down/votes/${contentId}`).then((res) =>
//             res.json()
//           ),
//           fetch(`http://localhost:8080/single/vote/${contentId}/${userId}`).then((res) =>
//             res.ok ? res.json() : { vote: null }
//           ),
//         ]);

//         setUpvotes(up.amount || 0);
//         setDownvotes(down.amount || 0);

//         if (user.vote?.value === 1) setUserVote(1);
//         else if (user.vote?.value === -1) setUserVote(-1);
//       } catch (error) {
//         console.error("Failed to load votes:", error);
//       }
//     };

//     fetchVotes();
//   }, [contentId, userId]);

//   const handleVote = async (value: number) => {
//     if (userVote === value) {
//       // Remove vote
//       await fetch(`http://localhost:8080/remove/vote/${contentId}/${userId}`, {
//         method: "DELETE",
//       });

//       setUserVote(null);
//       if (value === 1) setUpvotes((prev) => prev - 1);
//       else setDownvotes((prev) => prev - 1);
//     } else {
//       // Send vote
//       await fetch("http://localhost:8080/vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content_id: contentId,
//           user_id: userId,
//           value,
//         }),
//       });

//       if (userVote === 1) setUpvotes((prev) => prev - 1);
//       if (userVote === -1) setDownvotes((prev) => prev - 1);

//       if (value === 1) setUpvotes((prev) => prev + 1);
//       else setDownvotes((prev) => prev + 1);

//       setUserVote(value);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       {userVote === 1 ? (
//         <UpFilled
//           className="w-5 h-5 text-emerald-700 cursor-pointer"
//           onClick={() => handleVote(1)}
//         />
//       ) : (
//         <HandThumbUpIcon
//           className="w-5 h-5 text-gray-500 hover:text-emerald-700 cursor-pointer"
//           onClick={() => handleVote(1)}
//         />
//       )}

//       <span className="text-sm font-medium text-gray-700">
//         {upvotes - downvotes}
//       </span>

//       {userVote === -1 ? (
//         <DownFilled
//           className="w-5 h-5 text-red-800 cursor-pointer"
//           onClick={() => handleVote(-1)}
//         />
//       ) : (
//         <HandThumbDownIcon
//           className="w-5 h-5 text-gray-500 hover:text-red-800 cursor-pointer"
//           onClick={() => handleVote(-1)}
//         />
//       )}
//     </div>
//   );
// }
