import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Intro from "@/components/Intro";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md bg-amber px-4 py-2 font-mono text-[13px] text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90]"
      >
        skip to content
      </a>
      <Intro />
      <Nav />
      <CommandPalette />
      <StatusBar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
