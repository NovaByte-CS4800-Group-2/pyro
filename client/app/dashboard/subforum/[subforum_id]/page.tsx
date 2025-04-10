import Forum from "@/app/ui/forum";

import Subforumbar from "../../../ui/subforumbar";

type Props = {
  params: { subforum_id: string };
};

export default function SubforumPage({ params }: Props) {
  return (
    <>
      <div className="bg-[--greige-mist] flex-grow min-h-full pl-2 pr-2">
        <div className="gap-y-5 flex flex-col items-stretch pt-10 pb-8 m-auto w-auto self-center max-w-[900px]">
          <Forum subforumID={params.subforum_id} />
        </div>
      </div>
			<Subforumbar />
    </>
  );

}

export async function generateStaticParams() {
  return [
    { subforum_id: "1" },
    { subforum_id: "2" },
    { subforum_id: "3" },
    { subforum_id: "4" },
    { subforum_id: "5" },
    { subforum_id: "6" }
  ];
}