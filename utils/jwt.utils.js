
import jwt from "jsonwebtoken" 
const JWT_SIGN_SECRET = '<JWT_SIGN_TOKEN>'
const generateTokenForUser = function(userData) {
    // @ts-ignore
    return jwt.sign({
        userId: userData.id,
        isAdmin:userData.isAdmin
    
    }, JWT_SIGN_SECRET, { expiresIn:'24h'})

}

const parseAuthorization = function (authorization) {

    return (authorization != null) ? authorization.replaceAll('Bearer ', '') : null
    // remplace bearer par le vide juste pour recup le token

}

// recup le userID via une
const getUserId = function (authorization) {
    let userId = -1;
    let token = parseAuthorization(authorization)
    //console.log('--------TOKEN----------: ',token);
    if (token != null)
    {
    try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          // @ts-ignore
        userId = jwtToken.userId;
        } catch(err) { }
    }
    return userId;
}



export { generateTokenForUser, parseAuthorization, getUserId }