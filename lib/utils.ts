import { type ClassValue, clsx } from "clsx"
import { Cloud, Code, Database, Server } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "Present"
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

export const CategoriesJob = [
  { value: "Frontend", label: "Frontend", icon: Code },
  { value: "Backend", label: "Backend", icon: Server },
  { value: "Database", label: "Database", icon: Database },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "DevOps", label: "DevOps", icon: Cloud },
]


export const AccountType = [
  { value: "gibhub", label: "GitHub"},
  { value: "linkin", label: "LinkIn"},
  { value: "telegram", label: "Telegram"},
]

