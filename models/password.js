import PasswordValidator from "password-validator"; 

// create schema 
let passwordSchema = new PasswordValidator()

// add properties 
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(16)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()  
.has().symbols()  
export default passwordSchema
