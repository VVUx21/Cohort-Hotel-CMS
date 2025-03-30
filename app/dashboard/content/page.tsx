"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  hotelStyle: z.string(),
  tone: z.string(),
  keywords: z.string(),
  prompt: z.string().min(10, "Please provide more context for better results"),
  language: z.string().optional(),
});

export default function ContentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    caption?: string;
    hashtags?: string[];
  }>({});
  const [trends, setTrends] = useState<string[]>([]);
  const [promptValue, setPromptValue] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelStyle: "",
      tone: "",
      keywords: "",
      prompt: "",
    },
  });

  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await fetch("https://gemini-imagegen.onrender.com/get-trends"); // Replace with actual API
        const data = await response.json();
        setTrends(data.trends || []);
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    }
    fetchTrends();
  }, []);

  const addTrendToPrompt = (trend: string) => {
    setPromptValue((prev) => (prev ? `${prev}, ${trend}` : trend));
    form.setValue("prompt", promptValue); // Update form value
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const prompt = `You are a caption generator for a hotel social media page. You have to generate a caption based on following keywords: 
      Style of Hotel: ${values.hotelStyle} 
      Tone of Content: ${values.tone} 
      Keywords: ${values.keywords} 
      User prompt: ${values.prompt}
     Generate the required text only and no other things within 4 to 5 lines...no options.. strictly in ${values.language} language 
      `;
      
      const response = await fetch('https://gemini-imagegen.onrender.com/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setGeneratedContent({
        caption: data,
        hashtags: [
          "#LuxuryHotel",
          "#BoutiqueHotel",
          "#HotelLife",
          "#TravelInStyle",
          "#HotelExperience",
          "#LuxuryTravel",
          "#HotelDesign",
          "#TravelGram",
        ]
      });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Content Creation</h1>
        <p className="text-muted-foreground text-black">
          Generate engaging social media content with AI assistance
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4 bg-white text-black">
        <TabsList className="bg-white text-black ">
          <TabsTrigger className="bg-white text-black" value="generate">Generate Content</TabsTrigger>
          <TabsTrigger className="bg-white text-black" value="preview">Preview & Edit</TabsTrigger>
          <TabsTrigger className="bg-white text-black" value="trends">Ongoing Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hotelStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hotel style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="boutique">Boutique</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Tone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-white"
                        placeholder="Enter keywords (e.g., luxury, comfort, view)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                 name="language"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Choose your Languges</FormLabel>
                     <FormControl>
                       <Input
                         type="text"
                         className="bg-white"
                         placeholder="Enter Language (e.g., Hindi, Tamil,Telegu,Kannada)"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Brief</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want to promote or highlight"
                            className="min-h-[100px] bg-white text-black"
                            value={promptValue}
                            onChange={(e) => {
                              setPromptValue(e.target.value);
                              field.onChange(e); 
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              <Button
                type="submit"
                className="w-full md:w-auto bg-purple-800 text-white hover:bg-purple-900"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white text-black">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Generated Caption</h3>
                <div className="space-y-4">
                  <p className="text-sm">{generatedContent.caption}</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="trends">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-100">
              <span className="text-sm font-medium">{trend}</span>
              <Button size="sm" onClick={() => addTrendToPrompt(trend)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>
      </Tabs>
    </div>
  );
}