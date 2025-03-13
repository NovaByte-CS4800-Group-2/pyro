import NextAuth from "next_auth"; 
import GoogleProvider from "next-auth/providers/google"; 
// Here is where we can add different providers

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        }), 
        // Add other providers here 
    ], 
    adapter: PrismaAdapter(prisma), 
    session: {
        strategy: 'database', 
    }, 
    pages: {
        signIn: '../../../app/log-in', 
    }, 
    callbacks: {
        async session({ session, user}){
            session.user.id = user.id // add user ID to the session
            return session; 
        },
    },
});