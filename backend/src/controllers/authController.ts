import { type Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const CHAVE_SECRETA = 'chave_secreta'

export const login = (req: Request, res: Response) => {

    console.log('request', req.body)
    
     return res.status(200).json({ message: 'Apenas visualizando !'})
    const { email, password } = req.body;

    // validar se o usuario existe e sua senha
    if( email === 'teste@usuario.com' && password === 'teste') {
        const userId = 1;

         return res.json({ message: `Esse usuario existe e tem como id ${userId}` })
        // Gerar o token
        const token = jwt.sign(
            { id: userId },
            CHAVE_SECRETA,
            { expiresIn: '1h'}
        )

        return res.json({ auth: true, token })
    }

    return res.status(401).json({ message: 'Credenciais inválidas.'})
}