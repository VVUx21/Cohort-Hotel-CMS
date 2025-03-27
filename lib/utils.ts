import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchTwitterUserProfile(accessToken: string) {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
}

export async function postTweet(accessToken: string, text: string) {
  try {
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
      throw new Error('Failed to post tweet');
    }

    return await response.json();
  } catch (error) {
    console.error('Tweet Posting Error:', error);
    throw error;
  }
}