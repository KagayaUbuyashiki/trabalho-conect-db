import express, {Response} from 'express'
import cors from 'cors'
import { login } from './controllers/authController'
import { AuthRequest, verifyJWT } from './middleware/authMiddleware'
import z from 'zod'
import { validate } from './services/validate'
import { getProducts} from './controllers/productController'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors())

const corsOptions = {
    origin: "*",
}

app.use(cors(corsOptions))

const schemaLogin = z.object({
    email: z.email(),
    password: z.string().min(8, 'Mínimo 8 caracteres.')
})

export type TLogin = z.infer<typeof schemaLogin>

app.get('/', (req, res) => {
    res.status(200).json({ message: "Servidor rodando!" })
})

app.post('/login', validate(schemaLogin), login)

app.get('/perfil', verifyJWT, (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: `Seja bem vindo! Seu id é ${req.userId}` })
})

app.get('/users', (req, res) => {
    // return res.status(400).json({ message: "Não habilitado!" })
    res.status(200).json({
        data: {
            infos: {
                users: [
                    { name: "Daniel", age: 35 },
                    { name: "Joel", age: 45 }
                ]
            }
        }
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})

app.get('/produtos', getProducts) 
