import { useCallback, useState } from "react";
import { Preloader } from "@/components/chrome/Preloader";
import { Cursor } from "@/components/chrome/Cursor";
import { Grain, GridField } from "@/components/chrome/Grain";
import { Nav } from "@/components/chrome/Nav";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { useLenis } from "@/lib/useLenis";

export default function App() {
  const [ready, setReady] = useState(false);

  // Smooth scrolling only starts once the intro has cleared, so the two
  // never fight over the scroll position.
  useLenis(ready);

  const handleIntroComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <GridField />
      <Grain />
      <Cursor />
      <ScrollProgress />
      <Preloader onComplete={handleIntroComplete} />

      <Nav />

      <main id="main">
        <Hero ready={ready} />
        <Work />
        <Experience />
        <About />
        <Stack />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
