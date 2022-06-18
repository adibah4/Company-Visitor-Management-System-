let security;

class Security{
    static async injectDB(conn) {
        security = await conn.db("Company-VMS").collection("security")}

    static async logins(usernameSecurity,passwordSecurity){
        return security.findOne({         
            'Security username' : usernameSecurity
        }).then(async user =>{
    
        // TODO: Validate password,username
        if (user) {
            if(user.passwordSecurity != passwordSecurity && user.usernameSecurity != usernameSecurity){
                return "invalid password or username";
            }
        }
    
        else{
            return "Login Security Success";
        }    

        })
    }
}

module.exports = Security;