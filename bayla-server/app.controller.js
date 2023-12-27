const { ObjectId } = require("mongodb");

const api = async (req, res) => {
    console.log("req", req.body.params)
    const payload = req.body
    const action = payload['action'];
    const collection = payload['collection'];
    const params = payload['params'];
    const data = payload['data'];
    if (params['_id']) {
        params['_id'] = new ObjectId(params['_id']);
    }
    if (action == "create") {
        let r = await global.db.collection(collection);
        let newDocument = data;
        newDocument.date = new Date();
        let result = await r.insertOne(newDocument);
        res.send(result).status(200);
    }
    if (action == "get") {
        console.log('start', new Date())
        let r = await global.db.collection(collection);
        let results = await r.find(params)
            .toArray();
        results.map(i => {
            i.value = '';
        })
        console.log('end', new Date())
        console.log(results)
        return res.send(results).status(200);
    }
    if (action == "read") {

        // const id = new ObjectId(params['_id']);
        let r = await db.collection(collection);
        // let query = { _id: id };
        let result = await r.findOne(params);
        console.log(result)
        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
        return;
    }
    if (action == "update") {
        const id = new ObjectId(params['_id']);
        const query = { _id: id };
        let r = await db.collection(collection);
        let result = await r.updateOne(query, { $set: data });
        res.send(result).status(200);
    }
    if (action == "delete") {
        const query = { _id: params['_id'] };
        const r = db.collection(collection);
        let result = await r.deleteOne(query);
        res.send(result).status(200);
    }
}

module.exports = { api }