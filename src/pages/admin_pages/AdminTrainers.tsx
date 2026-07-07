import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Pencil, Plus, RefreshCw, Save, Search, Star, UserRound, X } from "lucide-react";

type Trainer = {
  id: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  headline: string | null;
  bio: string | null;
  rating: number;
  clients_count: number;
  start_date: string | null;
  is_active: boolean;
};

const emptyForm = {
  first_name: "",
  last_name: "",
  photo_url: "",
  headline: "",
  bio: "",
  rating: "5.0",
  clients_count: "0",
  start_date: "",
  is_active: true,
};

const initialsFor = (trainer: Pick<Trainer, "first_name" | "last_name">) =>
  `${trainer.first_name?.[0] ?? ""}${trainer.last_name?.[0] ?? ""}`.toUpperCase() || "TR";

export default function AdminTrainers() {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTrainers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trainers")
      .select("id, first_name, last_name, photo_url, headline, bio, rating, clients_count, start_date, is_active")
      .order("first_name");

    if (error) {
      toast({
        title: "Could not load trainers",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrainers((data ?? []) as Trainer[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const filteredTrainers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return trainers;
    return trainers.filter((trainer) =>
      `${trainer.first_name} ${trainer.last_name} ${trainer.headline ?? ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [trainers, query]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editTrainer = (trainer: Trainer) => {
    setEditingId(trainer.id);
    setForm({
      first_name: trainer.first_name,
      last_name: trainer.last_name,
      photo_url: trainer.photo_url ?? "",
      headline: trainer.headline ?? "",
      bio: trainer.bio ?? "",
      rating: trainer.rating?.toString() ?? "5.0",
      clients_count: trainer.clients_count?.toString() ?? "0",
      start_date: trainer.start_date ?? "",
      is_active: trainer.is_active,
    });
  };

  const buildPayload = () => ({
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    photo_url: form.photo_url.trim() || null,
    headline: form.headline.trim() || null,
    bio: form.bio.trim() || null,
    rating: form.rating ? Number(form.rating) : 5,
    clients_count: form.clients_count ? Number(form.clients_count) : 0,
    start_date: form.start_date || null,
    is_active: form.is_active,
  });

  const saveTrainer = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = buildPayload();
    const request = editingId
      ? supabase.from("trainers").update(payload).eq("id", editingId)
      : supabase.from("trainers").insert(payload);
    const { error } = await request;

    if (error) {
      toast({
        title: editingId ? "Could not update trainer" : "Could not create trainer",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingId ? "Trainer updated" : "Trainer created",
        description: `${payload.first_name} ${payload.last_name} is saved.`,
      });
      resetForm();
      await loadTrainers();
    }
    setSaving(false);
  };

  const toggleTrainer = async (trainer: Trainer) => {
    const nextActive = !trainer.is_active;
    const { error } = await supabase
      .from("trainers")
      .update({ is_active: nextActive })
      .eq("id", trainer.id);

    if (error) {
      toast({
        title: "Could not update trainer status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrainers((items) =>
        items.map((item) =>
          item.id === trainer.id ? { ...item, is_active: nextActive } : item
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
              {editingId ? "Edit Trainer" : "Add Trainer"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveTrainer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(event) => setForm({ ...form, first_name: event.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(event) => setForm({ ...form, last_name: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  type="url"
                  value={form.photo_url}
                  onChange={(event) => setForm({ ...form, photo_url: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Specialty headline</Label>
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(event) => setForm({ ...form, headline: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) => setForm({ ...form, rating: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clients_count">Clients</Label>
                  <Input
                    id="clients_count"
                    type="number"
                    min="0"
                    value={form.clients_count}
                    onChange={(event) => setForm({ ...form, clients_count: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={(event) => setForm({ ...form, start_date: event.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="is_active">Accepting sessions</Label>
                  <p className="text-sm text-muted-foreground">Inactive trainers stay in history.</p>
                </div>
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={saving || !form.first_name.trim() || !form.last_name.trim()}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Trainer"}
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
              <h1 className="text-2xl font-bold">Trainers</h1>
              <p className="text-sm text-muted-foreground">
                Manage coach profiles and who appears to users.
              </p>
            </div>
            <Button variant="outline" onClick={loadTrainers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search trainers"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-muted-foreground">Loading trainers...</CardContent>
              </Card>
            ) : filteredTrainers.length ? (
              filteredTrainers.map((trainer) => (
                <Card key={trainer.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={trainer.photo_url ?? undefined} />
                          <AvatarFallback>{initialsFor(trainer)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold">
                              {trainer.first_name} {trainer.last_name}
                            </h2>
                            <Badge variant={trainer.is_active ? "default" : "secondary"}>
                              {trainer.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            {trainer.headline || "No headline yet"}
                          </p>
                          <p className="max-w-2xl text-sm text-muted-foreground">
                            {trainer.bio || "No bio yet."}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-energy" />
                              {trainer.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserRound className="h-4 w-4" />
                              {trainer.clients_count} clients
                            </span>
                            {trainer.start_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Since {trainer.start_date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => editTrainer(trainer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" onClick={() => toggleTrainer(trainer)}>
                          {trainer.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-muted-foreground">No trainers found.</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
