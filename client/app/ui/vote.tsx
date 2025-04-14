"use client";

import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbDownIcon as DownFilled,
  HandThumbUpIcon as UpFilled,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface VoteProps {
  contentId: number;
  userId: number;
}

export default function Vote({ contentId, userId }: VoteProps) {
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState<number | null>(null); // 1 = upvote, 0 = downvote, null = no vote

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res1 = await fetch(`http://localhost:8080/content/total/votes/${contentId}`)  // fetch upvotes - downvotes
        const data1 = await res1.json();
        setTotalVotes(data1.totalVotes);  // set the total votes

        if (userId) {
          const res2 = await fetch(`http://localhost:8080/single/vote/${contentId}/${userId}`)  // fetch whether or not user has voted on content
          const data2 = await res2.json();
          setUserVote(data2.vote);  // set vote state
        }
      } catch (error) {
        console.error("Failed to load votes:", error);
      }
    };
    fetchVotes();
  }, [contentId, userId]);

  const handleVote = async (value: number) => {
    if (!userId) return;

    if (userVote === value) { // same icon was clicked, remove vote
      await fetch(`http://localhost:8080/remove/vote/${contentId}/${userId}`, {
        method: "DELETE",
      });

      setUserVote(null);  // vote was removed, rest value
      if (value === 1) setTotalVotes((prev) => prev - 1);  // update total
      else setTotalVotes((prev) => prev + 1);
    } else {  // send vote

      await fetch("http://localhost:8080/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: contentId,
          user_id: userId,
          value,
        }),
      });

      if(userVote != null)  // updated existing vote for post
      {
        if (value === 1) setTotalVotes((prev) => prev + 2);
        else setTotalVotes((prev) => prev - 2);
      }
      else  // new vote
      {
        if (value === 1) setTotalVotes((prev) => prev + 1);
        else setTotalVotes((prev) => prev - 1);
      }
      setUserVote(value);
    }
  };

  return ( // display vote total and iconsfilled if theres a vote, outline otherwise
    <div className="flex flex-col items-start space-y-1">
      {userId ? (
        <div className="flex items-center space-x-2">
          {userVote === 1 ? (

            // upvotes ,filled if theres a vote, outline otherwise
            <UpFilled
              className="w-5 h-5 text-emerald-700 cursor-pointer"
              onClick={() => handleVote(1)}
            />
          ) : (
            <HandThumbUpIcon
              className="w-5 h-5 text-gray-500 hover:text-emerald-700 cursor-pointer"
              onClick={() => handleVote(1)}
            />
          )}

          <span className="text-sm font-medium text-gray-700">
            {totalVotes}
          </span>

                {/* down votes */}
          {userVote === 0 ? (
            <DownFilled
              className="w-5 h-5 text-red-800 cursor-pointer"
              onClick={() => handleVote(0)}
            />
          ) : (
            <HandThumbDownIcon
              className="w-5 h-5 text-gray-500 hover:text-red-800 cursor-pointer"
              onClick={() => handleVote(0)}
            />
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 italic">Please log in/register to interact with post.</p>
        </>
      )}
    </div>
  );
}
