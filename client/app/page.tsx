"use client";

import Link from "next/link";
import Button from "./ui/button";
import { EmblaCarousel } from "./ui/carousel";

const ContentCard = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 text-[--text-color] my-6">
    {children}
  </div>
);

export default function Landing() {
  return (
    <main className="min-h-screen w-full bg-[--greige-mist] px-4 py-10 flex flex-col items-center text-[--text-color]">

      <div className="w-full max-w-6xl mb-10">
        <EmblaCarousel />
      </div>

      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Our mission:</h3>
        <p className="font-normal leading-relaxed">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel iure exercitationem dolorem ratione totam voluptatibus ipsum odio temporibus sint perferendis nemo quis explicabo, tempora voluptas nobis, a esse accusantium saepe praesentium, laboriosam amet magnam sit mollitia magni. Voluptatem nemo tenetur sed rerum provident omnis facilis, dolorem nisi suscipit adipisci repellendus incidunt perferendis quos tempore obcaecati vitae enim ipsa sunt sint deleniti ullam unde dolores quasi! Porro ab saepe dolorum doloremque molestias, esse, delectus explicabo soluta veritatis facere necessitatibus veniam. A magnam ullam, ratione beatae modi ipsam rem commodi ut impedit incidunt esse tempora, culpa vel expedita quo vitae quos iste!
        </p>
      </ContentCard>

      <ContentCard>
        <h3 className="text-xl font-display font-bold mb-2">Benefits / Features:</h3>
        <p className="font-normal leading-relaxed">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, nisi. Voluptates accusantium quae ullam laboriosam architecto saepe, aut eaque natus, ipsa, fuga maiores veniam provident? Voluptate voluptatem, natus dolores vel eum quos expedita culpa quidem tempore ut iste, sed tempora! Ipsam dolores laborum sint. Laudantium cum, iste fugit libero inventore repudiandae blanditiis nostrum deleniti vero eveniet provident quasi illo ipsa odio dicta excepturi architecto facere delectus esse voluptas quaerat voluptates quo nesciunt labore. Incidunt velit magnam fuga, adipisci architecto ex facilis, quod eaque dolorum saepe explicabo impedit, beatae obcaecati quaerat optio soluta? Laudantium, impedit animi. Tempora modi dolorum atque fugiat.
        </p>
      </ContentCard>

      <section
      className="w-full text-[--bark] py-12 px-4 rounded-xl shadow-lg"
      style={{ backgroundColor: "var(--ash-olive)" }}>
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
            className="font-semibold hover:underline text-[--olive-stone]">
              or skip for now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
