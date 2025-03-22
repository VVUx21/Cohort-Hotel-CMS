import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-white text-black">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-700">Welcome to your social media command center</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">128</div>
            <p className="text-xs text-gray-700">+14% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">4.28%</div>
            <p className="text-xs text-gray-700">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Followers</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">2,842</div>
            <p className="text-xs text-gray-700">+180 new followers</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Scheduled Posts</CardTitle>
            <Calendar className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">24</div>
            <p className="text-xs text-gray-700">For next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-black">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-between bg-purple-600 text-white hover:bg-purple-700">
              <Link href="/dashboard/post">
                Create New Post <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between bg-purple-600 text-white hover:bg-purple-700">
              <Link href="/dashboard/schedule/scheduled-posts">
                View Schedule<ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-black">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New post published on Instagram",
                  time: "2 hours ago",
                  engagement: "124 likes",
                },
                {
                  title: "Schedule updated for next week",
                  time: "5 hours ago",
                  engagement: "12 posts scheduled",
                },
                {
                  title: "Facebook post engagement spike",
                  time: "1 day ago",
                  engagement: "324 interactions",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-100"
                >
                  <div>
                    <p className="font-medium text-black">{activity.title}</p>
                    <p className="text-sm text-gray-700">{activity.time}</p>
                  </div>
                  <p className="text-sm font-medium text-black">{activity.engagement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
