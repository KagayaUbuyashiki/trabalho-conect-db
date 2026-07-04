import { Request, Response } from 'express'
import { db } from '../database/connection'

// GET /produtos (aceitar ?q= para busca por nome, ex: whereILike igual ao exemplo de /users)
export const getProducts = async (req: Request, res: Response) => {
    // TODO: buscar todos os produtos na tabela `produtos`

       try {
        
                const q = req.query.q as string;

        if (q) {
            
            const produtosFiltrados = await db.select('*').from('produtos').whereILike('nome', `%${q}%`);

            console.log({produtosFiltrados})

            return res.status(200).json({ produtosFiltrados });
        }

        const todosProdutos = await db.select('*').from('produtos');
        console.log({todosProdutos})

            return res.status(200).json({ todosProdutos });

    } 
    
    catch (error) {
        return res.status(500).json({ mensagem: 'Não foi possivel receber uma resposta do servidor, ou seja caiu, deu lenha, se danou, se lascou.' });
    }
};



// GET /produtos/:id
export const getProductById = async (req: Request, res: Response) => {
    // TODO: buscar um produto pelo id (req.params.id)

    try {

        const idBusca = req.params.id;

        const produto = await db('produtos').where({ id: idBusca }).first();

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        // Se encontrou, retorna o produto com status 200
        return res.status(200).json(produto);

    } 
    
    catch (error) {
    
        return res.status(500).json({ mensagem: 'Deu erro no servidor, deu b.o, deu lenha' });
    
    }
};


    
    // Se não encontrar, retornar 404


// POST /produtos
export const createProduct = async (req: Request, res: Response) => {
    // TODO: inserir um novo produto (req.body: nome, descricao, preco, quantidade)
}

// PUT /produtos/:id
export const updateProduct = async (req: Request, res: Response) => {
    // TODO: atualizar um produto existente (req.params.id + req.body)
    // Se não encontrar, retornar 404
}

// DELETE /produtos/:id
export const deleteProduct = async (req: Request, res: Response) => {
    // TODO: remover um produto pelo id (req.params.id)
    // Se não encontrar, retornar 404
}
