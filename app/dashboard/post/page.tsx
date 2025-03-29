"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Image as ImageIcon,
  Link as LinkIcon,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  caption: z.string().max(2200, "Instagram captions are limited to 2,200 characters"),
  imageUrl: z.string().url("Please enter a valid image URL").optional(),
  link: z.string().url("Please enter a valid URL").optional(),
  scheduledDate: z.date(),
  scheduledTime: z.string(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
});

const PLATFORM_LIMITS = {
  instagram: 2200,
  facebook: 63206,
  twitter: 280,
  linkedin: 3000,
};

interface PlatformPreview {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.FC<PreviewProps>;
}

interface PreviewProps {
  caption: string;
  imageUrl?: string;
  link?: string;
  characterLimit: number;
}

const InstagramPreview: React.FC<PreviewProps> = ({ caption, imageUrl }) => (
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" />
      <div className="text-sm font-medium">Your Hotel</div>
    </div>
    {imageUrl && (
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      </div>
    )}
    <p className="text-sm">{caption}</p>
  </div>
);

const FacebookPreview: React.FC<PreviewProps> = ({ caption, imageUrl, link }) => (
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-600" />
      <div className="text-sm font-medium">Your Hotel</div>
    </div>
    <p className="text-sm mb-3">{caption}</p>
    {imageUrl && (
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      </div>
    )}
    {link && (
      <div className="border rounded bg-gray-50 overflow-hidden">
        <div className="p-3">
          <div className="text-xs text-gray-500 mb-1">{new URL(link).hostname}</div>
          <div className="text-sm font-medium">Link Preview Title</div>
        </div>
      </div>
    )}
  </div>
);

const TwitterPreview: React.FC<PreviewProps> = ({ caption, imageUrl, link }) => (
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-400" />
      <div className="text-sm font-medium">Your Hotel</div>
    </div>
    <p className="text-sm mb-3">{caption}</p>
    {imageUrl && (
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      </div>
    )}
    {link && (
      <div className="text-sm text-blue-500">{link}</div>
    )}
  </div>
);

const LinkedInPreview: React.FC<PreviewProps> = ({ caption, imageUrl, link }) => (
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-700" />
      <div className="text-sm font-medium">Your Hotel</div>
    </div>
    <p className="text-sm mb-3">{caption}</p>
    {imageUrl && (
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      </div>
    )}
    {link && (
      <div className="border rounded bg-gray-50 overflow-hidden">
        <div className="p-3">
          <div className="text-xs text-gray-500 mb-1">{new URL(link).hostname}</div>
          <div className="text-sm font-medium">Link Preview Title</div>
          <p className="text-xs text-gray-500 mt-1">Link description will appear here...</p>
        </div>
      </div>
    )}
  </div>
);

const platforms: PlatformPreview[] = [
  {
    id: "INSTAGRAM",
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    component: InstagramPreview,
  },
  {
    id: "FACEBOOK",
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    component: FacebookPreview,
  },
  {
    id: "TWITTER",
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    component: TwitterPreview,
  },
  {
    id: "LINKEDIN",
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    component: LinkedInPreview,
  },
];

export default function PostPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState("instagram");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      imageUrl: "",
      link: "",
      scheduledDate: new Date(),
      scheduledTime: "09:00",
      platforms: [],
    },
  });

  const watchCaption = form.watch("caption");
  const watchImageUrl = form.watch("imageUrl");
  const watchLink = form.watch("link");

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
    form.setValue("platforms", selectedPlatforms);
  };

  const getCharacterCount = (text: string) => {
    return text ? text.length : 0;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Scheduling post:", values);
    const formattedData = {
      ...values,
      scheduledDate: values.scheduledDate ? format(new Date(values.scheduledDate), "yyyy-MM-dd") : null, // Convert date to string
    };
  
    fetch("/api/schedule-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
  };

  const PreviewComponent = platforms.find(p => p.id === previewPlatform)?.component || InstagramPreview;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Create Post</h1>
        <p className="text-black">
          Create and schedule your social media content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="caption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caption</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your post caption..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <div className="text-xs text-muted-foreground">
                            {getCharacterCount(field.value)} / {PLATFORM_LIMITS[previewPlatform as keyof typeof PLATFORM_LIMITS]} characters
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="Enter image URL" {...field} />
                              <Button variant="outline" size="icon">
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (optional)</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="Enter URL" {...field} />
                              <Button variant="outline" size="icon">
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Platforms</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                          <Button
                            key={platform.id}
                            variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                            onClick={() => togglePlatform(platform.id)}
                            type="button"
                          >
                            {platform.icon}
                            <span className="ml-2">{platform.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  type="time"
                                  {...field}
                                />
                                <Button variant="outline" size="icon">
                                  <Clock className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-purple-800 text-white hover:bg-purple-700">Schedule Post</Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={previewPlatform} onValueChange={setPreviewPlatform}>
                <TabsList className="grid grid-cols-4 w-full">
                  {platforms.map((platform) => (
                    <TabsTrigger key={platform.id} value={platform.id}>
                      {platform.icon}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {platforms.map((platform) => (
                  <TabsContent className="text-black" key={platform.id} value={platform.id}>
                    <platform.component
                      caption={watchCaption}
                      imageUrl={watchImageUrl}
                      link={watchLink}
                      characterLimit={PLATFORM_LIMITS[platform.id as keyof typeof PLATFORM_LIMITS]}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}