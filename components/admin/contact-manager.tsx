"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Eye, Trash2, Calendar, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Contact } from "@/lib/db/schema"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ContactManager({ userId }: { userId: string }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const { data: contacts, isLoading } = useSWR<Contact[]>(`/api/contact/${userId}`, fetcher)
  
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Message marked as read" })
      } else throw new Error("Failed to mark as read")
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Message deleted successfully" })
      } else throw new Error("Failed to delete message")
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const handleViewMessage = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
    if (!contact.read) handleMarkAsRead(contact.id)
  }

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const unreadMessages = contacts?.filter((c) => !c.read)
  const readMessages = contacts?.filter((c) => c.read)

  if (isLoading) return <div>Loading contact messages...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <p className="text-gray-600">Manage and respond to contact form submissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {unreadMessages!.length} Unread
          </Badge>
          <Badge variant="outline" className="text-sm">
            {contacts!.length} Total
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Unread ({unreadMessages!.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Read ({readMessages!.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            All ({contacts!.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {unreadMessages!.length === 0 ? (
            <EmptyCard icon={<Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />} text="No unread messages" />
          ) : (
            <ContactList
              contacts={unreadMessages!}
              onView={handleViewMessage}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readMessages!.length === 0 ? (
            <EmptyCard icon={<Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />} text="No read messages" />
          ) : (
            <ContactList
              contacts={readMessages!}
              onView={handleViewMessage}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <ContactList
            contacts={contacts!}
            onView={handleViewMessage}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Message from {selectedContact?.name}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedContact && formatDate(selectedContact.createdAt!)}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <ContactDetails
              contact={selectedContact}
              onDelete={handleDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ContactListProps {
  contacts: Contact[]
  onView: (contact: Contact) => void
  onDelete: (id: number) => void
  formatDate: (date: string | Date) => string
}

function ContactList({ contacts, onView, onDelete, formatDate }: ContactListProps) {
  return (
    <div className="grid gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onView={onView}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </div>
  )
}

interface ContactCardProps {
  contact: Contact
  onView: (contact: Contact) => void
  onDelete: (id: number) => void
  formatDate: (date: string | Date) => string
}

function ContactCard({ contact, onView, onDelete, formatDate }: ContactCardProps) {
  return (
    <Card className={`cursor-pointer transition-colors ${!contact.read ? "bg-blue-50 border-blue-200" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1" onClick={() => onView(contact)}>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              {contact.name}
              {!contact.read && <Badge variant="secondary">New</Badge>}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3" />
              {contact.email}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => onView(contact)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(contact.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onView(contact)}>
        <div className="space-y-2">
          <div>
            <span className="font-medium text-sm">Subject: </span>
            <span className="text-sm">{contact.subject}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(contact.createdAt!)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContactDetails({ contact, onDelete }: { contact: Contact; onDelete: (id: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Name</Label>
          <p className="text-sm">{contact.name}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Email</Label>
          <p className="text-sm">{contact.email}</p>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-500">Subject</Label>
        <p className="text-sm">{contact.subject}</p>
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-500">Message</Label>
        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Reply via Email
        </Button>
        <Button variant="outline" onClick={() => onDelete(contact.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Message
        </Button>
      </div>
    </div>
  )
}

function EmptyCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          {icon}
          <p className="text-gray-500">{text}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  )
}
