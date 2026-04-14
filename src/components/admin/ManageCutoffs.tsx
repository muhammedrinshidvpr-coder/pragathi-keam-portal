import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface CutoffRow {
  id: string;
  branch: string;
  year: number;
  general_rank: number | null;
  obc_rank: number | null;
  sc_rank: number | null;
  st_rank: number | null;
  created_at: string;
}

export default function ManageCutoffs() {
  const [items, setItems] = useState<CutoffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ branch: "", year: new Date().getFullYear().toString(), general_rank: "", obc_rank: "", sc_rank: "", st_rank: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("cutoff_ranks").select("*").order("branch");
    setItems((data as CutoffRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => setForm({ branch: "", year: new Date().getFullYear().toString(), general_rank: "", obc_rank: "", sc_rank: "", st_rank: "" });

  const toNum = (v: string) => v ? parseInt(v, 10) : null;

  const handleAdd = async () => {
    if (!form.branch || !form.year) return;
    await supabase.from("cutoff_ranks").insert({
      branch: form.branch,
      year: parseInt(form.year, 10),
      general_rank: toNum(form.general_rank),
      obc_rank: toNum(form.obc_rank),
      sc_rank: toNum(form.sc_rank),
      st_rank: toNum(form.st_rank),
    });
    resetForm(); setAdding(false); fetchItems();
  };

  const handleUpdate = async (id: string) => {
    await supabase.from("cutoff_ranks").update({
      branch: form.branch,
      year: parseInt(form.year, 10),
      general_rank: toNum(form.general_rank),
      obc_rank: toNum(form.obc_rank),
      sc_rank: toNum(form.sc_rank),
      st_rank: toNum(form.st_rank),
    }).eq("id", id);
    setEditing(null); resetForm(); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("cutoff_ranks").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: CutoffRow) => {
    setEditing(item.id);
    setForm({
      branch: item.branch,
      year: item.year.toString(),
      general_rank: item.general_rank?.toString() ?? "",
      obc_rank: item.obc_rank?.toString() ?? "",
      sc_rank: item.sc_rank?.toString() ?? "",
      st_rank: item.st_rank?.toString() ?? "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">Manage Cut-Off Ranks</h2>
        <button onClick={() => { setAdding(!adding); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Branch *" value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="Year *" type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input placeholder="General Rank" type="number" value={form.general_rank} onChange={e => setForm(p => ({ ...p, general_rank: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="OBC Rank" type="number" value={form.obc_rank} onChange={e => setForm(p => ({ ...p, obc_rank: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="SC Rank" type="number" value={form.sc_rank} onChange={e => setForm(p => ({ ...p, sc_rank: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <input placeholder="ST Rank" type="number" value={form.st_rank} onChange={e => setForm(p => ({ ...p, st_rank: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
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
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Branch</th>
                <th className="text-left px-4 py-3 font-semibold">Year</th>
                <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">General</th>
                <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">OBC</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{item.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.year}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{item.general_rank ?? "—"}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{item.obc_rank ?? "—"}</td>
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
