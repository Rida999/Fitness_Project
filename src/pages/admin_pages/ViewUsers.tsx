// src/pages/admin_pages/ViewUsers.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Mail,
  Calendar,
  UserCheck,
  Heart,
  TrendingUp,
  Sparkles,
  Filter,
  Clock,
  Award,
  Star,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  email_confirmed?: boolean;
  subscription_status?: "active" | "inactive" | "trial";
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, first_name, last_name, avatar_url, created_at, subscription_status")
          .order("created_at", { ascending: false });
        if (error) throw error;

        const users = ((data ?? []) as User[]).map((user) => ({
          ...user,
          email_confirmed: true,
        }));
        setUsers(users);
        setFilteredUsers(users);
      } catch (err: any) {
        toast({
          title: "❌ Error",
          description: err.message || "Could not load users.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((u) =>
        `${u.first_name ?? ""} ${u.last_name ?? ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getSubscriptionBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary/10 text-primary">
            🌟 Active
          </Badge>
        );
      case "trial":
        return (
          <Badge className="bg-energy text-energy-foreground">
            🚀 Trial
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-muted text-muted-foreground">
            😴 Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.subscription_status === "active").length,
    trial: users.filter((u) => u.subscription_status === "trial").length,
    verified: users.filter((u) => u.email_confirmed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-admin/30 border-t-admin rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-lg">
            Loading community members... 👥
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-admin to-admin-glow shadow-[var(--shadow-glow)]">
              <Users className="w-8 h-8 text-admin-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Community Members
            </h1>
            <Sparkles className="w-8 h-8 text-admin2 animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Meet your amazing fitness community! 🌟
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <Users className="mx-auto w-5 h-5 text-admin" />
              <h2 className="text-2xl font-bold gradient-text">{stats.total}</h2>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <Star className="mx-auto w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-primary">{stats.active}</h2>
              <p className="text-sm text-muted-foreground">Active Subscribers</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <TrendingUp className="mx-auto w-5 h-5 text-energy" />
              <h2 className="text-2xl font-bold text-energy">{stats.trial}</h2>
              <p className="text-sm text-muted-foreground">Trial Users</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <UserCheck className="mx-auto w-5 h-5 text-admin2" />
              <h2 className="text-2xl font-bold text-admin2">{stats.verified}</h2>
              <p className="text-sm text-muted-foreground">Verified Emails</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="fitness-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u, idx) => (
            <Card
              key={u.id}
              className="fitness-card group hover:shadow-[var(--shadow-admin)] transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    {u.avatar_url ? (
                      <AvatarImage src={u.avatar_url} alt={u.email} />
                    ) : (
                      <AvatarFallback className="bg-admin text-admin-foreground font-bold text-lg">
                        {u.email[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">
                      {u.first_name || u.last_name
                        ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                        : u.email.split("@")[0]}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" /> {u.email}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getSubscriptionBadge(u.subscription_status)}
                      {u.email_confirmed ? (
                        <Badge variant="outline" className="text-xs">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-secondary text-secondary-foreground">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Joined:
                    </span>
                    <span className="font-medium">
                      {formatDate(u.created_at)}
                    </span>
                  </div>
                  {u.last_sign_in && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" /> Last seen:
                      </span>
                      <span className="font-medium">
                        {formatDate(u.last_sign_in)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="fitness-card text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No users found" : "No members yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No one matches "${searchTerm}". Try again.`
                  : "Your community is just getting started!"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground animate-fade-in">
          <p className="flex items-center justify-center gap-2">
            Building an amazing fitness community{" "}
            <Heart className="text-admin animate-bounce-gentle" /> together
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
