import Forum from "@/app/ui/forum";
import Subforumbar from "../../../ui/subforumbar";

// define the expected props shape for this page
interface Props {
  params: {
    subforum_id: string;
  };
}

// this is the dynamic page component for a given subforum ID
export default function SubforumPage(props: Props) {
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