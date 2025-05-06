// app/dashboard/page.tsx
"use client";

import Subforumbar from "../ui/subforumbar";
import Forum from "../ui/forum";

export default function Dashboard() {
  return (
    <div className="flex flex-grow min-h-full bg-[--greige-mist] pt-6 pb-20">
      <main className="flex-grow px-4">
        <Forum subforumID="1" />
      </main>

      {/* Right sidebar only */}
      <aside className="min-w-[200px] mr-4">
        <Subforumbar />
      </aside>
    </div>
  );
}
