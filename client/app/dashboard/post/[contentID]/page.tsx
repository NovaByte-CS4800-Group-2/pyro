import PostClientPage from "./postClientPage";

interface Props {
  params: { content_id: string };
}

export default async function SharedPostPage({ params }: Props) {
  const { content_id } = await params
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 overflow-y-auto max-h-[90vh]">
        <PostClientPage contentID={content_id} />
      </div>
    </div>
  );
}
