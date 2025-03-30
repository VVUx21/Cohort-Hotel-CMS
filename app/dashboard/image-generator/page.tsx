'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt is too long'),
  userId: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

type User = {
  id: string
  email: string
  name: string
  hasPaid: boolean
  isAdmin: boolean
}

export default function AIImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      userId: ''
    },
  })

  // Fetch user data from the database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = form.getValues().userId;
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [form.watch('userId')]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    
    // Create preview for selected image
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  async function onSubmit(values: FormValues) {
    try {
      setIsGenerating(true)
      setImageUrl(null)
      
      // Determine which API endpoint to use based on whether a file is selected
      if (selectedFile) {
        // Create FormData for multipart/form-data request when we have a file
        const formData = new FormData()
        formData.append('prompt', values.prompt)
        formData.append('image', selectedFile)
        if (values.userId) {
          formData.append('userId', values.userId)
        }
        
        const response = await fetch('/api/generate-image-with-reference', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, the browser will set it with the boundary
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to generate image with reference')
        }

        const data = await response.json()
        
        if (!data.image) {
          throw new Error('No image data received')
        }
        const imageDataUrl = `data:image/png;base64,${data.image}`
        setImageUrl(imageDataUrl)
        
        toast.success('Image generated with reference successfully!')
      } else {
        // Original flow for text-only prompt
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: values.prompt,
            userId: values.userId 
          }),
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
      }
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
            Enter a detailed description and optionally upload a reference image for better results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User ID input field */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your user ID to unlock premium features"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          // Trigger user data fetch when field is filled and blurred
                          if (e.target.value) {
                            form.trigger('userId');
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your user ID to access premium features
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              
              {/* File upload section */}
              <div className="space-y-2">
                <FormLabel htmlFor="image-upload">Reference Image (Optional)</FormLabel>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <FormDescription className="mt-1">
                      Upload an image to use as a reference for style or content.
                    </FormDescription>
                  </div>
                  
                  {/* Preview section */}
                  {filePreview && (
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={filePreview}
                          alt="Selected reference image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedFile ? 'Generating with Reference...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedFile ? 'Generate with Reference Image' : 'Generate Image'}
                  </>
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
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {/* Download Button - Always visible */}
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

                {/* Premium features - Only visible if user has paid */}
                {(
                  <>
                    <Button variant="outline" onClick={() => window.location.href = "https://image-editor-blush-nine.vercel.app/"}>
                      Edit Image
                    </Button>

                    <Button variant="outline" onClick={() => window.location.href = "https://figma-clone-hg8y.vercel.app/"}>
                      Design Image
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p>
            {selectedFile
              ? "The AI will generate an image based on your text description and reference image."
              : "The AI will generate an image based on your text description. Upload a reference image for more targeted results."}
          </p>
          {user ? (
            user.hasPaid ? (
              <p className="mt-2 text-green-600">
                Premium features unlocked: You have access to Edit and Design tools.
              </p>
            ) : (
              <p className="mt-2 text-amber-600">
                Upgrade to premium to unlock Edit and Design features.
              </p>
            )
          ) : form.watch('userId') ? (
            isLoading ? (
              <p className="mt-2 text-blue-600">Checking subscription status...</p>
            ) : (
              <p className="mt-2 text-red-600">
                User not found or invalid ID. Please check your ID.
              </p>
            )
          ) : (
            <p className="mt-2">
              Enter your user ID to check premium feature availability.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}