import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { ContactSection } from "@/components/contact-section"
import { notFound } from "next/navigation"

export default async function UserPage(props: { params: Promise<{ id: string }> }) {
 const params = await props.params;
 const { id } = params;
 if(!id){
 return notFound();
 }
  return (
    <>
      <MainHeader userId={id}/>
      <main className="min-h-screen">
        <section id="home">
          <HeroSection userId={id}/>
        </section>
        <section id="projects">
          <ProjectsSection userId={id}/>
        </section>
        <section id="skills">
          <SkillsSection userId={id}/>
        </section>
        <section id="experience">
          <ExperienceSection userId={id}/>
        </section>
        <section id="contact">
          <ContactSection userId={id}/>
        </section>
      </main>
      <MainFooter userId={id}/>
    </>
  )
}
