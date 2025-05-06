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
  mobile?: boolean;
}

export default function Subforumbar({ className = "", mobile = false }: SubforumbarProps) { // Define the Subforumbar component
  const [subforums, setSubforums] = useState<Subforum[]>([]); // State to manage the list of subforums
  const [selectedSubforumId, setSelectedSubforumId] = useState<number>(1); // Default to subforum_id 1
  const pathname = usePathname(); 

  useEffect(() => { // Fetch subforums from the backend
    const fetchSubforums = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subforums`);
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

  /*if (mobile) {
    return (
      <div className="flex flex-col bg-[--porcelain] border border-[--porcelain] shadow-sm rounded-md mb-4">
        <h2 className="text-lg font-bold font-display px-4 py-3 text-[--bark] border-b border-[--porcelain]">
          Subforums
        </h2>
        <select
          value={selectedSubforumId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setSelectedSubforumId(id);
            window.location.href = `/dashboard/subforum/${id}`;
          }}
          className="px-4 py-3 text-[--bark] bg-[--greige-mist] border-none focus:outline-none font-normal"
        >
          {subforums.map((sf) => (
            <option key={sf.subforum_id} value={sf.subforum_id}>
              {sf.name}
            </option>
          ))}
        </select>
      </div>
    );
  }  */

  // return the subforum bar component
  return (
    <div className={`flex flex-col min-w-[200px] bg-[--porcelain] border-l border-[--porcelain] shadow-sm`}>
      <h2 className="text-lg font-bold bg-[--porcelain] font-display px-4 py-3 text-[--bark] border-b border-[--porcelain]">
        Subforums
      </h2>
      {subforums.map((sf) => {
        const isSelected = selectedSubforumId === sf.subforum_id;
        return (
          <Link
            key={sf.subforum_id}
            href={`/dashboard/subforum/${sf.subforum_id}`}
            className={`px-4 py-3 border border-[--porcelain] transition-colors block font-normal
              ${isSelected
                 ? "bg-[--greige-deep] text-[--porcelain] font-semibold"
              : "bg-[--greige-mist] text-[--bark] hover:bg-[--greige-deep] hover:text-[--bark]"
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