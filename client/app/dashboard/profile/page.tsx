"use client"

import {Avatar} from "@heroui/avatar";
import {Card, CardHeader, CardBody, Image} from "@heroui/react";
import React from "react";

export default function Profile() {
	return (
		<div className="flex flex-col align-center w-full">
			<Card shadow="sm" isPressable className="data-hover:bg-amber-400 py-4 border-2 rounded-3xl w-fit h-fit">
				<CardHeader className="py-2 px-6 flex-col items-start max-w-60">
					<h3 className="font-bold text-3xl line-clamp-1 hover:line-clamp-none">Username</h3>
					<h4 className="text-md line-clamp-1 hover:line-clamp-none">Name</h4>
				</CardHeader>
				<CardBody className="pt-2">
					<Avatar isBordered color="primary" size="lg"></Avatar>
				</CardBody>
			</Card>
		</div>
	);
}