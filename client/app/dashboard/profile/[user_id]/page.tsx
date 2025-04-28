"use client";

import { app } from "@/app/firebase/config";
import Forum from "@/app/ui/forum";
import { Avatar, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import Comments from "../../../ui/comments"; // Import Comments component

// Define the expected props shape for this page
export default function Page({ params, }: { params: Promise<{ user_id: string }> }) {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [profileURL, setProfileURL] = useState("");

  const storage = getStorage(app); // Initialize Firebase storage

  useEffect(() => {
    const loadUserID = async () => {
      const { user_id } = await params;
      setUserID(user_id);
    }
    loadUserID();
  }, [])

  useEffect(() => {
    if (userID) {
      // Load user profile information
      const loadProfile = async () => {
        const storageRef = ref(storage, "profilePics/" + userID);
        try {
          const url = await getDownloadURL(storageRef); // Get the download URL for the profile picture
          setProfileURL(url); // Set the profile picture URL
        } catch (e) {
          console.error("Error loading profile image:", e);
        }

        const resUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${userID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (resUser.ok) {
          const responseData = await resUser.json();
          const { username } = responseData;
          setUsername(username); // Set the username
        }
      };
      loadProfile();
    }
  }, [userID]);

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
            <Tab key="comments" title="Comments">
              <Comments user_id={userID} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
