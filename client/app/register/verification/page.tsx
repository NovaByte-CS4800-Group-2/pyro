import { Button, Card, CardBody, Link } from "@heroui/react";

export default function Verification() {
	return (
		<div className="flex justify-center items-center flex-grow">
			<Card className="max-w-lg">
				<CardBody className="p-10 flex flex-col gap-y-8">
					<p className="text-lg">A verification email has been sent to the given email address. Please follow the link provided in the email to verify your account then proceed to the log in page!</p>
					<Button color="primary" as={Link} href="/log-in">Take me to log in!</Button>
				</CardBody>
			</Card>
		</div>	
	)
}