// app/dashboard/page.tsx
"use client";

import Subforumbar from "../ui/subforumbar";
import Forum from "../ui/forum";

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row flex-grow min-h-full bg-[--greige-mist] px-2 pt-6 pb-20">
      {/* Left Sidebar: Navbar is handled globally in layout */}

      {/* Center: Forum Content */}
      <main className="flex-grow w-full max-w-[900px] mx-auto">
        {/* Mobile: Subforum dropdown */}
        <div className="block lg:hidden mb-6">
          <Subforumbar mobile />
        </div>

        {/* Forum content */}
        <Forum subforumID="1" />
      </main>

      {/* Right Sidebar: Subforums (desktop only) - STICKY */}
      <aside className="hidden lg:block w-[200px] mr-4 sticky top-[100px] h-fit">
        <Subforumbar />
      </aside>
    </div>
  );
}

