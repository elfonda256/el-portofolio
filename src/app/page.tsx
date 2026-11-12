import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { FieldBand } from "@/components/sections/FieldBand";
import { LatestContent } from "@/components/sections/LatestContent";
import { Portfolio } from "@/components/sections/Portfolio";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { features } from "@/data/site";
import { FieldScene } from "@/components/scene/FieldScene";
import { IntroLoader } from "@/components/scene/IntroLoader";

export default function HomePage() {
  return (
    <>
      <IntroLoader />
      <FieldScene />
      <Hero />
      <Intro />
      <FieldBand />
      {features.showLatestContent && <LatestContent />}
      <Portfolio />
      <About />
      <Journey />
      <Services />
      <Contact />
    </>
  );
}
