import { Awards } from "@/modules/core/components/awards";
import { CategoryAward } from "@/modules/core/components/category-award";
import { Hero } from "@/modules/core/components/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="">
        <Hero />
        <Awards />
        <CategoryAward />
      </main>
    </div>
  );
}
