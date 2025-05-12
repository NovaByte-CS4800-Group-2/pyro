"use client";

import { auth } from "@/app/firebase/config";
import MatchingForm from "@/app/ui/matchingform";
import {
  CheckBadgeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Matching() {
  const [form, setForm] = useState({
    user_id: "",
    type: "",
    form_id: 0,
    num_rooms: 0,
    num_people: 0,
    young_children: 0,
    adolescent_children: 0,
    teenage_children: 0,
    elderly: 0,
    small_dog: 0,
    large_dog: 0,
    cat: 0,
    other_pets: 0,
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getApplication = async () => {
      const resApp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/user/form/${user?.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(resApp);
      if (resApp.status == 200) {
        const body = await resApp.json();
        console.log(body);
        setForm(body.form);
      }
    };
    getApplication();
  }, [user]);

  useEffect(() => {
    if (form.user_id != "") {
      const getMatches = async () => {
        // Look for a matching form.
        const resMatch = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/match/${form.form_id}/${form.type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (resMatch.status == 200) {
          const responseData = await resMatch.json();
          const { matches } = responseData;
          setMatches(matches);
        }
      };
      getMatches();
    }
  }, [form]);

  const deleteForm = async () => {
    const resDelete = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/form/${form.form_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!resDelete.ok) {
      alert("Error deleting your form. Please try again later.");
      return;
    }
    setForm({
      user_id: "",
      type: "",
      form_id: 0,
      num_rooms: 0,
      num_people: 0,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    });
  };

  return (
    <div className="flex-grow flex">
      <div className="flex flex-col flex-grow items-center m-5">
        <h2 className="font-semibold text-3xl text-center mb-3">
          Welcome to the Matching Page!
        </h2>
        <p className="max-w-xl text-justify text-lg">
          Here you can apply to host those in need of housing or request housing
          for you and your loved ones. Keep in mind that you can only have one
          active application at a time. In order to change the details of your
          application, you must delete the previous one and reapply.
        </p>
        {showMatches ? (
          <div className="flex-grow mt-10 gap-y-10">
            <MatchingForm
              type={form.type === "offering" ? 1 : 0}
              found_matches={matches}
              form_id={form.form_id}
            />
          </div>
        ) : (
          <div className="flex flex-grow flex-wrap mt-10 gap-y-10">
            <Link
              className={
                "h-[120px] w-[230px] mx-10" +
                (form.user_id === "" ? "" : " pointer-events-none")
              }
              tabIndex={form.user_id === "" ? -1 : 0}
              aria-disabled={form.user_id === ""}
              href="/dashboard/matching/host"
            >
              <Card className="h-full w-full">
                <CardBody>
                  <div className="flex justify-center items-center h-full">
                    <p
                      className={
                        "text-3xl font-semibold text-center" +
                        (form.user_id === "" ? "" : " text-[--greige-deep]")
                      }
                    >
                      Apply to Host
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link
              className={
                "h-[120px] w-[230px] mx-10" +
                (form.user_id === "" ? "" : " pointer-events-none")
              }
              tabIndex={form.user_id === "" ? -1 : 0}
              aria-disabled={form.user_id === ""}
              href="/dashboard/matching/housing"
            >
              <Card className="h-full w-full">
                <CardBody>
                  <div className="flex justify-center items-center h-full">
                    <p
                      className={
                        "text-3xl font-semibold text-center" +
                        (form.user_id === "" ? "" : " text-[--greige-deep]")
                      }
                    >
                      Apply for Housing
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center min-w-[215px] bg-[--porcelain] border-l border-[--porcelain] shadow-lg ml-auto">
        <h2 className="text-lg font-semibold px-4 py-3 text-[--bark] border-b-2 border-[--bark]">
          Application Status
        </h2>
        {form.user_id ? (
          <div className="border-1 border-[--greige-mist] shadow-md py-2 px-3 rounded-lg mt-4 flex-col flex">
            <p className="text-lg font-semibold text-center">
              {form.type === "offering" ? "Hosting" : "Housing"} Form
            </p>
            {matches.length > 0 ? (
              <div className="flex mb-1 items-center gap-x-1 justify-center">
                <CheckBadgeIcon
                  className="text-green-600"
                  width={20}
                  height={20}
                />
                <p>Match Available!</p>
              </div>
            ) : (
              <div className="flex mb-1 items-center gap-x-1 justify-center">
                <InformationCircleIcon
                  className="text-[--deep-terracotta]"
                  width={20}
                  height={20}
                />
                <p> Waiting for a match!</p>
              </div>
            )}
            <p>Bedrooms: {form.num_rooms}</p>
            <p>Guests: {form.num_people}</p>
            <p>Young Children: {form.young_children}</p>
            <p>Adolescent Children: {form.adolescent_children}</p>
            <p>Teenage Children: {form.teenage_children}</p>
            <p>Elderly: {form.elderly}</p>
            <p>Small Dogs: {form.small_dog}</p>
            <p>Large Dogs: {form.large_dog}</p>
            <p>Cats: {form.cat}</p>
            <p>Other Pets: {form.other_pets}</p>
            <div className="flex mt-2 gap-x-1">
              {matches.length > 0 && (
                <Button
                  color="primary"
                  className="text-sm h-8"
                  onPress={() => setShowMatches(true)}
                >
                  Match!
                </Button>
              )}
              <Button
                onPress={deleteForm}
                color="secondary"
                className="text-sm h-8 font-semibold"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center max-w-[215px] px-3">
            {" "}
            After you create a form you will be able to see its status here!
            Already submitted one but it's not here? Check your notifications to
            see if you have a match!
          </p>
        )}
      </div>
    </div>
  );
}
