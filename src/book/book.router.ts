import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as BookService from "./book.service"

export const bookRouter = express.Router();
// GET: List of all books
bookRouter.get("/", async (request: Request, response: Response) => {
    try {
        const books = await BookService.listBooks();
        return response.status(200).json(books);
    } catch (error: any) {
        return response.status(400).json(error.message)
    }
})

// GET: A single book by ID
bookRouter.get("/:id", async (request: Request, response: Response) => {
    try {
        const id: number = parseInt(request.params.id, 10);
        const book = await BookService.getBook(id);
        if (book) {
            return response.status(200).json(book);
        }
        return response.status(404).json("Book could not be found");

    } catch (error: any) {
        return response.status(500).json(error.message)
    }
})

// POST
bookRouter.post("/", body("title").isString(), body("authorId").isInt(), body("datePublished").isDate().toDate(), body("isFiction").isBoolean(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const book = request.body;
        const newBook = await BookService.createBook(book)

        if (book) {
            return response.status(201).json(newBook);
        }
        return response.status(404).json("book could not be found")

    } catch (error: any) {
        return response.status(400).json(error.message);
    }
})

// PUT: Updating an Book
bookRouter.put("/:id", body("title").isString(), body("authorId").isInt(), body("datePublished").isDate().toDate(), body("isFiction").isBoolean(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const id: number = parseInt(request.params.id, 10);
        const book = request.body;
        const updatedBook = await BookService.updatedBook(book, id);
            return response.status(200).json(updatedBook);
        
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

bookRouter.delete("/:id", async(request:Request, response:Response)=>{
    const id = parseInt(request.params.id, 10);
    try {
        const deletedBook= await BookService.deleteBook(id);
        return response.status(204).json("Book has been successfully deleted");
    } catch (error:any) {
        return response.status(500).json(error.message); 
    }
})