import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

type SocialLink = Tables<"social_links">;

export default function ManageSocials() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ platform_name: "", url: "", icon_identifier: "" });
  const [adding, setAdding] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("social_links").select("*").order("platform_name");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);
  const resetForm = () => setForm({ platform_name: "", url: "", icon_identifier: "" });

  const handleAdd = async () => {
    if (!form.platform_name || !form.url) return;
    await supabase.from("social_links").insert({ platform_name: form.platform_name, url: form.url, icon_identifier: form.icon_identifier || null });
    resetForm(); setAdding(false); fetchItems();
  };

  const handleUpdate = async (id: string) => {
    await supabase.from("social_links").update({ platform_name: form.platform_name, url: form.url, icon_identifier: form.icon_identifier || null }).eq("id", id);
    setEditing(null); resetForm(); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: SocialLink) => {
    setEditing(item.id);
    setForm({ platform_name: item.platform_name, url: item.url, icon_identifier: item.icon_identifier ?? "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">Manage Social Links</h2>
        <button onClick={() => { setAdding(!adding); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold"><Plus className="w-4 h-4" /> Add Link</button>
      </div>

      {(adding || editing) && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Platform Name *" value={form.platform_name} onChange={e => setForm(p => ({ ...p, platform_name: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="URL *" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Icon Identifier (e.g. instagram)" value={form.icon_identifier} onChange={e => setForm(p => ({ ...p, icon_identifier: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
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
            <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-semibold">Platform</th><th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">URL</th><th className="text-right px-4 py-3 font-semibold">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{item.platform_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-xs">{item.url}</td>
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
