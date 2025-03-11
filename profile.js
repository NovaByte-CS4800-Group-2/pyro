// make functions to update each and then use them here
// this way, we can use them all in this one
// !!! there willl probably be an error if you try to run this but im working on it!

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise() // allows to use promise API version of MYSQL instead of having to use coolback version


async function createProfile (username, name, email, zipCode, password, businessAccount){
    try{
        await pool.query("INSERT into users username, name, email, password, zip_code, business_account ?, ?, ?, ?, ?, ?")
    }
    catch (error){
        console.log(error)
    }
}

async function getProfile(username){
    try{
        const [rows] = await pool.query("SELECT * from users where username = ?", [username])
        return rows
        console.log(rows)
    }
    catch (error) {
        console.log(error)
    }
}
