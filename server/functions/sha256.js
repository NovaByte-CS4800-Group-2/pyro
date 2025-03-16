// for testing 
//const {createHash} = require("crypto");

// might mvoe this into loginDatabase.js
import {createHash} from "crypto"

export function hash(string){
    return createHash('sha256').update(string).digest('hex')
}