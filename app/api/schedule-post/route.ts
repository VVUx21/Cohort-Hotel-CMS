import { Platform, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { NextResponse,NextRequest } from 'next/server';

const prisma = new PrismaClient();

const postSchema = z.object({
  caption: z.string().max(2200, "Instagram captions are limited to 2,200 characters"),
  imageUrl: z.string().url("Please enter a valid image URL").optional(),
  link: z.string().url("Please enter a valid URL").optional(),
  scheduledDate: z.string(), 
  scheduledTime: z.string(),
  platforms: z.array(z.string()).min(1, "Select at least one platform") 
});

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    
    const postData = postSchema.parse(body);

    const scheduledPost = await prisma.post.create({
      data: {
        caption: postData.caption,
        imageUrl: postData.imageUrl,
        link: postData.link,
        scheduledAt: new Date(`${postData.scheduledDate}T${postData.scheduledTime}`),
        platform: postData.platforms.map((platform) => platform.toUpperCase() as Platform),
        status: 'SCHEDULED',
        hotelId: '1234',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post scheduled successfully', 
      data: scheduledPost 
    }, { status: 201 });
  } catch (error) {
    console.error('Error scheduling post:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to schedule post' 
    }, { status: 500 });
  }
}