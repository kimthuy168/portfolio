"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus } from "lucide-react"
import { SocialAccountMultiSelect } from "./social-account-selete"
import { MainHeader } from "@/lib/db/schema"
import useSWR from "swr"
import { useRouter } from "next/navigation"


type MainHeaderFormData = Omit<MainHeader, "id"> & { id?: string }

export type MainHeaderResponse = {
  id: string;
  userId: string;
  createdAt: string;
  title: string;
  subtitle: string;
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

export function MainHeaderManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const router = useRouter();
  const [formData, setFormData] = useState<MainHeaderFormData>({
    socialAccountId: [] as string[],
    published: true,
    userId,
    createdAt: new Date(),
  })
  const [editingHeader, setEditingHeader] = useState<MainHeaderResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: header, error, isLoading } = useSWR<MainHeaderResponse>(
    `/api/main-header/${userId}`,
    fetcher
  );

  const resetForm = () => {
    setFormData({
      socialAccountId: [] as string[],
      published: true,
      userId,
      createdAt: new Date(),
    })
    setEditingHeader(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingHeader ? `/api/main-header/${editingHeader.id}` : `/api/main-header`
      const method = editingHeader ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (!res.ok) throw new Error("Failed to save header")
      toast({
        title: "Success",
        description: `Header ${editingHeader ? "updated" : "created"} successfully`,
      })
      resetForm()
      setIsDialogOpen(false)
      router.push(`/dashboard/${userId}`);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  const handleEdit = (header: MainHeaderResponse) => {
    setEditingHeader(header);
    setIsDialogOpen(true);
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this header?")) return
    try {
      const res = await fetch(`/api/main-header/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete header")
      toast({ title: "Success", description: "Header deleted successfully" })
      router.push(`/dashboard/${userId}`);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  if (isLoading) return <div>Loading headers...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Main Header Management</h2>
          <p className="text-gray-600">Manage the information in your site's main header</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {header!.socialAccounts?.length <= 1 && (
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Header
            </Button>
            )}
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHeader ? "Edit Header" : "Add Header"}</DialogTitle>
              <DialogDescription>
                {editingHeader ? "Update header information" : "Add your main header details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="submit">{editingHeader ? "Update" : "Create"} Header</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
      {header && (
        <div className="border p-4 rounded-md shadow-sm">
          <p className="font-semibold">{header.userName}</p>

          <Label className="mt-2 block">Social Accounts</Label>
          {header.socialAccounts?.length > 0 ? (
            <ul className="list-disc pl-5">
              {header.socialAccounts.map((acc) => (
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
