// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      )
    }
    
    // Make a request to your Gemini image generation service
    const response = await fetch('https://gemini-imagegen.onrender.com/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { message: errorData.message || 'Failed to generate image' },
        { status: response.status }
      )
    }
    
    // Get the JSON response that contains the base64-encoded image
    const data = await response.json()
    
    if (!data.image) {
      return NextResponse.json(
        { message: 'No image data received from generation service' },
        { status: 500 }
      )
    }
    
    // Return the base64-encoded image
    return NextResponse.json({ image: data.image })
  } catch (error) {
    console.error('Error in image generation API route:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}