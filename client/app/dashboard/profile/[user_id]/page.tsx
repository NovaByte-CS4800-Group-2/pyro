import { app } from "@/app/firebase/config";
import Forum from "@/app/ui/forum";
import { Avatar, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { redirect } from "next/navigation";

// define the expected props shape for this page
interface Props  {
	params: { user_id: string };
};

// this is the dynamic page component for a given user_id
export default function ProfilePage({ params }: Props) {

	// User info.
	let { user_id } = params;
	let username = "";
	let comments = [];
	let profileURL = "";

	const storage = getStorage(app); // Initialize Firebase storage

  	// Load user profile information.
	const loadProfile = async () => {
		if (!user_id) {
			redirect("/dashboard");
			return;
		}
		else {
			const storageRef = ref(storage, "profilePics/" + user_id); // Create a reference to the profile picture in Firebase storage
			getDownloadURL(storageRef) // Get the download URL for the profile picture
				.then((url) => {
				profileURL = url; // Set the profile picture URL in state
				})
				.catch((e) => {
				// Do Nothing
				});
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
	/*const loadComments = async () => {
		const resComments = await fetch(`http://localhost:8080/userComments/${user_id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (resComments.ok) {
			const { comments } = await resComments.json();
			setComments(comments);
		}
	}*/
	loadProfile();
	//loadComments();

  return (
    <>
      <div className="flex-grow flex max-lg:flex-col m-6 gap-y-10 gap-x-10">
			<Card className="shadow-lg p-4 border-2 rounded-3xl flex-grow h-fit">
				<CardHeader className="pt-2 flex flex-col items-center">
					<Avatar className="w-40 h-40" isBordered color="primary" src={profileURL}/>
					<h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">{username}</h3>
				</CardHeader>
			</Card>
			<Card className="shadow-lg p-4 border-2 rounded-3xl h-fit">
				<CardBody>
					<Tabs>
						<Tab key="posts" title="Posts">
							<Forum userID={user_id}></Forum>
						</Tab>
						{/*<Tab key="comments" title="Comments">
							{ comments.map((value, index) => {
								console.log(value, index);
								return (
									<Card>
										<CardBody>

										</CardBody>
									</Card>
								);
							}) }
						</Tab>*/}
					</Tabs>
				</CardBody>
			</Card>
		</div>
    </>
  );
}