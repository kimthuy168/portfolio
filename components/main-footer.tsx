'use client'

import Link from "next/link"
import useSWR from "swr"
import { Github, Linkedin, Mail } from "lucide-react"
import { Heart } from "lucide-react"
import { TelegramIcon } from "./ui/icons"

type MainFooterResponse = {
  id: string
  socialAccountId: string[]
  userId: string
  descriptionMyself: string | null
  phone: string | null
  adress: string | null
  createdAt: string
  userName: string
  userEmail: string
  account: string | null
  accountName: string | null
  accountType: string | null
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const SocialLink = ({ type, url }: { type: string; url: string }) => {
  const iconClass = "text-gray-400 hover:text-white transition-colors"

  switch (type) {
    case "github":
      return <Link href={url} className={iconClass}><Github className="h-5 w-5" /></Link>
    case "linkedin":
      return <Link href={url} className={iconClass}><Linkedin className="h-5 w-5" /></Link>
    case "telegram":
      return <Link href={url} className={iconClass}><TelegramIcon size={5} /></Link>
    case "email":
      return <Link href={`mailto:${url}`} className={iconClass}><Mail className="h-5 w-5" /></Link>
    default:
      return null
  }
}

export function MainFooter({ userId }: { userId: string }) {
  const { data, isLoading } = useSWR<MainFooterResponse>(
    `/api/main-footer/${userId}`,
    fetcher
  )

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{data?.userName ?? "My Portfolio"}</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              {data?.descriptionMyself ??
                "Full-stack developer passionate about creating modern, scalable web applications that solve real-world problems and deliver exceptional user experiences."}
            </p>
            <div className="flex space-x-4">
              {data?.account && data.accountType && (
                <SocialLink type={data.accountType} url={data.account} />
              )}
              {data?.userEmail && <SocialLink type="email" url={data.userEmail} />}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["home", "projects", "skills", "contact"].map((section) => (
                <li key={section}>
                  <button
                    onClick={() =>
                      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-2 text-gray-400">
              <p>{data?.adress ?? "San Francisco, CA"}</p>
              <p>
                {data?.userEmail ? (
                  <Link href={`mailto:${data.userEmail}`} className="hover:text-white transition-colors">
                    {data.userEmail}
                  </Link>
                ) : (
                  "contact@example.com"
                )}
              </p>
              <p>{data?.phone ?? "+855-123-123-12"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {data?.userName ?? "My Portfolio"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
