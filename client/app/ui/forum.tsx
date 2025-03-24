"use client";

import React, { useState, useEffect } from "react";
import parse, { DOMNode, Element } from "html-react-parser";
import Post from "./post";

interface ForumProps {
	subforumID?: string;
}

const Forum: React.FC<ForumProps> = ({ subforumID = "1" }) => {
	const [html, setHtml] = useState<string>("");

	const getUser = async (user_id: String) => {
		const fetchString = `http://localhost:8080/username/${user_id}`;

		const response = await fetch(fetchString, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const contentData = await response.json();
			const { username } = contentData;
			return `${username}`;
		} else {
			return "Default User";
		}
	}

	useEffect(() => {
		const fetchPosts = async () => {
			const fetchString = `http://localhost:8080/post/${subforumID}`;

			const response = await fetch(fetchString, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				setHtml('<p>Error loading posts :(</p>');
				return;
			}

			const contentData = await response.json();

			// Use map to handle async operations
			const posts = await Promise.all(
			contentData.posts.map(async (post: any, index: any) => {
				const { post_date, last_edit_date, body, user_id } = post;
				const username = await getUser(user_id);

				// Return the HTML content for each post
				return `<post key="${index}" username="${username}" date="${post_date}" editeddate="${last_edit_date}" body="${body}"></post>`;
			})
			);

			// Combine all post HTML content into one string
			setHtml(posts.join(""));
		};

		fetchPosts();
	}, [subforumID]);

	const parsedContent = parse(html, {
		transform: (reactNode: React.ReactNode, domNode: DOMNode) => {
			// Correctly type the domNode as Element
			if (
				domNode.type === "tag" &&
				(domNode as Element).name === "post"
			) {
				const attribs = (domNode as any).attribs || {};
				const { date, editeddate, body, username} = attribs;
				return (
					<Post username={username} date={date} editeddate={editeddate} body={body} />
				);
			}
		},
	});

	return <>{parsedContent || <p>No posts available</p>}</>;
};

export default Forum;
