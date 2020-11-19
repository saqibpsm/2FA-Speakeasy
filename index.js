const express = require('express')
const uuid = require('uuid')
const speakeasy = require('speakeasy')
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')


const app = express()

const db = new JsonDB(new Config('myDatabase', true, false, '/'))

app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to 2 Factor Authentication Example.."
    })
})

// Register user and generate temporary Secret
app.post('/api/register', (req, res) => {
    const id = uuid.v4()
    try {
        const path = `/user/${id}`
        const temp_secret = speakeasy.generateSecret()
        db.push(path, { id, temp_secret} )
        res.json({ id, secret: temp_secret.base32 })
    } catch (err) {
        res.status(500).json({ message: "Error in generating Secret" })
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`))