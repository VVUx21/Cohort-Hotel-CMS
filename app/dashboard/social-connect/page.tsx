"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Twitter,
  Linkedin,
  RefreshCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  metrics?: {
    followers: number;
    engagement: string;
  };
}

export default function SocialConnectPage() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      connected: false,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      connected: false,
    },
  ]);

  const handleConnect = async (platformId: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId
        ? {
            ...platform,
            connected: true,
            lastSync: "Just now",
            metrics: {
              followers: 1000,
              engagement:"5%"
            },
          }
        : platform
    ));
  };

  const handleDisconnect = async (platformId: string) => {
    // Simulate platform disconnection
    setPlatforms(platforms.map(platform =>
      platform.id === platformId
        ? {
            ...platform,
            connected: false,
            lastSync: undefined,
            metrics: undefined,
          }
        : platform
    ));
  };

  const handleRefreshMetrics = async (platformId: string) => {
    // Simulate metrics refresh
    setPlatforms(platforms.map(platform =>
      platform.id === platformId
        ? {
            ...platform,
            lastSync: "Just now",
          }
        : platform
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Social Media Platforms</h1>
        <p className="text-muted-foreground">
          Connect and manage your social media accounts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  {platform.icon}
                  {platform.name}
                </div>
              </CardTitle>
              <Badge
                variant={platform.connected ? "default" : "secondary"}
                className="ml-auto"
              >
                {platform.connected ? "Connected" : "Not Connected"}
              </Badge>
            </CardHeader>
            <CardContent>
              {platform.connected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="text-2xl font-bold">
                        {platform.metrics?.followers.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-2xl font-bold">{platform.metrics?.engagement}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Last synced: {platform.lastSync}
                    </p>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshMetrics(platform.id)}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-6">
                  <Button onClick={() => handleConnect(platform.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Connect {platform.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}