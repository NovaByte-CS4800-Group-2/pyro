"use client";

import Subforumbar from "../ui/subforumbar";
import Forum from "../ui/forum";

export default function Dashboard() {
  return (
    <>
      <div className="bg-neutral-200 flex-grow min-h-full pl-2 pr-2">
        <div className="gap-y-5 flex flex-col items-stretch pt-10 pb-8 m-auto w-auto self-center max-w-175">
          <p className="font-bold text-center">
            This is the start of the general forum! You made it!
          </p>
          <Forum subforumID="1" />
        </div>
      </div>
      <Subforumbar />
    </>
  );
}
