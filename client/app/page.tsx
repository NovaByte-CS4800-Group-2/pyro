'use client'

import { EmblaCarousel } from "./ui/carousel";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useRouter} from "next/navigation";
import {signOut} from 'firebase/auth'


export default function Landing() {

  return (
    <>
      <div>
        <EmblaCarousel/>
      </div>
    </>
  );
}