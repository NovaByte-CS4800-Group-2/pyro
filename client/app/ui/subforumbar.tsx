"use client";
import { useEffect, useState } from "react"; // Import React and hooks 
import { usePathname } from "next/navigation"; // Importing usePathname for getting the current path
import Link from "next/link"; // Importing Link for client-side navigation

type Subforum = { // Define the Subforum type
  subforum_id: number;
  name: string;
  zipcode: string;
};

interface SubforumbarProps { // Define the props for the Subforumbar component
  className?: string;
}

export default function Subforumbar({ className }: SubforumbarProps) { // Define the Subforumbar component
  const [subforums, setSubforums] = useState<Subforum[]>([]); // State to manage the list of subforums
  const [selectedSubforumId, setSelectedSubforumId] = useState<number>(1); // Default to subforum_id 1
  const pathname = usePathname(); 

  useEffect(() => { // Fetch subforums from the backend
    const fetchSubforums = async () => {
      try {
        const res = await fetch(`http://localhost:8080/subforums`);
        const data = await res.json();
        setSubforums(data.rows); // Set the fetched subforums to state
      } catch (error) { // handle error
        console.error("Failed to fetch subforums:", error);
      }
    };

    fetchSubforums();
  }, []);

  useEffect(() => {
    // when pathname changes, update the selected subforum if it's in the URL
    const subforumMatch = pathname?.match(/\/subforum\/(\d+)/);
    if (subforumMatch) {
      setSelectedSubforumId(Number(subforumMatch[1])); // set the selected subforum id
    }
  }, [pathname]);

  // return the subforum bar component
  return (
    <div className={`flex flex-col min-w-[200px] bg-stone-100 border-l border-stone-300 shadow-sm ${className}`}>
      <h2 className="text-lg font-semibold px-4 py-3 text-neutral-800 border-b border-stone-200">
        Subforums
      </h2>
      {subforums.map((sf) => {
        const isSelected = selectedSubforumId === sf.subforum_id;
        return (
          <Link
            key={sf.subforum_id}
            href={`/dashboard/subforum/${sf.subforum_id}`}
            className={`text-left px-4 py-3 border-b border-stone-200 transition-colors block
              ${isSelected
                ? "bg-stone-300 text-black font-semibold"
                : "bg-white text-neutral-800 hover:bg-stone-200 hover:text-neutral-900"
              }`}
            onClick={() => setSelectedSubforumId(sf.subforum_id)}
          >
            {sf.name}
          </Link>
        );
      })}
    </div>
  );
}