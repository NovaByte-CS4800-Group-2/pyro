'use client'

import { EmblaCarousel } from "./ui/carousel";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useRouter} from "next/navigation";
import {signOut} from 'firebase/auth'


export default function Landing() {
  const [user] = useAuthState(auth); 
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");
  console.log({user})

  if (!user && !userSession){
    router.push('/dashboard')
  }

  return (
    <>
      <div>
        <EmblaCarousel/>
      </div>
    </>
  );
}