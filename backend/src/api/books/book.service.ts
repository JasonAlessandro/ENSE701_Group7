import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookService {
    private books = []; // Simulating a database

    async create(createBookDto: CreateBookDto) {
        const newBook = { ...createBookDto, id: Date.now().toString(), moderation: 'pending' };
        this.books.push(newBook);
        return newBook;
    }
    
    async findAll() {
        return this.books.filter(book => book.moderation === 'accepted'); // Return only accepted books
    }
    
    async findPending() {
        return this.books.filter(book => book.moderation === 'pending'); // Return only pending books
    }

    async update(id: string, updateDto: Partial<CreateBookDto>) {
        const book = this.books.find(book => book.id === id);
        if (book) {
            Object.assign(book, updateDto); // Update the book properties
            return book;
        }
        throw new Error('Book not found');
    }

    async accept(id: string) {
        const book = this.books.find(book => book.id === id);
        if (book) {
            book.moderation = 'accepted'; // Update moderation status
            return book;
        }
        throw new Error('Book not found');
    }
    
    async reject(id: string) {
        const index = this.books.findIndex(book => book.id === id);
        if (index > -1) {
            this.books.splice(index, 1);
        }
    }
}
