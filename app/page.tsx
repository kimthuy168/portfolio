import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <>
      <MainHeader />
      <main className="min-h-screen">
        <section id="home">
          <HeroSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="experience">
          <ExperienceSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <MainFooter />
    </>
  )
}
