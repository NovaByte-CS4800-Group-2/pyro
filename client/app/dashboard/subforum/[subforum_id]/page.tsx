import Forum from "@/app/ui/forum";
import Subforumbar from "../../../ui/subforumbar";

// define the expected props shape for this page
interface Props {
  params: {
    subforum_id: string;
  };
}

// this is the dynamic page component for a given subforum ID
export default async function SubforumPage(props: Props) {
  // await the `params` object before using its properties
  const { subforum_id } = props.params;

  return (
    <>
      <div className="bg-[--greige-mist] flex-grow min-h-full pl-2 pr-2">
        <div className="gap-y-5 flex flex-col items-stretch pt-10 pb-8 m-auto w-auto self-center max-w-[900px]">
          <Forum subforumID={subforum_id} />
        </div>
      </div>
      <Subforumbar />
    </>
  );
}

// this function tells Next.js which `subforum_id`s to statically pre-render
/*export async function generateStaticParams() {
  return [
    { subforum_id: "1" },
    { subforum_id: "2" },
    { subforum_id: "3" },
    { subforum_id: "4" },
    { subforum_id: "5" },
    { subforum_id: "6" },
  ];
}*/
