const MongoClient   = require("mongodb").MongoClient;
const Visitor       = require("./visitor")

describe("CLIENT DETAILS", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.o5rxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

    test("New Client registration", async () => {
        const res = await Visitor.VisitorRegister("987654", "husna " ,"23" ,"female","0198763456","semegah holding","7654","13/09/2022","7:00","Submit Proposal")
        expect(res).toBe("new client registered")
    })

    test("UPDATE DATE", async()=>{
        const res = await Visitor.updatedate("ainin", "22/08/2022")
        expect(200)
    })

    test("UPDATE TIME", async()=>{
        const res = await Visitor.updatetime("ainin", "15:00")
        expect(200)
    })

    test("UPDATE PURPOSE", async()=>{
        const res = await Visitor.updatepurpose("ainin", "dinner")
        expect(200)
    })

    test("DELETE", async () => {
        const res = await Visitor.delete("Zafirah")
        expect(200)
    });
})
