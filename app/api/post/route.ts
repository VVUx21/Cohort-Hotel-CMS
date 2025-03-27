import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, text } = await request.json();
    console.log('Received accessToken:', accessToken);
    console.log('Received text:', text);

    if (!accessToken || !text) {
      return NextResponse.json(
        { error: 'Access token and tweet text are required' }, 
        { status: 400 }
      );
    }
    const tokenValidationResponse = await fetch('https://api.twitter.com/2/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!tokenValidationResponse.ok) {
        const errorBody = await tokenValidationResponse.text();
        console.error('Access Token Validation Error:', errorBody);

        return NextResponse.json(
            { error: 'Invalid or expired access token', details: errorBody },
            { status: 401 }
        );
    }
    
    if (text.length > 280) {
      return NextResponse.json(
        { error: 'Tweet exceeds 280 character limit' }, 
        { status: 400 }
      );
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Twitter API Error:', errorBody);

      return NextResponse.json(
        { error: 'Failed to post tweet', details: errorBody }, 
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(
      { 
        message: 'Tweet posted successfully',
        tweetId: responseData.data?.id 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected Tweet Posting Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while posting tweet' }, 
      { status: 500 }
    );
  }
}