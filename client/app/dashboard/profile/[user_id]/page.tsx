"use client"

import { app } from "@/app/firebase/config";
import Forum from "@/app/ui/forum";
import { Avatar, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the expected props shape for this page
interface Props {
  params: { user_id: string };
}

// This is the dynamic page component for a given userID
export default function ProfilePage({ params }: Props) {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [profileURL, setProfileURL] = useState("");

  const storage = getStorage(app); // Initialize Firebase storage
  const router = useRouter();

  useEffect(() => {
    // Load user profile information
    const loadProfile = async () => {
      console.log("Params", params);
      let user_id = await params.user_id;
      setUserID(user_id);
      if (!user_id) {
        router.push("/dashboard");
        return;
      } else {
        const storageRef = ref(storage, "profilePics/" + user_id);
        try {
          const url = await getDownloadURL(storageRef);  // Get the download URL for the profile picture
          setProfileURL(url);  // Set the profile picture URL
        } catch (e) {
          // Do Nothing if error occurs
        }

        const resUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log(resUser);
        if (resUser.ok) {
          const responseData = await resUser.json();
          const { username } = responseData;
          setUsername(username);
        }
      }
    };
    loadProfile();
  }, []);

  return (
      <div className="flex-grow flex max-lg:flex-col m-6 gap-y-10 gap-x-10">
        <Card className="shadow-lg p-4 border-2 rounded-3xl h-fit">
          <CardHeader className="pt-2 flex flex-col items-center">
            <Avatar className="w-40 h-40" isBordered color="primary" src={profileURL} />
            <h3 className="font-bold text-3xl pt-2 line-clamp-1 hover:line-clamp-none">{username}</h3>
          </CardHeader>
        </Card>
        <Card className="shadow-lg p-4 border-2 rounded-3xl h-fit flex-grow">
          <CardBody>
            <Tabs>
              <Tab key="posts" title="Posts">
                <Forum userID={userID}></Forum>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
  );
}