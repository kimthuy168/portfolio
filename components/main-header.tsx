"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Github, Linkedin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleSectionChange = () => {
      const sections = navigation.map((item) => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleSectionChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleSectionChange)
    }
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            <span className={cn("transition-colors", isScrolled ? "text-gray-900" : "text-white")}>John Doe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  activeSection === item.href.substring(1)
                    ? "text-blue-600"
                    : isScrolled
                      ? "text-gray-700"
                      : "text-gray-300",
                )}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="https://github.com"
              className={cn("transition-colors hover:text-blue-600", isScrolled ? "text-gray-700" : "text-gray-300")}
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              className={cn("transition-colors hover:text-blue-600", isScrolled ? "text-gray-700" : "text-gray-300")}
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:contact@example.com"
              className={cn("transition-colors hover:text-blue-600", isScrolled ? "text-gray-700" : "text-gray-300")}
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className={cn("h-6 w-6", isScrolled ? "text-gray-900" : "text-white")} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl">Menu</span>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={cn(
                        "text-left text-lg font-medium transition-colors hover:text-blue-600",
                        activeSection === item.href.substring(1) ? "text-blue-600" : "text-gray-700",
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
                <div className="flex space-x-4 pt-6 border-t">
                  <Link href="https://github.com" className="text-gray-600 hover:text-blue-600">
                    <Github className="h-6 w-6" />
                  </Link>
                  <Link href="https://linkedin.com" className="text-gray-600 hover:text-blue-600">
                    <Linkedin className="h-6 w-6" />
                  </Link>
                  <Link href="mailto:contact@example.com" className="text-gray-600 hover:text-blue-600">
                    <Mail className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
