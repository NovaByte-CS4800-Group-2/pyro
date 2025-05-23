"use client";

import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";  // Importing outline icons from Heroicons
import {
  HandThumbDownIcon as DownFilled,
  HandThumbUpIcon as UpFilled,
} from "@heroicons/react/24/solid"; // Importing filled icons from Heroicons
import { useEffect, useState } from "react"; // Importing React hooks

interface VoteProps { // Defining the props for the Vote component
  contentId: number;
  userId: string;
  username: string;
  isSharedPost?: boolean;
}

export default function Vote({ contentId, userId, username, isSharedPost = false }: VoteProps) { // Defining the Vote component
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState<number | null>(null); // 1 = upvote, 0 = downvote, null = no vote

  useEffect(() => {
    const fetchVotes = async () => { 
      try {
        const res1 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/content/total/votes/${contentId}`)  // fetch upvotes - downvotes
        const data1 = await res1.json();
        setTotalVotes(data1.totalVotes);  // set the total votes

        if (userId) {
          const res2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/single/vote/${contentId}/${userId}`)  // fetch whether or not user has voted on content
          const data2 = await res2.json();
          setUserVote(data2.vote);  // set vote state
        }
      } catch (error) {
        console.error("Failed to load votes:", error);
      }
    };
    fetchVotes();
  }, [contentId, userId, isSharedPost]); 

  const handleVote = async (value: number) => { // function to handle vote
    if (!userId || isSharedPost) return; // prevent voting on shared posts
    if (userVote === value) {  // same icon was clicked, remove vote

      // remove vote from database
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove/vote/${contentId}/${userId}`, {
        method: "DELETE",
      });

      // remove notification from database
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove/notification/${contentId}/${"vote"}`, {
        method: "DELETE",
      });
      
      setUserVote(null);  // vote was removed, rest value
      if (value === 1) setTotalVotes((prev) => prev - 1);  // update total
      else setTotalVotes((prev) => prev + 1);
    } else {  // send vote

      // send vote to database
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: contentId, 
          user_id: userId,
          value,
        }),
      });
      console.log(userVote);
      if(userVote !== 0 && userVote !== 1) // send notification to database
      {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/vote/notification`, {  
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_id: contentId,
            user_id: userId,
          }),
        })
      }

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
        <div className={`flex items-center space-x-2 ${isSharedPost ? "opacity-40 pointer-events-none" : ""}`}>
          {userVote === 1 ? (
  
            // upvotes ,filled if theres a vote, outline otherwise
            <UpFilled
              className="w-5 h-5 text-[--deep-moss] cursor-pointer"
              onClick={() => handleVote(1)}
            />
          ) : (
            <HandThumbUpIcon
              className="w-5 h-5 text-[--deep-moss] hover:text-[--deep-moss] cursor-pointer"
              onClick={() => handleVote(1)}
            />
          )}
  
          <span className="text-sm font-medium text-[--text-color]">
            {totalVotes}
          </span>
  
          {/* down votes */}
          {userVote === 0 ? (
            <DownFilled
              className="w-5 h-5 text-[--deep-terracotta] cursor-pointer"
              onClick={() => handleVote(0)}
            />
          ) : (
            <HandThumbDownIcon
              className="w-5 h-5 text-[--deep-terracotta] hover:text-[--deep-terracotta] cursor-pointer"
              onClick={() => handleVote(0)}
            />
          )}
        </div>
      ) : (
        // show message if not logged in
        <p className="text-xs text-[--ash-olive] italic">
          Please log in/register to interact with post.
        </p>
      )}
    </div>
  );
}
