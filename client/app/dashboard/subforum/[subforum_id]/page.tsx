import Forum from "@/app/ui/forum";
import Subforumbar from "../../../ui/subforumbar";

// this is the dynamic page component for a given subforum ID
export default async function Subforum({ params, }: { params: Promise<{ subforum_id: string }> }) {
  const { subforum_id } = await params
  return (
    <div className="flex flex-grow min-h-full bg-[--greige-mist] pt-6 pb-20">
      <main className="flex-grow px-4">
        <Forum subforumID={subforum_id} />
      </main>

      {/* Right sidebar */}
      <aside className="min-w-[200px] mr-4">
        <Subforumbar />
      </aside>
    </div>
  );
}