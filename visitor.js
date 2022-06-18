let visitor;

class Visitor {
	static async injectDB(conn) {
		visitor = await conn.db("Company-VMS").collection("visitor")}
    
    //REGISTER CLIENT
    static async VisitorRegister(idClient, nameClient, age, gender, contactClient, company, idApp, date, time, purpose) 
    {
        return visitor.findOne({        
			'nameClient': nameClient,    
			}).then(async user =>{
		   		if (user) {
					if ( user.nameClient == nameClient ){
			 			return "username already existed"
					}
		 		else if (user.idClient == idClient){
			  		return "Client ID existed"
				}
		   		}
		   		else{
					await visitor.insertOne({
                    "Client ID"				: idClient,
                    "Client Name"      		: nameClient,
                    "Client Age"			: age,
                    "Client Gender"			: gender,
                    "Client Contact"		: contactClient,
                    "Client Company" 		: company, 
                      
                    "Appointment ID"		: idApp,
                    "Appointment Date"		: date,
                    "Appointment Time"		: time,
                    "Appointment Purpose"	: purpose,
					});

					return "new client registered"
				}
			})
        }

    //VIEW CLIENT
    static async viewvisitor(nameClient){
        const exist = await visitor.findOne({"Client Name" : nameClient})
            if(exist){
                const user = await visitor.findOne(
                {"Client Name" : nameClient
                })
                return exist
            }
            else{
                return "Username cannot be found"
            }
    }
    
    
    //UPDATE CLIENT DATE
    static async updatedate(nameClient) {
        return visitor.findOne({
			'Client Name' : nameClient
		    }).then(async user =>{
		    //console.log(user)
		    if (user){
		        return visitor.updateOne({ 
			    'Client Name' : nameClient},
		    	{"$set" : {"Appointment Date" : "22/08/2022"}
		    })
		    }
		    else {
			    return "Client is not exist"
		    }
		})  
    }

    //UPDATE CLIENT TIME
    static async updatetime(nameClient) {
        return visitor.findOne({
			'Client Name' : nameClient
		    }).then(async user =>{
		    //console.log(user)

		    if (user){
		        return visitor.updateOne({ 
			    'Client Name' : nameClient},
			
                {"$set" : {"Appointment Time" : "15:00"}}
                )
		    }
		    
            else {
			    return "Client is not exist"
		    }
	    })        
    }

    // //UPDATE CLIENT PURPOSE
    static async updatepurpose(nameClient) {
        return visitor.findOne({
			"Client Name" : nameClient
		    }).then(async user =>{
		    //console.log(user)

		    if (user){
		        return visitor.updateOne({ 
			    "Client Name" : nameClient},
			    {"$set" : {"Appointment Purpose" : "Discussion"}
		        }).then(result => {
			    //console.log(result)
		        })
		    }
		    
            else {
			    return "username is not match"
		    }
		})
    }

    // //DELETE CLIENT
    static async delete(nameClient) {
        return visitor.findOne({
            "Client Name" : nameClient,
            }).then(async user =>{
            //console.log(user)
            
            if (user){
                if (user.nameClient == nameClient){
                    await visitor.deleteOne({"Client Name" : nameClient})
                    return "delete data successfully"
            }
        }
            else {
                return "client is not exist"
            }
        })
    }
}
module.exports = Visitor;