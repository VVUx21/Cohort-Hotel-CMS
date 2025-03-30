import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as os from 'os';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const prompt = formData.get('prompt');
    const imageFile = formData.get('image') as File | null;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 }
      );
    }

    const tmpDir = os.tmpdir();
    const uniqueId = uuidv4();
    const filePath = join(tmpDir, `${uniqueId}-${imageFile.name}`);

    const fileBuffer = await imageFile.arrayBuffer();
    await writeFile(filePath, new Uint8Array(fileBuffer));

    try {
      const fileData = fs.readFileSync(filePath);
      const base64Image = fileData.toString('base64');

      const response = await fetch('https://gemini-imagegen.onrender.com/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          image: base64Image
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        return NextResponse.json(
          { message: 'Error from image generation service', error: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();

      if (!data.image) {
        return NextResponse.json(
          { message: 'No image generated from the service' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Image generated successfully',
        image: data.image 
      });
    } finally {
    
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Error in generate-image-with-reference:', error);
    return NextResponse.json(
      { message: 'Failed to process image generation request', error: String(error) },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};