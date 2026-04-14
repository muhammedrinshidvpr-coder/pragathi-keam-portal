import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

type Contact = Tables<"contacts">;

export default function ManageContacts() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "Volunteer", phone_number: "", email: "" });
  const [adding, setAdding] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("contacts").select("*").order("name");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => setForm({ name: "", role: "Volunteer", phone_number: "", email: "" });

  const handleAdd = async () => {
    if (!form.name) return;
    await supabase.from("contacts").insert({ name: form.name, role: form.role, phone_number: form.phone_number || null, email: form.email || null });
    resetForm(); setAdding(false); fetchItems();
  };

  const handleUpdate = async (id: string) => {
    await supabase.from("contacts").update({ name: form.name, role: form.role, phone_number: form.phone_number || null, email: form.email || null }).eq("id", id);
    setEditing(null); resetForm(); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: Contact) => {
    setEditing(item.id);
    setForm({ name: item.name, role: item.role, phone_number: item.phone_number ?? "", email: item.email ?? "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">Manage Contacts</h2>
        <button onClick={() => { setAdding(!adding); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Phone Number" value={form.phone_number} onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => editing ? handleUpdate(editing) : handleAdd()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold"><Save className="w-4 h-4" /> {editing ? "Update" : "Save"}</button>
            <button onClick={() => { setEditing(null); setAdding(false); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-semibold"><X className="w-4 h-4" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div className="h-32 bg-muted rounded-xl animate-pulse" /> : (
        <div className="overflow-x-auto bg-card border border-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-semibold">Name</th><th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Role</th><th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Phone</th><th className="text-right px-4 py-3 font-semibold">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.role}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.phone_number ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
