import NextAuth, { Session } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    provider?: string;
    refreshToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_API_KEY!,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_API_SECRET!,
        version: '2.0',
      authorization: {
        url: 'https://twitter.com/i/oauth2/authorize',
        params: { 
          scope: 'tweet.read users.read tweet.write tweet.moderate.write like.read like.write bookmark.read bookmark.write follows.read follows.write space.read space.write mute.read mute.write list.read list.write media.read media.write',
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Add Twitter-specific tokens to the JWT
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Add Twitter tokens to the session
      session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      session.provider = token.provider as string;
      return session;
    }
  },
});

export { handler as GET, handler as POST };
