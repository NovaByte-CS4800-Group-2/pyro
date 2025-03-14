import {SignJWT, jwtVerify} from "jose"; 
import {cookies} from "next/headers"; 
import { NextRequest, NextResponse} from "next/server";

const secretKey = "secret"; 
const key = new TextEncoder().encode(secretKey);

export async function sessionLogin(username: string){
    // Create the session
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ username, expires });

  // Save the session in a cookie
  const cookie = await cookies(); // 
  cookie.set("session", session, { expires, httpOnly: true });
}

export async function sessionLogout(){
	// Destroy the session 
    const cookie = await cookies();
	cookie.set('session','', {expires: new Date(0)});
}

export async function getSession(){ // reading from the cookie and looking for session value

    const cookie = await cookies();
	const session = cookie.get('session')?.value; 
	if (!session) return null; 
	return await decrypt(session);
}

export async function updateSesion(request: NextRequest){ // takes in the web request to look at the cookies
	const session = request.cookies.get("session")?.value; 
	if (!session) return;  // if there's no session, go back 

    // Refresh the session so it doesn't expire 
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);
    const res = NextResponse.next(); 
    res.cookies.set({
        name: "session", 
        value: await encrypt(parsed), 
        httpOnly: true, 
        expires: parsed.expires,
    });
    return res;
}

export async function encrypt(payload: any){
    return await new SignJWT(payload)
        .setProtectedHeader({alg: "H256"})
        .setIssuedAt()
        .setExpirationTime("100 min from now")
        .sign(key) // secret key used for encryption 
}

export async function decrypt(input: string): Promise<any> {
    const {payload} = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

