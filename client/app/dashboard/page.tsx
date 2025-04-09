// app/dashboard/page.tsx
"use client";

import Subforumbar from "../ui/subforumbar";
import Forum from "../ui/forum";

export default function Dashboard() {
  return (
    <>
      <div className="bg-[--greige-mist] flex-grow min-h-full pl-2 pr-2">
        <div className="gap-y-5 flex flex-col items-stretch pt-10 m-auto w-auto self-center max-w-[700px]">
          <Forum subforumID="1" />
        </div>
      </div>
			<Subforumbar />
    </>
  );
}
