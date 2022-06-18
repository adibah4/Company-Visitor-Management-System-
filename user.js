let users;
const bcrypt = require('bcryptjs');

class User {
	static async injectDB(conn) {
		users = await conn.db("Company-VMS").collection("staff")
	}

    //Password hashing by using bycrypt
	static async register(username, password, id, name, ic, contact, role) {
		return users.findOne({        
			'username': username,    
			}).then(async user =>{
		   		if (user) {
					if ( user.username == username ){
			 			return "username already existed"
					}
		 		else if (user.icNumber == ic){
			  		return "staff ic existed"
				}
		   		}
		   		else{
					// TODO: Save user to database
					const salt = await bcrypt.genSalt(10);
					const hashed = await bcrypt.hash(password, salt)
					await users.insertOne({
					username			: username,
					password			: hashed,
					"Staff ID"        	: id, 
					"Staff Name" 	  	: name,
					"Staff Ic Number" 	: ic,
					"Staff Contact"   	: contact,
					role 				: role
					});

					return "new staff registered"
				}
			})
	}
    
    static async login(username, userpassword) {
        // TODO: Check if username exists
        return users.findOne({         
            'username' : username
        }).then(async user =>{
    
        // TODO: Validate password,username
        if (user) {
            if(user.password != userpassword){
                return "invalid password";
            }
            
            // TODO: Return user object
            else{
                return "Login Staff Success";
            }
        }
    
        else{
            return "invalid username";
        }    
        })
    }

	//TODO : To update data into database
	static async update(username) {
		return users.findOne({
			'username' : username
		}).then(async user =>{
		//console.log(user)

		if (user){
		return users.updateOne({ 
			'username' : username},
			{"$set" : {"Staff contact" : "0177116063"}
		}).then(result => {
			//console.log(result)
		})
		}
		else {
			return "username is not match"
		}
		})
	}

    //TODO : To delete data from database
	static async delete (username){
    	return users.findOne({
      		'username' : username,
    	}).then(async user =>{

		if (user){
			if (user.username == username){
				await users.deleteOne({username:username})
					return "delete data successfully"
			}
		}
		else {
			return "staff doesn't exist"
		}
  	    })
	}

	//TODO : To view the data
	static async view(username){
		const exist= await users.findOne({username: username})
		   	if(exist){
				const user= await users.findOne(
			   	{username : username}
			   	).then(result=>{ 
					//console.log(result)
				})
			   	return exist
		   	}
		   	
			else{
			 	return "Username cannot be found"
			}
	}
}

module.exports = User;