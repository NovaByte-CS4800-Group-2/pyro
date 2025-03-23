"use client";

import Link from "next/link";
import Button from "./ui/button";
import { EmblaCarousel } from "./ui/carousel";

const ContentCard = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-4xl bg-[--off-white] rounded-2xl shadow-xl p-8 text-[--text-color] my-6">
    {children}
  </div>
);

export default function Landing() {
  return (
    <main className="min-h-screen bg-[--sand] px-4 py-10 flex flex-col items-center text-[--text-color]">

      <div className="w-full max-w-6xl mb-10">
        <EmblaCarousel />
      </div>

      {/* our mission*/}
      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Our mission:</h3>
        <p className="font-normal leading-relaxed">
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima consequatur quisquam ratione praesentium explicabo minus, autem enim? Vel maxime quaerat adipisci ullam, labore quos ut, provident aliquid esse pariatur a. Dolor beatae sit eius quod odio sed veniam voluptates ipsum libero officiis eum ea molestias velit, porro consectetur expedita temporibus eos reprehenderit, explicabo vitae iusto voluptatum ipsam, iste esse. Eos magnam repudiandae porro, culpa a eaque, mollitia veritatis obcaecati placeat numquam dolorum laboriosam consequuntur, veniam vel praesentium optio dicta? Ad quasi sapiente aspernatur earum dicta enim eum voluptatum veniam ea? Voluptatibus corporis repudiandae harum vero, earum atque? Iste earum excepturi itaque esse, at velit reprehenderit corrupti ipsum, vitae quasi dolorem, neque doloribus. Esse reprehenderit ipsum libero quidem, sed rem explicabo voluptas repudiandae illo labore. Minima, dicta mollitia vel dignissimos modi omnis recusandae ipsum architecto excepturi in illum! Accusantium accusamus adipisci, exercitationem assumenda architecto aperiam praesentium ex vitae a voluptatibus quos eveniet ipsum mollitia at iusto quas dolorum, facilis omnis. Maxime est amet aperiam enim, accusantium id voluptatum nam libero ratione sint maiores rerum excepturi aliquam magnam porro dolores totam aliquid, odit sit a quos! Temporibus quae placeat debitis ducimus amet minus ipsa iusto, excepturi quidem repellat deleniti, laudantium odit dolor!
        </p>
      </ContentCard>

      {/* benefits/features */}
      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Benefits / Features:</h3>
        <p className="font-normal leading-relaxed">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis dolores tenetur iusto amet laudantium tempora debitis. Iste repellendus sed, dicta quam reprehenderit deserunt laborum repellat illum, in amet quisquam asperiores, totam perspiciatis nesciunt dignissimos odio voluptate vero ex est error fugiat? Dignissimos tempora repudiandae necessitatibus eos! Rerum, quam eveniet! Ipsa alias, ducimus, fugit minima, quia esse amet nobis beatae quae ratione minus? Officiis tempore, quibusdam obcaecati optio quia earum porro distinctio natus minus non cum eum fuga impedit itaque libero, neque magni beatae ut doloremque est velit nesciunt eaque pariatur. Animi soluta delectus nemo adipisci dolor neque reprehenderit atque quasi?
        </p>
      </ContentCard>

      <div className="mt-12 text-4xl font-display font-bold text-center">
        Ready to Join?
      </div>

      <nav className="mt-6 flex justify-center items-center gap-4">
        <Button label="Register" link="/register" />
      </nav>

      <div className="text-base font-normal mt-4">
        <Link
          href="/dashboard"
          className="font-semibold hover:underline text-[--liver]"
        >
          or skip for now
        </Link>
      </div>
    </main>
  );
}
