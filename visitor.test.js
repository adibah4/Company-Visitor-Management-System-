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
        const res = await Visitor.VisitorRegister("111111", "Zafirah" ,"34" ,"female","0177116063","semegah holding","7654","23/09/2022","7:00","Submit Proposal")
        expect(res).toBe("new client registered")
    })

    test("View",  async () => {
        const res = await Visitor.vwvisitor("syakirah")
        expect(res.username).toBe("syakirah")
    })

    test("No visitor", async () => {
        const res = await Visitor.viewvisitor("dibah")
        expect(res).toBe("Username cannot be found")
    })
    
    test("UPDATE DATE", async()=>{
        const res = await Visitor.updatedate("ainin", "22/08/2022")
        expect(res).toBe("Date updated")
    })

    test("UPDATE TIME", async()=>{
        const res = await Visitor.updatetime("ainin", "15:00")
        expect(res).toBe("Time updated")
    })

    test("UPDATE PURPOSE", async()=>{
        const res = await Visitor.updatepurpose("ainin", "dinner")
        expect(res).toBe("Purpose updated")
    })

    test("DELETE", async () => {
        const res = await Visitor.delete("Ameer")
        expect(res).toBe("delete data successfully")
    });
})