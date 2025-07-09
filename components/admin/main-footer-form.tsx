"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { SocialAccountMultiSelect } from "./social-account-selete"
import { MainFooter } from "@/lib/db/schema"
import useSWR from "swr"


type MainFooterFormData = Omit<MainFooter, "id"> & { id?: string }

export type MainFooterResponse = {
  id: string;
  userId: string;
  createdAt: string;
  descriptionMyself: string;
  adress: string;
  phone: number;
  socialAccountId: number[];

  userName: string;
  userEmail: string;

  socialAccounts: {
    id: number;
    userId: string;
    account: string | null;
    accountName: string | null;
    accountType: string | null;
    createdAt: string;
  }[];
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.text();
    const error = new Error(errorBody || 'An error occurred while fetching the data.');
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

export function MainFooterManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<MainFooterFormData>({
    socialAccountId: [] as string[],
    descriptionMyself: "",
    phone: 0,
    adress: "",
    published: true,
    userId,
    createdAt: new Date(),
  })
  const [editingFooter, setEditingFooter] = useState<MainFooter | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: footers, error, isLoading } = useSWR<MainFooterResponse>(
      `/api/main-footer/${userId}`,
     fetcher
   );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      socialAccountId: [] as string[],
      descriptionMyself: "",
      phone: 0,
      adress: "",
      published: true,
      userId,
      createdAt: new Date(),
    })
    setEditingFooter(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingFooter ? `/api/main-footer/${editingFooter.id}` : "/api/main-footer"
      const method = editingFooter ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (!res.ok) throw new Error("Failed to save footer")
      toast({ title: "Success", description: `Footer ${editingFooter ? "updated" : "created"} successfully` })
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  const handleEdit = (footer: MainFooter) => {
    setEditingFooter(footer)
    setFormData(footer)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer?")) return
    try {
      const res = await fetch(`/api/main-footer/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast({ title: "Success", description: "Footer deleted" })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  if (isLoading) return <div>Loading footer data...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Footer Management</h2>
          <p className="text-gray-600">Manage the information shown in your main footer</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Footer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingFooter ? "Edit Footer" : "Add Footer"}</DialogTitle>
              <DialogDescription>
                {editingFooter ? "Update your footer info" : "Create your footer content"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea name="descriptionMyself" value={formData.descriptionMyself} onChange={handleChange} placeholder="About Me" required />
              <Input name="phone" type="number" value={formData?.phone!} onChange={handleChange} placeholder="Phone Number" />
              <Input name="adress" value={formData.adress} onChange={handleChange} placeholder="Address" required />
              <SocialAccountMultiSelect
                  userId={userId}
                  selectedIds={formData.socialAccountId ?? []}
                  onChange={(id) => setFormData((prev) => ({ ...prev, socialAccountId: id }))}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={formData?.published!}
                    onCheckedChange={(v) => setFormData((prev) => ({ ...prev, published: v }))}
                  />
                </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingFooter ? "Update" : "Create"} Footer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {footers && (
        <div className="border p-4 rounded-md shadow-sm">
          <p className="font-semibold">{footers.userName}</p>
           <p className="font-semibold">{footers.descriptionMyself}</p>
           <p className="font-semibold">{footers.phone}</p>
            <p className="font-semibold">{footers.descriptionMyself}</p>
          <Label className="mt-2 block">Social Accounts</Label>
          {footers.socialAccounts?.length > 0 ? (
            <ul className="list-disc pl-5">
              {footers.socialAccounts.map((acc) => (
                <li key={acc.id}>
                  <span className="font-medium">{acc.accountName}</span>:{" "}
                  <a
                    href={acc.account || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {acc.account}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No social accounts</p>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
