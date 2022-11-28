import {db} from "../utils/db.server";
import type {Author} from "../author/author.service"
type BookRead = {
    id: number;
    title: string;
    datePublished: Date;
    isFiction: boolean;
    autor: Author;
    // authorId: number;
};

type BookWrite = {
    title: string;
    datePublished: Date;
    authorId: number;
    isFiction: boolean;

}

export const listBooks = async (): Promise<BookRead[]> => {
    return db.book.findMany({
        select: {
            id: true,
            title: true,
            datePublished: true,
            isFiction: true,
            autor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    })
}

export const getBook = async(id: number): Promise<BookRead | null>  => {
    return db.book.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            datePublished: true,
            isFiction: true,
            autor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            } 
        }
    })
}
export const createBook = async (book:BookWrite): Promise<BookRead> => {
    const {title, authorId, datePublished, isFiction} = book;
    const parseDate: Date = new Date(datePublished);
    return db.book.create({
        data: {
            title,
            authorId,
            isFiction,
            datePublished: parseDate,
        },
        select: {
            id: true,
            title: true,
            datePublished: true,
            isFiction: true,
            autor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            } 
        }
    })
}

export const updatedBook =async (book:BookWrite, id:number): Promise<BookRead> => {
    const {title, authorId, datePublished, isFiction} = book;
    return db.book.update({
        where: {
            id,
        },
        data: {
            title,
            isFiction,
            datePublished,
            authorId,
        },
        select: {
            id: true,
            title: true,
            datePublished: true,
            isFiction: true,
            autor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            } 
        }
    })
}



export const deleteBook =async (id:number): Promise<void> => {
    await db.book.delete({
        where: {
            id,
        }
    })
}