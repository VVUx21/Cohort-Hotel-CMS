'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt is too long'),
})

type FormValues = z.infer<typeof formSchema>

export default function AIImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsGenerating(true)
      setImageUrl(null)
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: values.prompt }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate image')
      }

      const data = await response.json()
      
      if (!data.image) {
        throw new Error('No image data received')
      }
      const imageDataUrl = `data:image/png;base64,${data.image}`
      setImageUrl(imageDataUrl)
      
      toast.success('Image generated successfully!')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>AI Image Generator</CardTitle>
          <CardDescription>
            Enter a detailed description and our AI will generate an image for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the image you want to generate..."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific and detailed for better results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </Button>
            </form>
          </Form>

          {imageUrl && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Generated Image</h3>
              <div className="rounded-md overflow-hidden border border-gray-200 w-full">
                <img 
                  src={imageUrl} 
                  alt="Generated AI image" 
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-4">
              {/* Download Button */}
              <Button
                variant="outline"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = `ai-generated-image-${Date.now()}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Download Image
              </Button>

              <Button variant="outline" onClick={() => window.location.href = "https://image-editor-blush-nine.vercel.app/"}>
                Edit Image
              </Button>

              {/* Image Designer Button */}
              <Button variant="outline" onClick={() => window.location.href = "https://figma-clone-hg8y.vercel.app/"}>
                Design Image
              </Button>
            </div>

            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p>
            The AI will generate an image based on your text description. Results may vary.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}