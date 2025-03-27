import { NextRequest, NextResponse } from 'next/server';

const calculateEngagement = (followers: number, mediaCount: number): string => {
  if (followers === 0 || mediaCount === 0) return "0%";
  return ((mediaCount / followers) * 100).toFixed(2) + "%";
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get('platform');

  if (!platform) {
    return NextResponse.json({ error: "Platform is required" }, { status: 400 });
  }

  try {
    switch (platform) {
      case "twitter":
        const twitterResponse = await fetch(
          "https://api.twitter.com/2/users/by/username/Bibhuprasa95874", 
          {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${process.env.TWITTER_Bearer_Token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const twitterData = await twitterResponse.json();
        console.log(twitterData);

        return NextResponse.json({
          followers: twitterData});

      default:
        return NextResponse.json(
          { error: "Invalid platform specified" }, 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`Error fetching ${platform} data:`, error);
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}