interface Activity {
  id: string;
  title: string;
  time: string;
  type: "booking" | "review" | "message";
}

const activities: Activity[] = [
  { id: "1", title: "New booking for Apartment 204", time: "2 hours ago", type: "booking" },
  { id: "2", title: "5-star review received", time: "5 hours ago", type: "review" },
  { id: "3", title: "Guest message received", time: "1 day ago", type: "message" },
];

export function RecentActivity() {
  const getTypeColor = (type: Activity["type"]) => {
    const colors = {
      booking: "bg-green-100 text-green-700",
      review: "bg-blue-100 text-blue-700",
      message: "bg-purple-100 text-purple-700",
    };
    return colors[type];
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-4 playfair-display-sc">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
            <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(activity.type)}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
