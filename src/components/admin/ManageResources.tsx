import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

type Resource = Tables<"academic_resources">;

export default function ManageResources() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: "", resource_type: "PYQ", file_url: "", title: "" });
  const [adding, setAdding] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("academic_resources").select("*").order("subject");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);
  const resetForm = () => setForm({ subject: "", resource_type: "PYQ", file_url: "", title: "" });

  const handleAdd = async () => {
    if (!form.subject || !form.file_url) return;
    await supabase.from("academic_resources").insert({ subject: form.subject, resource_type: form.resource_type, file_url: form.file_url, title: form.title || null });
    resetForm(); setAdding(false); fetchItems();
  };

  const handleUpdate = async (id: string) => {
    await supabase.from("academic_resources").update({ subject: form.subject, resource_type: form.resource_type, file_url: form.file_url, title: form.title || null }).eq("id", id);
    setEditing(null); resetForm(); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("academic_resources").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: Resource) => {
    setEditing(item.id);
    setForm({ subject: item.subject, resource_type: item.resource_type, file_url: item.file_url, title: item.title ?? "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">Manage Resources</h2>
        <button onClick={() => { setAdding(!adding); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold"><Plus className="w-4 h-4" /> Add Resource</button>
      </div>

      {(adding || editing) && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Subject *" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <select value={form.resource_type} onChange={e => setForm(p => ({ ...p, resource_type: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
              <option>PYQ</option><option>Mock Test</option><option>Notes</option>
            </select>
            <input placeholder="File URL *" value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
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
            <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-semibold">Title</th><th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Subject</th><th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Type</th><th className="text-right px-4 py-3 font-semibold">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{item.title || item.resource_type}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.resource_type}</td>
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
