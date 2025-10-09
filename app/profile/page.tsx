import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary playfair-display-sc">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings
          </p>
        </div>

        <div className="max-w-3xl">
          <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-primary playfair-display-sc mb-2">
                  {user.email?.split("@")[0]}
                </h2>
                <p className="text-muted-foreground">Dashboard Administrator</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Member since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Account Status</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
