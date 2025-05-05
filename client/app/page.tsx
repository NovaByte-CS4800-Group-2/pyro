"use client";

import Link from "next/link";
import Button from "./ui/button";
import { EmblaCarousel } from "./ui/carousel";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";

const ContentCard = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-7xl bg-[--porcelain] rounded-2xl shadow-xl p-8 text-[--text-color] my-6">
    {children}
  </div>
);

export default function Landing() {
  const [user] = useAuthState(auth);

  return (
    <main className="min-h-screen w-full bg-[--greige-mist] px-4 py-10 flex flex-col items-center text-[--text-color]">

      <div className="w-full max-w-6xl mb-10">
        <EmblaCarousel />
      </div>

      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Our mission:</h3>
        <p className="font-normal leading-relaxed">
          By creating our wildfire disaster reponse application Pyro, NovaByte hopes to empower survivors of wildfires across the United States. By providing real-time data, collaborative communication, and a safe space to spread hope and positive energy, our application aims to minimize the disastrous impact of wildfires, protect lives, and preserve communities.
        </p>
      </ContentCard>

      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Features:</h3>
        <p className="font-normal leading-relaxed">
        Pyro provides a safe, collaborative and encouraging space for those affected by wildfires around the country. Some key features that make Pyro truly stand out include our chatbot NovaBot that is always ready to provide comprehensive answers to any question related to wildfire preparedness, safety, and evacuation. Our fundraising forum provides a space for businesses to assist members of their community through various types of aid. Through host-evacuee matching, those that have been evacuated can still find a roof over their head and the comfort of community to help them recover after a disaster. Finally, our open chat forums that allow for user posts consisting of images, videos and text epitomize the final piece that makes those affected feel the safest and most supported despite the challenges they have encountered.
        </p>
      </ContentCard>

      {!user && (
        <section
          className="w-full text-[--bark] py-12 px-4 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--dark-green)" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl font-display font-bold mb-6">
              Ready to Join?
            </div>
            <nav className="inline-block">
              <Button label="Register" link="/register" />
            </nav>

            <div className="text-base font-normal mt-4">
              <Link
                href="/dashboard"
                className="font-semibold hover:underline text-[--deep-moss]"
              >
                or skip for now
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
