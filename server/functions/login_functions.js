import {hash} from './sha256.js'
import pool from './pool.js'

class Login
{
    updateInfo(email, password)
    {
        this.email = email;
        this.password = password;
    }

    async checkCredentials()
    {
        const pass = hash(this.password);
        const storedPassword = await this.#getPassword();
        return storedPassword && storedPassword === pass;
    }

    async getProfile()
    {
        try{
            const [rows] = await pool.query("SELECT * from users where email = ?", [this.email])
            return rows.length > 0 ? rows[0] : null;
        }
        catch (error) {
            console.error("Error in getProfile:", error);
            return null;
        }
    }

    async #getPassword()
    {
        try {
            const [rows] = await pool.query("SELECT password from users where email = ? LIMIT 1", [this.email])
            return rows.length > 0 ? rows[0].password : null;
        } catch (error){
            console.error("Error in getPassword:", error);
            return null; // if user does not exist, there won't be a password to find 
        } 
    }
}

export default Login;