import dynamic from "next/dynamic"
import Header from "@/components/layout/header"
import HomeSection from "@/components/sections/home-section"
import ClientLayout from "@/components/client-layout" // ✅ New wrapper

const AboutSection = dynamic(() => import("@/components/sections/about-section"), { ssr: true })
// const ServicesSection = dynamic(() => import("@/components/sections/services-section"), { ssr: true })
const SkillsSection = dynamic(() => import("@/components/sections/skills-section"), { ssr: true })
const ResumeSection = dynamic(() => import("@/components/sections/resume-section"), { ssr: true })
const AchievementsSection = dynamic(() => import("@/components/sections/achievements-section"), { ssr: true })
const PortfolioSection = dynamic(() => import("@/components/sections/projects-section"), { ssr: true })
const BlogSection = dynamic(() => import("@/components/sections/blog-section"), { ssr: true })
const ContactSection = dynamic(() => import("@/components/sections/contact-section"), { ssr: true })
const Footer = dynamic(() => import("@/components/layout/footer"), { ssr: true })
const BackToTop = dynamic(() => import("@/components/back-to-top"), { ssr: true })

export const metadata = {
  title: "My Portfolio",
  description: "This is my portfolio site.",
  icons: {
    icon: "/aman.jpg",
  },
};



export default function Home() {
  return (
    <ClientLayout>
      <Header />
      <main>
        <HomeSection />
        <AboutSection />
        {/* <ServicesSection /> */}
        <SkillsSection />
        <ResumeSection />
        {/* <AchievementsSection /> */}
        <PortfolioSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </ClientLayout>
  )
}
