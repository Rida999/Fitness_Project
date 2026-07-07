import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Trainers from "./pages/Trainers";
import Programs from "./pages/Programs";
import BookSession from "./pages/BookSession";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AdminPrograms from "./pages/admin_pages/AdminPrograms";
import AdminTrainers from "./pages/admin_pages/AdminTrainers";
import AdminSlots from "./pages/admin_pages/AdminSlots";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import ViewUsers from "./pages/admin_pages/ViewUsers";
import ViewTrainers from "./pages/admin_pages/ViewTrainers";
import Header from "@/components/Header";
import ChatbotBar from "@/components/ChatbotBar";
import { isSupabaseConfigured } from "@/lib/supabase";

const queryClient = new QueryClient();

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <ChatbotBar />
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

const MissingSupabaseConfig = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-6">
    <div className="max-w-xl rounded-lg border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-foreground mb-3">
        Supabase setup needed
      </h1>
      <p className="text-muted-foreground mb-4">
        Create a local .env file with your Supabase project URL and anon key, then restart the dev server.
      </p>
      <pre className="rounded bg-muted p-4 text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://izurditwuynxvkioubqi.supabase.co
VITE_SUPABASE_ANON_KEY=your-real-anon-key`}
      </pre>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {isSupabaseConfigured ? (
        <BrowserRouter>
          <Routes>
          {/* Public & User Routes */}
          <Route element={<MainLayout />}>            
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/programs" element={<Programs />} />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookSession />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Admin Routes */}
          <Route element={<AdminLayout />}>          
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <AdminRoute>
                  <AdminPrograms />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/trainers"
              element={
                <AdminRoute>
                  <AdminTrainers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/slots"
              element={
                <AdminRoute>
                  <AdminSlots />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/view_users"
              element={
                <AdminRoute>
                  <ViewUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/view_trainers"
              element={
                <AdminRoute>
                  <ViewTrainers />
                </AdminRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <MissingSupabaseConfig />
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
