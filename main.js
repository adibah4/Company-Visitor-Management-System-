const MongoClient = require("mongodb").MongoClient;
const User        = require("./user");
const Visitor     = require("./visitor");
const Security    = require("./security");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.o5rxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true},
	).catch(err => {
	    console.error(err.stack)
	    process.exit(1)
    }).then(async client => {
	    console.log('Connected to MongoDB');
	    User.injectDB(client);
	    Visitor.injectDB(client);
		Security.injectDB(client);
    })

    const express      = require('express');
	const { userInfo } = require ("os");
    const app          = express()
    const port         = process.env.PORT || 3000

    const swaggerUi    = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    const options = {
	    definition: {
		    openapi: '3.0.0',
		    info: {
			    title: 'MyVMS API',
			    version: '1.0.0',
		    },
	},
	apis: ['./main.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//STAFF LOGIN 
app.post('/login/user', async (req, res) => {
	//console.log(req.body)
	let user = await User.login(req.body.username, req.body.password, req.body.id, req.body.name, req.body.ic, req.body.contact, req.body.role)
	if (user == "invalid password" || user == "invalid username"){
		res.status(404).send("Login failed")
	}
	else{
		return res.status(200).json({
			username			: user.username,
			"Staff ID"  		: user.id,
			"Staff Name"		: user.name,
       		"Staff Ic Number"  	: user.ic,
			"Staff Contact"		: user.contact,

			role	: user.role,
			token	: generateAccessToken({
				role: user.role
			}),
		});
	}
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 *         Staff ID:
 *           type: string
 *         Staff Name:
 *           type: string
 *         Staff Ic Number:
 *           type: string
 *         Staff Contact:
 *           type: string
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: Staff Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               Staff ID:
 *                 type: string
 *               Staff Name:
 *                 type: string
 *               Staff Ic Number:
 *                 type: string
 *               Staff Contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login Staff
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */


//REGISTER STAFF
app.post('/register/user', async (req, res) => {
    const reg = await Staff.register(req.body.username, req.body.password, req.body.id, req.body.name, req.body.ic, req.body.contact, req.body.role)
    if(req.user.role == "security"){
      if (reg == "username already existed"){
        return res.status(404).send("The username already existed")
    }
    else if(reg == "staff id existed"){
        return res.status(404).send("The username already existed")
    }
    else{
        return res.status(200).send("New Staff registered")
    }
    }
    else{
      return res.status(403).send('Unauthorized')
    }
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 *         Staff ID:
 *           type: string
 *         Staff Name:
 *           type: string
 *         Staff Ic Number:
 *           type: string
 *         Staff Contact:
 *           type: string
 */

/**
 * @swagger
 * /register:
 *   post:
 *     description: Register Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               Staff ID:
 *                 type: string
 *               Staff Name:
 *                 type: string
 *               Staff Ic Number:
 *                 type: string
 *               Staff Contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register Staff
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */


//DELETE STAFF
app.delete('/delete/user', async (req, res) => {
	const dels = await Staff.delete(req.body.username)
	if(req.user.role == "security"){
		if (dels == "staff is not exist"){
		return res.status(404).send("Staff is not exist")
		}
		else {
		return res.status(200).json({
			status: "staff deleted"
		})
		} 
	}
		else{
		return res.status(403).send('Unauthorized')
		} 
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 */

/**
 * @swagger
 * /delete:
 *   delete:
 *     description: Staff Delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful delete staff
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */

//SECURITY LOGIN
app.post('/login/security', async (req, res) => {
    const sec = await Security.logins(req.body.usernameSecurity, req.body.passwordSecurity, req.body.idSecurity, req.body.nameSecurity, req.body.icSecurity,req.body.contactSecurity, req.body.role)
    if (sec == "invalid password"||sec == "invalid username"){
      return res.status(404).send("wrong password or username")
    }
    else{
        return res.status(200).json({
			//"Security Username" 	: sec.usernameSecurity,
			"Security ID"       	: sec.idSecurity,
		  	"Security Name"     	: sec.nameSecurity,
		  	"Security Ic Number"	: sec.icNumber,
		  	"Security Contact"  	: sec.contactSecurity,

          	role	: sec.role,
          	token	: generateAccessToken({
            	role: sec.role
          	}),
        });
    }
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 *         Security ID:
 *           type: string
 *         Security Name:
 *           type: string
 *         Security Ic Number:
 *           type: string
 *         Security Contact:
 *           type: string
 */

/**
 * @swagger
 * /login/security:
 *   post:
 *     description: Security Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               Security ID:
 *                 type: string
 *               Security Name:
 *                 type: string
 *               Security Ic Number:
 *                 type: string
 *               Security Contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login security
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Security'
 *       401:
 *         description: Invalid username or password
 */


//REGISTER CLIENT 
app.post('/register/visitor', async (req, res) => {
    const regvstr = await Visitor.VisitorRegister(req.body.idClient, req.body.nameClient, req.body.age, req.body.gender, req.body.contactClient, req.body.company, req.body.idApp, req.body.date, req.body.time, req.body.purpose)
    if(req.user.role == "user"){
    	if (regvstr == "client id existed"){
        	return res.status(200).send("client id existed")
    	}
    	else{
    		return res.status(200).send("New client registered")}
    }
    else{
    	return res.status(403).send('Unauthorized')}
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         Client ID:
 *           type: string
 *         Client Name:
 *           type: string
 *         Client Age:
 *           type: string
 *         Client Gender:
 *           type: string
 *         Client Contact:
 *           type: string
 *         Client Company:
 *           type: string
 *         Appointment ID:
 *           type: string
 *         Appointment Date:
 *           type: string
 *         Appointment Time:
 *           type: string
 *         Appointment Purpose:
 *           type: string
 */

/**
 * @swagger
 * /register/visitor:
 *   post:
 *     description: Register Login Client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               Client ID:
 *                 type: string
 *               Client Name:
 *                 type: string
 *               Client Age:
 *                 type: string
 *               Client Gender:
 *                 type: string
 *               Client Contact:
 *                 type: string
 *               Client Company:
 *                 type: string
 *               Appointment ID:
 *                 type: string
 *               Appointment Date:
 *                 type: string
 *               Appointment Time:
 *                 type: string
 *               Appointment Purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register Client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Invalid username or password
 */

//UPDATE CLIENT DATE
app.patch('/update/visitor/date', async (req, res) => {
	const upvstrd = await Visitor.updatedate(req.body.name, req.body.date)
	if(req.user.role == "user"){
	  if (upvstrd == "Client is not exist"){
		return res.status(404).send("client does not exist")
	}
	else{
		return res.status(200).json({
			name	: upvstrd.name,
			Updated	: "Date to visit updated"
	  	})
	}  
	}
	else{
		return res.status(403).send('Unauthorized')
	}
})


/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         Client ID:
 *           type: string
 *         Client Name:
 *           type: string
 *         Client Age:
 *           type: string
 *         Client Gender:
 *           type: string
 *         Client Contact:
 *           type: string
 *         Client Company:
 *           type: string
 *         Appointment ID:
 *           type: string
 *         Appointment Date:
 *           type: string
 *         Appointment Time:
 *           type: string
 *         Appointment Purpose:
 *           type: string
 */

/**
 * @swagger
 * /update/visitor/Date:
 *   patch:
 *     description: Update Client Date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               Client ID:
 *                 type: string
 *               Client Name:
 *                 type: string
 *               Client Age:
 *                 type: string
 *               Client Gender:
 *                 type: string
 *               Client Contact:
 *                 type: string
 *               Client Company:
 *                 type: string
 *               Appointment ID:
 *                 type: string
 *               Appointment Date:
 *                 type: string
 *               Appointment Time:
 *                 type: string
 *               Appointment Purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Date updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Invalid username or password
 */


//UPDATE CLIENT TIME
app.patch('/update/visitor/time', async (req, res) => {
  	const upvstrt = await Visitor.updatetime(req.body.name, req.body.time)
  	if(req.user.role == "user"){
    	if (upvstrt == "Client is not exist"){
      		return res.status(404).send("client does not exist")
  	}
  	else{
    return res.status(200).json({
      	name	: upvstrt.name,
      	Updated	: "Time updated"
    })
  	}  
  	}
  	else{
    	return res.status(403).send('Unauthorized')
  	}
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         Client ID:
 *           type: string
 *         Client Name:
 *           type: string
 *         Client Age:
 *           type: string
 *         Client Gender:
 *           type: string
 *         Client Contact:
 *           type: string
 *         Client Company:
 *           type: string
 *         Appointment ID:
 *           type: string
 *         Appointment Date:
 *           type: string
 *         Appointment Time:
 *           type: string
 *         Appointment Purpose:
 *           type: string
 */

/**
 * @swagger
 * /update/visitor/Time:
 *   patch:
 *     description: Update Client Time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               Client ID:
 *                 type: string
 *               Client Name:
 *                 type: string
 *               Client Age:
 *                 type: string
 *               Client Gender:
 *                 type: string
 *               Client Contact:
 *                 type: string
 *               Client Company:
 *                 type: string
 *               Appointment ID:
 *                 type: string
 *               Appointment Date:
 *                 type: string
 *               Appointment Time:
 *                 type: string
 *               Appointment Purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Time updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Invalid username or password
 */

//UPDATE CLIENT PURPOSE
app.patch('/update/visitor/purpose', async (req, res) => {
	const upvstrp = await Visitor.updatetime(req.body.name,req.body.purpose)
	if(req.user.role=="user"){
		if (upvstrp == "Client is not exist"){
			return res.status(404).send("client does not exist")
	}
	else{
  	return res.status(200).json({
		name: upvstrp.name,
		Updated: "Purpose updated"
  	})
	}  
	}
	else{
	  return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         Client ID:
 *           type: string
 *         Client Name:
 *           type: string
 *         Client Age:
 *           type: string
 *         Client Gender:
 *           type: string
 *         Client Contact:
 *           type: string
 *         Client Company:
 *           type: string
 *         Appointment ID:
 *           type: string
 *         Appointment Date:
 *           type: string
 *         Appointment Time:
 *           type: string
 *         Appointment Purpose:
 *           type: string
 */

/**
 * @swagger
 * /update/visitor/Purpose:
 *   patch:
 *     description: Update Client Purpose
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               Client ID:
 *                 type: string
 *               Client Name:
 *                 type: string
 *               Client Age:
 *                 type: string
 *               Client Gender:
 *                 type: string
 *               Client Contact:
 *                 type: string
 *               Client Company:
 *                 type: string
 *               Appointment ID:
 *                 type: string
 *               Appointment Date:
 *                 type: string
 *               Appointment Time:
 *                 type: string
 *               Appointment Purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purpose updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Invalid username or password
 */

//DELETE CLIENT
app.delete('/delete/visitor', async (req, res) => {
	const del = await Visitor.delete(req.body.name)
	if(req.user.role == "user"){
	  if (del == "client is not exist"){
		return res.status(404).send("client is not exist")
	}
	else {
		return res.status(200).json({
			status: "delete data from collection"
		})
	} 
	}
	else{
		return res.status(403).send('Unauthorized')
	 
	} 
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         Client ID: 
 *           type: string
 *         Client Name: 
 *           type: string
 */

/**
 * @swagger
 * /delete/visitor:
 *   delete:
 *     description: Client Deleted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               Client ID: 
 *                 type: string
 *               Client Name: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful delete client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Invalid username or password
 */


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' });
}

//only authorized person can access
app.use((req, res, next)=>{
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
  
	jwt.verify(token, "secretkey", (err,user)=>{
		console.log(err)
	  	if (err) return res.sendStatus(403)
	  		req.user = user
		next()
	})
});