import PostClientPage from "./postClientPage"; // this is a client-side wrapper

export async function generateStaticParams() {
  // fallback to just one ID so it builds
  return [
    { contentID: "5" },
    { contentID: "7" }];
}

interface Props {
  params: { contentID: string };
}

export default function SharedPostPage({ params }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 overflow-y-auto max-h-[90vh]">
        <PostClientPage contentID={params.contentID} />
      </div>
    </div>
  );
}
