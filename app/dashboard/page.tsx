import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Building2, Users, Star, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary playfair-display-sc">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.email?.split("@")[0]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Properties"
            value="24"
            icon={Building2}
            trend="+12% from last month"
            trendUp={true}
          />
          <StatsCard
            title="Active Guests"
            value="156"
            icon={Users}
            trend="+8% from last month"
            trendUp={true}
          />
          <StatsCard
            title="Average Rating"
            value="4.8"
            icon={Star}
            trend="Consistent"
          />
          <StatsCard
            title="Revenue"
            value="$52.4K"
            icon={TrendingUp}
            trend="+23% from last month"
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
            <h2 className="text-xl font-bold text-primary mb-4 playfair-display-sc">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-left font-medium">
                Add New Property
              </button>
              <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors text-left font-medium">
                Manage Bookings
              </button>
              <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors text-left font-medium">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
