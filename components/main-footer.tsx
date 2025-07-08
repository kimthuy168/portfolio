"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Heart } from "lucide-react"
import useSWR from "swr";
import { TelegramIcon } from "./ui/icons";

type MainFooterRespone = {
  descriptionMyself: string;
  userName: string;
  email: string;
  phone?: number;
  githubAccount?: string;
  linkedinAccount?: string;
  telegramAccount: string;
  adress: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MainFooter({userId}:{userId:string}) {
   const { data, error, isLoading } = useSWR<MainFooterRespone>(
      `/api/mainfooter/${userId}`,
      fetcher
    );
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{data?.userName}</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              {data?.descriptionMyself ?? 
              "Full-stack developer passionate about creating modern, scalable web applications that solve real-world.problems and deliver exceptional user experiences"}
            </p>
            <div className="flex space-x-4">
            {/* GitHub*/}
            {data?.githubAccount &&  
            <Link
              href={data?.githubAccount!}
              className="text-gray-700"
            >
              <Github className="h-5 w-5" />
            </Link>
            }
          {/* Linkedin*/}
           {data?.linkedinAccount && 
           <Link
              href={data?.linkedinAccount}
              className= "text-gray-700"
            >
              <Linkedin className="h-5 w-5" />
            </Link>}

            {/* Email */}
            {data?.email && 
            <Link
              href={data.email}
              className="text-gray-700"
            >
              <Mail className="h-5 w-5" />
            </Link>}
            
             {/* Telegram */}
            {data?.telegramAccount &&  
            <Link
              href={data.email}
              className="text-gray-700"
            >
              <TelegramIcon size={5} />
            </Link>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-2 text-gray-400">
              <p>{data?.adress ?? 'San Francisco, CA'}</p>
              <p>{data?.email ?? 'contact@example.com'}</p>
              <p>{data?.phone ?? +855-123-123-12}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} {data?.userName }. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
