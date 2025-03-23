"use client";

import Link from "next/link";
import Button from "./ui/button";
import { EmblaCarousel } from "./ui/carousel";


const ContentBox = ({ children }: { children: React.ReactNode }) => (
  <div
  className="w-full max-w-4xl mx-auto border-2 border-[--dark-brown] p-4 text-center rounded-lg mt-6 text-[--dark-brown]"
  style={{ backgroundColor: "rgba(87, 69, 69, 0.5)" }} //to make the opacity
>
  {children}
</div>
);

export default function Landing() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <EmblaCarousel />
      </div>

      <ContentBox><h3 className="text-xl font-bold">Our mission:</h3>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Est amet earum, error voluptates repudiandae temporibus? Quaerat fugiat temporibus dolorem architecto iusto eum magnam totam ut, quis deserunt, iure rem nihil dolores molestiae nesciunt modi, odio ex a explicabo deleniti facilis optio quae labore? Quo maiores quae quasi illo quibusdam omnis expedita! Fuga officiis accusantium et, perspiciatis neque accusamus dolorem, animi deleniti reiciendis error impedit ex ratione esse corrupti repellendus ullam, possimus aperiam molestias. Modi, ab? A, cupiditate expedita dolores quisquam quam, beatae est nihil eius cum eligendi distinctio laboriosam, ipsam odit numquam sed fugiat eveniet unde in quos veritatis! Autem.</ContentBox>
      <ContentBox><h3 className="text-xl font-bold">Benefits/Features:</h3> 
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure quaerat delectus doloremque, dolore illo id itaque quos nam numquam blanditiis harum nemo tenetur corporis cumque quis, suscipit ipsa ea, molestias amet. Animi, tenetur perferendis vitae optio nisi natus consectetur repellat officia vel accusamus illum deserunt eum quisquam vero eaque illo nemo similique aut quia itaque dolorem saepe iusto? Cum voluptates excepturi sed et sint, velit dicta in adipisci veniam distinctio nulla molestias accusantium quod corporis voluptatibus numquam laboriosam nobis fugit incidunt aspernatur reiciendis, ullam quae! Temporibus, dolor earum excepturi sint odio, nesciunt eligendi vero voluptas ullam iste fuga inventore natus.</ContentBox>
      
      <div className="mt-12 text-5xl font-bold">Ready to Join?</div>

      <nav className="justify-end items-center p-7 gap-2 font-bold text-xl scale-150">
        <Button label="Register" link="/register" />
      </nav>

      <div className="text-l font-normal">
        <Link href="/dashboard" className="font-semibold hover:underline text-[--dark-brown] inline-block px-4 py-4">
          or skip for now
        </Link>
      </div>
    </div>
  );
}
