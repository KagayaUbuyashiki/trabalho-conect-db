import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodObject} from 'zod'

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new Error('Teste de mensagem!!!')

      await schema.parseAsync(req.body)
      throw new Error('Teste de mensagem!!!')
      next()
    } catch (error) {
      if(error instanceof ZodError){
        const parsedError = error.issues.map(err => ({
          field: err.path[0],
          message: err.message
        }))

        return res.status(400).json({
          message: 'Erro de validação',
          fields: parsedError
        })
      }

      return res.status(500).json({ message: 'Servidor indisponível. Tente novamente mais tarde !'})
      
    }
  }
}