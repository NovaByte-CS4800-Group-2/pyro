import { app } from "@/app/firebase/config";
import Forum from "@/app/ui/forum";
import { Avatar, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { redirect } from "next/navigation";

// Define the expected props shape for this page
interface Props {
  params: { user_id: string };  // params should be an object, not a Promise
}

// This is the dynamic page component for a given userID
export default function ProfilePage({ params }: Props) {
  // Access user_id directly from params
  const { user_id } = params;

  let username = "";
  let profileURL = "";

  const storage = getStorage(app); // Initialize Firebase storage

  // Load user profile information
  const loadProfile = async () => {
    if (!user_id) {
      redirect("/dashboard");
      return;
    } else {
      const storageRef = ref(storage, "profilePics/" + user_id);
      try {
        const url = await getDownloadURL(storageRef);  // Get the download URL for the profile picture
        profileURL = url;  // Set the profile picture URL
      } catch (e) {
        // Do Nothing if error occurs
      }

      const resUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (resUser.ok) {
        const responseData = await resUser.json();
        const { retUsername } = responseData;
        username = retUsername;
      }
    }
  };

  loadProfile();

  return (
    <>
      <div className="flex-grow flex max-lg:flex-col m-6 gap-y-10 gap-x-10">
        <Card className="shadow-lg p-4 border-2 rounded-3xl flex-grow h-fit">
          <CardHeader className="pt-2 flex flex-col items-center">
            <Avatar className="w-40 h-40" isBordered color="primary" src={profileURL} />
            <h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">{username}</h3>
          </CardHeader>
        </Card>
        <Card className="shadow-lg p-4 border-2 rounded-3xl h-fit">
          <CardBody>
            <Tabs>
              <Tab key="posts" title="Posts">
                <Forum userID={user_id}></Forum>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
}