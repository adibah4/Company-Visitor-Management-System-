const supertest = require('supertest');
const request   = supertest('http://localhost:3000');

const jwt = require('jsonwebtoken');

const { faker }    = require ('@faker-js/faker');
const { response } = require('express');

//FAKER FOR STAFF
const fusername    = faker.internet.userName();
const fpass        = faker.internet.password();
const fid          = faker.random.numeric(5);
const fname        = faker.name.findName();
const ficNumber    = faker.random.numeric(12);
const fcontact     = faker.phone.phoneNumber();

//FAKER FOR CLIENT
const Cid          = faker.random.numeric(4);
const Cname        = faker.name.findName();
const Cage         = faker.random.numeric(2);
const Cgender      = faker.name.gender(true);
const Ccontact     = faker.phone.phoneNumber();
const Ccompany     = faker.company.companyName();
const CidApp       = faker.random.numeric(4);
const Cdate        = faker.date.soon();
const Ctime        = faker.datatype.datetime();



function generateAccessToken(payload) {
    return jwt.sign(payload, "secretkey", {expiresIn:'1h'});
}


describe('Express Route Test', function () {

    //STAFF LOGIN 
    it('STAFF LOGIN SUCCESSFULLY', async () => {
        return request
        .post('/login/staff')
        .send({username: "Carmine14", password: "$2a$10$m1haioUUeE0D4JeTFkkw9ufu8rZKZKq4iaT5wd9lta.V0P90wsF5q" })
        .expect('Content-Type', /text/)
        .expect(200).then(response => {
            expect(response.text).toEqual("Login Staff Success")
        });
    });

    //STAFF LOGIN FAILED
    it('STAFF LOGIN FAILED', async () => {
        return request
        .post('/login/staff')
        .send({username: "Megane96", password: "1235" })
        .expect('Content-Type', /text/)
        .expect(404).then(response => {
            expect(response.text).toEqual("invalid password");
        });
    })

    //STAFF REGISTER
    it('STAFF REGISTER', async()=>{
        return request
        .post('/register/staff')
        .send({username : fusername, password : fpass, id : fid, name : fname, ic : ficNumber, contact : fcontact, role : "staff"})
        .expect(200)
    }); 
    
    //STAFF DELETE
    it('STAFF DELETE', async () => {
        return request
        .delete('/delete/staff')
        .send({username: 'Fabiola9'})
        .expect(200)
    });

    //SECURITY LOGIN
    it('SECURITY LOGIN SUCCESSFULLY', async () => {
        return request
        .post('/login/security')
        .send({usernameSecurity: "abdul a", passwordSecurity: "abdul167" })
        .expect('Content-Type', /text/)
        .expect(200).then(response => {
            expect(response.text).toEqual("Login Security Success")
        });
    });

    //REGISTER CLIENT
    it('CLIENT REGISTER SUCCESSFULLY', async()=>{
        return request
        .post('/register/visitors')
        .send({idClient : Cid, nameClient : Cname, age : Cage, gender : Cgender, contactClient : Ccontact, company : Ccompany, idApp : CidApp, date : Cdate, time : Ctime, purpose : "meeting"})
        .expect(200) 
    });

    //UPDATE CLIENT DATE
    it('UPDATE DATE', async () => {
        return request
        .patch('/update/visitor/date')
        .send({name: 'ainin', date:"9/9/2022"})
        .expect(200)
    });

    //UPDATE CLIENT TIME
    it('UPDATE TIME', async () => {
        return request
        .patch('/update/visitor/time')
        .send({name: 'ainin', time:"9.00AM"})
        .expect(200)
    });

    //UPDATE CLIENT PURPOSE
    it('UPDATE PURPOSE', async () => {
        return request
        .patch('/update/visitor/purpose')
        .send({name: 'ainin', time: "Hi-Tea"})
        .expect(200)
    });

    //DELETE CLIENT
    it('DELETE CLIENT', async () => {
    return request
        .delete('/delete/visitor')
        .send({name: 'Zafirah'})
        .expect(200)
    });
})

function verifyToken(req, res, next){
    const authHeader=req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, "secretkey", (err,user)=>{
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
