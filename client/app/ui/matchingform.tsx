import "@/app/globals.css"
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/input";
import { Button, Checkbox, Form, NumberInput } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

interface MatchingFormProps {
	// Define the props for the MatchingForm component
	type?: number;
}

// Type refers to offering or receiving. Offering is designated as 1, receiving is designated as 0.
const MatchingForm: React.FC<MatchingFormProps> = ({ type }) => {

	const [zipcode, setZipcode] = useState("");
	const router = useRouter();
	const [user] = useAuthState(auth);

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
		data.type = type ? "offering" : "receiving" ;
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
		console.log(body)
		const form_id = body.id;

		// Look for a matching form.
		const resMatch = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/match/${form_id}/${data.type}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(resMatch);
		if (!resMatch.ok)  {
			alert("Server Error: Matching could not be performed.");
		}
		else if (resMatch.status == 204)	{
			router.push("/dashboard/matching/submission");
			return;
		}

	}

	const descriptionEnding = type ? "you are willing to host." : "in your party.";
	
	// Return the matching form component.
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
			<NumberInput name="num_people" classNames={{innerWrapper: "mt-2"}} className="max-w-72" label="Number of Guests" description={"The total number of people " + descriptionEnding} placeholder="Enter a number" isRequired minValue={1} maxValue={99}></NumberInput>
			{/* List of Characteristics */}
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
	</div>
	);
}

export default MatchingForm;