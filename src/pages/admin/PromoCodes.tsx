import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Tag, Copy, Check } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

const emptyForm = {
  code: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "0",
  max_uses: "",
  is_active: true,
  starts_at: "",
  ends_at: "",
};

const PromoCodes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PromoCode[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value) || 0,
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_active: form.is_active,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
      };

      if (editingId) {
        const { error } = await supabase.from("promo_codes").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("promo_codes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast({ title: editingId ? "Promo code updated" : "Promo code created" });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast({ title: "Promo code deleted" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("promo_codes").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promo-codes"] }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(false);
  };

  const openEdit = (promo: PromoCode) => {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: String(promo.discount_value),
      min_order_amount: String(promo.min_order_amount),
      max_uses: promo.max_uses ? String(promo.max_uses) : "",
      is_active: promo.is_active,
      starts_at: promo.starts_at ? promo.starts_at.slice(0, 16) : "",
      ends_at: promo.ends_at ? promo.ends_at.slice(0, 16) : "",
    });
    setDialogOpen(true);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isExpired = (promo: PromoCode) => {
    if (!promo.ends_at) return false;
    return new Date(promo.ends_at) < new Date();
  };

  const isMaxedOut = (promo: PromoCode) => {
    if (!promo.max_uses) return false;
    return promo.used_count >= promo.max_uses;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Promo Codes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage discount codes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) resetForm(); setDialogOpen(v); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20"
                  className="mt-1 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discount Type</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm((p) => ({ ...p, discount_type: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Discount Value *</Label>
                  <Input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))}
                    placeholder={form.discount_type === "percentage" ? "e.g. 20" : "e.g. 100"}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min Order Amount</Label>
                  <Input
                    type="number"
                    value={form.min_order_amount}
                    onChange={(e) => setForm((p) => ({ ...p, min_order_amount: e.target.value }))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Max Uses (empty = unlimited)</Label>
                  <Input
                    type="number"
                    value={form.max_uses}
                    onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))}
                    placeholder="Unlimited"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Starts At</Label>
                  <Input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm((p) => ({ ...p, starts_at: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Ends At</Label>
                  <Input
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
                <Label>Active</Label>
              </div>
              <Button
                className="w-full"
                onClick={() => saveMutation.mutate()}
                disabled={!form.code.trim() || !form.discount_value || saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving..." : editingId ? "Update Code" : "Create Code"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Codes</p>
            <p className="text-2xl font-heading font-bold mt-1">{promoCodes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active</p>
            <p className="text-2xl font-heading font-bold mt-1 text-success">
              {promoCodes.filter((p) => p.is_active && !isExpired(p) && !isMaxedOut(p)).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Uses</p>
            <p className="text-2xl font-heading font-bold mt-1">
              {promoCodes.reduce((s, p) => s + p.used_count, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Expired</p>
            <p className="text-2xl font-heading font-bold mt-1 text-destructive">
              {promoCodes.filter((p) => isExpired(p)).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : promoCodes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Tag className="h-8 w-8 opacity-40" />
              <p>No promo codes yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Code</th>
                    <th className="pb-3 font-medium text-muted-foreground">Discount</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Min Order</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Uses</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono font-bold">{promo.code}</code>
                          <button
                            onClick={() => copyCode(promo.code, promo.id)}
                            className="text-muted-foreground hover:text-foreground transition"
                          >
                            {copiedId === promo.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 font-medium">
                        {promo.discount_type === "percentage" ? `${promo.discount_value}%` : `৳${promo.discount_value}`}
                      </td>
                      <td className="py-3 hidden sm:table-cell text-muted-foreground">
                        {promo.min_order_amount > 0 ? `৳${promo.min_order_amount}` : "—"}
                      </td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">
                        {promo.used_count}{promo.max_uses ? ` / ${promo.max_uses}` : " / ∞"}
                      </td>
                      <td className="py-3">
                        {isExpired(promo) ? (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 text-[10px]">Expired</Badge>
                        ) : isMaxedOut(promo) ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px]">Maxed Out</Badge>
                        ) : (
                          <Switch
                            checked={promo.is_active}
                            onCheckedChange={(v) => toggleMutation.mutate({ id: promo.id, is_active: v })}
                          />
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(promo)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(promo.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodes;
