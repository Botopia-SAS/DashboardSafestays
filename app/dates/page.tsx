import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Lock } from "lucide-react";

export default async function DatesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg p-12 border border-border shadow-sm">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary playfair-display-sc mb-4">
              Feature Locked
            </h1>
            <p className="text-muted-foreground mb-6">
              This feature is not available in the demo version. Upgrade to access calendar management
              and booking date controls.
            </p>
            <div className="bg-accent/50 rounded-lg p-4 border border-accent">
              <p className="text-sm text-accent-foreground font-medium">
                Demo Version
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
