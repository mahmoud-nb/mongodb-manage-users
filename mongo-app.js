require('dotenv').config()
const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGO_URL)

async function main () {
    await client.connect()
    console.log('Conection OK!')

    // Création de la base
    const db = client.db('asks')
    
    // Création de la collaction
    const collection = db.collection('documents')

    // Create
    try { 
        const insertData = await collection.insertMany([
            { ask : "Ask 1" },
            { ask : "Ask 2" },
        ])
        console.log('Documents inserés', insertData)
    } catch(error) { throw error }

    // # Read
    // const findData = await collection.findOne({ ask : "Ask 1" })
    // const findMultipleData = await collection.find({ ask : "Ask 1" })

    // # Update
    // const updateData = await collection.updateOne({ ask : "Ask 1" }, { $set: { ask : "Ask 11" } })
    // const updateData = await collection.updateMany({ ask : "Ask 1" }, { $set: { ask : "Ask 11" } })

    // # Delete
    // const updateData = await collection.deleteOne({ ask : "Ask 1" })
    // const updateData = await collection.deleteMany({ ask : "Ask 1" })

    return 'done!'
}

main().then(console.log).catch(console.error).finally(() => client.close())

