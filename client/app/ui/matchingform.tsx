import "@/app/globals.css"
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/input";
import { Button, Checkbox, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, useDisclosure } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import React from "react";

interface MatchingFormProps {
	// Define the props for the MatchingForm component
	type?: number;
	found_matches?: any[];
	form_id?: number;
}

// Type refers to offering or requesting offering is designated as 1, requesting is designated as 0.
const MatchingForm: React.FC<MatchingFormProps> = ({ type, found_matches, form_id }) => {

	const [zipcode, setZipcode] = useState("");
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [formID, setFormID] = useState(0);
	const [error, setError] = useState("");
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [matches, setMatches] = useState<any[]>([]);
	const [showMatches, setShowMatches] = useState(false);

	useEffect(() => {
		if (found_matches) {
			setFormID(form_id || 0);
			setMatches(found_matches);
			setShowMatches(true);
		}
	}, []); 

	// Function to strip all non numeric characters from the zipcode string.
	const validateZipcode = (e: ChangeEvent<HTMLInputElement>) => {
		setZipcode(e.target.value.replace(/\D/g, ""));
	}

	const submitForm = async (e: FormEvent<HTMLFormElement>) => {
		// Prevent form submit default action.
		e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
		if (data.terms !== "1") {
			document.getElementById("terms")?.focus();
			return;
		}
		for (let key in data) {
			if (data[key] === "") {
				data[key] = "0";
			}
		}
		data.user_id = user?.uid || "";
		data.type = type ? "offering" : "requesting" ;
		data.email = user?.email || "";
		data.zipcode = zipcode;
		// Check if a user requesting housing has made an error in the number of people in their party.
		if (!type) {
			const youngerChildren = Number(data["young_children"]) + Number(data["adolescent_children"]);
			const totalPeople = youngerChildren + Number(data["teenage_children"]) + Number(data["elderly"]);
			if (totalPeople > Number(data["num_people"])) {
				setError("! The number of people in the selections below should not exceed the total number of guests given above. Please alter your response and resubmit !");
				document.getElementById("hosting-form-title")?.scrollIntoView();
				document.getElementById("num-people")?.focus();
				return;
			} else if (Number(data["num_people"]) === youngerChildren) {
				setError("! The number of young and adolescent children in the selections below should not equal the total number of guests given above. Please alter your response and resubmit !");
				document.getElementById("hosting-form-title")?.scrollIntoView();
				document.getElementById("num-people")?.focus();
				return;
			}

		}
		// Create the form.
		const resCreate = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create/matching/form`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data), // Send the form in the request body.
		});
		if (!resCreate.ok) {
			alert("Unable to create form. Please try again later.");
			return;
		}
		const body = await resCreate.json();
		setFormID(body.id);

		// Look for a matching form.
		const resMatch = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/match/${body.id}/${data.type}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(resMatch);
		if (!resMatch.ok)  {
			alert("Server Error: Matching could not be performed.");
			return;
		}
		else if (resMatch.status == 204)	{
			router.push("/dashboard/matching/submission");
			return;
		} else {
			const responseData = await resMatch.json();
			const { matches } = responseData;
			setMatches(matches);
			onOpen();
			return;
		}
	}

	interface MatchProps {
		// Define the props for the MatchingForm component
		index: number,
		form_id: number,
		email: string,
		zipcode?: number,
		num_rooms?: number,
		num_people?: number,
		young_children?: number, 
		adolescent_children?: number, 
		teenage_children?: number,
		elderly?: number, 
		small_dog?: number, 
		large_dog?: number,
		cat?: number, 
		other_pets?: number,
	}
	
	const Match: React.FC<MatchProps> = ({ index, form_id, email, num_rooms, num_people, young_children, adolescent_children, 
		teenage_children, elderly, small_dog, large_dog, cat, other_pets }) => {

			const accept = async (e: FormEvent) => {
				e.preventDefault();
				const resUserForm = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/form/${formID}/`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				
				if (resUserForm.status == 204) {
					alert("Your form has already been matched by another user! Please see your notifications for more information.");
					router.push("/dashboard/matching")
					return;
				}
				const resMatchForm = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/form/${form_id}/`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});		
				
				if (resMatchForm.status == 204) {
					if (matches.length === 1) {
						alert("Sorry, this form has already been matched by another user. You will receive a notification when another match is found.")
						router.push("/dashboard/matching");
						return;
					} else {
						alert("Sorry, this form has already been matched by another user. Please select another one.")
						matches[index] = matches[-1];
						matches.pop();
						return;
					}
				}

				let body = {content_id: formID, email: email };
				console.log(body);
				const resNotification = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/matching/notification/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				});	

				body = {content_id: form_id, email: user?.email || ""};
				console.log(body);
				if (!resNotification.ok) {
					alert("SYSTEM ERROR: Form matching not completed (notification not sent), please try again.");
					return;
				}
				const resNotification2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/matching/notification/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				});	

				if (!resNotification2.ok) {
					alert("SYSTEM ERROR: Form matching not completed (notification not sent), please try again.");
					return;
				}

				const resDelete = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/matched/forms/${formID}/${form_id}/`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				});	

				if (!resDelete.ok) {
					alert("SYSTEM ERROR: Form may have been deleted :(");
					router.push("/dashboard/matching");
					return;
				}
				router.push("/dashboard/matching/success");
			};

			return (
				<div key={index} className="rounded-lg border-1 border-neutral-300 py-3 px-10 flex flex-col items-center shadow-md">
					<h2 className="text-2xl font-semibold mb-2">Match {index}</h2>
					<div className="flex flex-col self-start w-56 gap-y-0.5">
						<div className="flex">
							<p>Bedrooms:</p>
							<p className="ml-auto">{num_rooms}</p>
						</div>
						<div className="flex">
							<p>Guests:</p>
							<p className="ml-auto">{num_people}</p>
						</div>
						<div className="flex">
							<p>Young Children (0-7):</p>
							<p className="ml-auto">{young_children}</p>
						</div>
						<div className="flex">
							<p>Adolescent Children (8-13):</p>
							<p className="ml-auto">{adolescent_children}</p>
						</div>
						<div className="flex">
							<p>Teenage Children (14-19):</p>
							<p className="ml-auto">{teenage_children}</p>
						</div>
						<div className="flex">
							<p>Elderly:</p>
							<p className="ml-auto">{elderly}</p>
						</div>
						<div className="flex">
							<p>Small Dogs:</p>
							<p className="ml-auto">{small_dog}</p>
						</div>
						<div className="flex">
							<p>Large Dogs:</p>
							<p className="ml-auto">{large_dog}</p>
						</div>
						<div className="flex">
							<p>Cats:</p>
							<p className="ml-auto">{cat}</p>
						</div>
						<div className="flex">
							<p>Other Pets:</p>
							<p className="ml-auto">{other_pets}</p>
						</div>
					</div>
					<Form onSubmit={accept}>
						<Button type="submit" color="primary" className="font-bold mt-3 px-8">Accept</Button>
					</Form>
				</div>
			);
	}

	const descriptionEnding = type ? "you are willing to host." : "in your party.";
	
	// Return the matching form component.
	if (showMatches) {
		return (
			<div className="flex flex-wrap items-center gap-x-4 gap-y-4 m-10">
				{matches.map((match, index) => {
					match.index = index + 1;
					return React.createElement(Match, match);
				})}
			</div>
		);
	} else {
		return (
			<div className="rounded-lg border-1 border-neutral-300 py-5 px-10 m-10 flex flex-col items-center shadow-md">
				<Link href="/dashboard/matching" className="flex gap-x-1 items-center self-start mb-2"><ArrowUturnLeftIcon width={18} height={18}></ArrowUturnLeftIcon> Back</Link>
				{/* Main Form Component */}
				<Form autoComplete="off" aria-labelledby="hosting-form-title" onSubmit={submitForm} className="flex flex-col items-center">
					{/* Informational Components */}
					<h2 id="hosting-form-title" className="text-4xl mb-4">{type ? "Hosting" : "Housing"} Form</h2>
					<p className="max-w-lg text-center">{type ? "Thank you for providing support for those in need!" : "Looking for temporary housing provided by the Pyro community?"} Please fill out the fields below and we will contact you when a match has been found.</p>
					<p className="text-sm mb-4">Fields marked with a red asterisk <span className="text-red-500">*</span> are required.</p>
					{/* General Fields */}
					<Input name="zipcode" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Zipcode" type="text" description={type ? "The zipcode of your hosting address." : "The zipcode of your current location."} placeholder="12345" value={zipcode} onChange={validateZipcode} isRequired isClearable minLength={5} maxLength={5}></Input>
					<NumberInput name="num_rooms" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Number of Bedrooms" description={"The " + (type ? "" : "minimum") + " number of bedrooms " + (type ? "available for your guest(s)." : "required.")} placeholder="Enter a number" isRequired minValue={1} maxValue={99}></NumberInput>
					<NumberInput id="num-people" name="num_people" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Number of Guests" description={"The total number of people " + descriptionEnding} placeholder="Enter a number" isRequired minValue={1} maxValue={99}></NumberInput>
					{/* List of Characteristics */}
					<p className="text-red-500 text-sm text-center max-w-lg">{error}</p>
					<p className="max-w-lg font-semibold"> For the following section please provide the number of each {type ? "that you are willing to host" : "in your party"}:</p>
					<NumberInput name="young_children" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Young Children" description={"The number of young children (0-7) " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="adolescent_children" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Adolescent Children" description={"The number of adolescent children (8-13) " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="teenage_children" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Teenage Children" description={"The number of teenage children (14-19) " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="elderly" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Elderly" description={"The number of elderly people " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="small_dog" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Small Dogs" description={"The number of small dogs " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="large_dog" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Large Dogs" description={"The number of large dogs " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="cat" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Cats" description={"The number of cats " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					<NumberInput name="other_pets" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Other Pets" description={"The number of other pets " + descriptionEnding} placeholder="Enter a number" minValue={0} maxValue={99}></NumberInput>
					
					{/* Term Checkbox */}
					<h3 className="font-semibold">Terms and Conditions</h3>
					<p className="max-w-lg mb-2">I agree to let Nova Byte share my email with a user {type ? "in need of housing" : "providing housing"} whose attributes match those that I have listed. I agree to not hold Nova Byte liable for any actions taken by said user with my email address or at the hosting address. I understand that I am allowed to pull this application at any time, in which case my email will no longer be shared with other users until the time that I file another application.</p>
					<Checkbox id="terms" name="terms" value="1" className="max-w-lg" isRequired><span className="text-red-500">*</span> I acknowledge that I have read and understand the terms and conditions above.</Checkbox>
					<Button type="submit" className="bg-[--ash-olive] text-[--bark] font-semibold">Submit</Button>
				</Form>
				<Modal size="sm" hideCloseButton={true} isDismissable={false} isKeyboardDismissDisabled={true} isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Match Made!</ModalHeader>
								<ModalBody>
									<p> We've found {matches.length > 1 ? "matches" : "a match"} for your application! </p>
									<p> Click the button below to proceed to the {matches.length > 1 ? "selection" : "confirmation"} page! </p>
								</ModalBody>
								<ModalFooter>
								<Button color="primary" onPress={() => {onClose(); setShowMatches(true)}}>
									Take me there!
								</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</div>
		);
	}
}

export default MatchingForm;