import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World" })
})

app.get('/users', (req, res) => {
    res.status(200).json({
        data: {
            infos: {
                users: [
                    { name: "Daniel", age: 34 }
                ]
            }
        }
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})