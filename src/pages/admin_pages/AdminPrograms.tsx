import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Activity, Dumbbell, Pencil, Plus, RefreshCw, Save, Search, X } from "lucide-react";

type Program = {
  id: string;
  name: string;
  description: string | null;
  duration_min: number | null;
  duration_max: number | null;
  intensity: string;
  icon: string | null;
  features: string[] | null;
  is_active?: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  duration_min: "",
  duration_max: "",
  intensity: "medium",
  icon: "dumbbell",
  features: "",
  is_active: true,
};

const intensityOptions = ["low", "medium", "high", "extreme"];
const iconOptions = ["dumbbell", "running", "yoga", "boxing", "cycling", "swimming"];

export default function AdminPrograms() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programs")
      .select("id, name, description, duration_min, duration_max, intensity, icon, features, is_active")
      .order("name");

    if (error) {
      toast({
        title: "Could not load programs",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPrograms((data ?? []) as Program[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return programs;
    return programs.filter((program) =>
      `${program.name} ${program.description ?? ""} ${program.intensity}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [programs, query]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editProgram = (program: Program) => {
    setEditingId(program.id);
    setForm({
      name: program.name,
      description: program.description ?? "",
      duration_min: program.duration_min?.toString() ?? "",
      duration_max: program.duration_max?.toString() ?? "",
      intensity: program.intensity || "medium",
      icon: program.icon || "dumbbell",
      features: (program.features ?? []).join(", "),
      is_active: program.is_active ?? true,
    });
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim() || null,
    duration_min: form.duration_min ? Number(form.duration_min) : null,
    duration_max: form.duration_max ? Number(form.duration_max) : null,
    intensity: form.intensity,
    icon: form.icon,
    features: form.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean),
    is_active: form.is_active,
  });

  const saveProgram = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = buildPayload();
    const request = editingId
      ? supabase.from("programs").update(payload).eq("id", editingId)
      : supabase.from("programs").insert(payload);
    const { error } = await request;

    if (error) {
      toast({
        title: editingId ? "Could not update program" : "Could not create program",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingId ? "Program updated" : "Program created",
        description: `${payload.name} is ready for booking.`,
      });
      resetForm();
      await loadPrograms();
    }
    setSaving(false);
  };

  const toggleProgram = async (program: Program) => {
    const nextActive = !(program.is_active ?? true);
    const { error } = await supabase
      .from("programs")
      .update({ is_active: nextActive })
      .eq("id", program.id);

    if (error) {
      toast({
        title: "Could not update program status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPrograms((items) =>
        items.map((item) =>
          item.id === program.id ? { ...item, is_active: nextActive } : item
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? "Edit Program" : "Add Program"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProgram} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="duration_min">Min minutes</Label>
                  <Input
                    id="duration_min"
                    min={1}
                    type="number"
                    value={form.duration_min}
                    onChange={(event) => setForm({ ...form, duration_min: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_max">Max minutes</Label>
                  <Input
                    id="duration_max"
                    min={1}
                    type="number"
                    value={form.duration_max}
                    onChange={(event) => setForm({ ...form, duration_max: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="intensity">Intensity</Label>
                  <select
                    id="intensity"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.intensity}
                    onChange={(event) => setForm({ ...form, intensity: event.target.value })}
                  >
                    {intensityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon type</Label>
                  <select
                    id="icon"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.icon}
                    onChange={(event) => setForm({ ...form, icon: event.target.value })}
                  >
                    {iconOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features</Label>
                <Input
                  id="features"
                  placeholder="Form coaching, Nutrition tips, Weekly goals"
                  value={form.features}
                  onChange={(event) => setForm({ ...form, features: event.target.value })}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="is_active">Visible to users</Label>
                  <p className="text-sm text-muted-foreground">Turn off to hide without deleting.</p>
                </div>
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving || !form.name.trim()} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Program"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Programs</h1>
              <p className="text-sm text-muted-foreground">
                Manage what users can choose during booking.
              </p>
            </div>
            <Button variant="outline" onClick={loadPrograms}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search programs"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-muted-foreground">Loading programs...</CardContent>
              </Card>
            ) : filteredPrograms.length ? (
              filteredPrograms.map((program) => (
                <Card key={program.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-primary" />
                          <h2 className="text-xl font-semibold">{program.name}</h2>
                          <Badge variant={(program.is_active ?? true) ? "default" : "secondary"}>
                            {(program.is_active ?? true) ? "Active" : "Hidden"}
                          </Badge>
                          <Badge variant="outline">{program.intensity}</Badge>
                        </div>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                          {program.description || "No description yet."}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>{program.duration_min ?? "-"}-{program.duration_max ?? "-"} min</span>
                          {(program.features ?? []).map((feature) => (
                            <Badge key={feature} variant="secondary">
                              <Activity className="mr-1 h-3 w-3" />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => editProgram(program)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" onClick={() => toggleProgram(program)}>
                          {(program.is_active ?? true) ? "Hide" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-muted-foreground">No programs found.</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
