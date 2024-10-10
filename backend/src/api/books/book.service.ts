import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.schema';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    async create(createBookDto: CreateBookDto) {
        const newBook = new this.bookModel({ ...createBookDto, moderation: 'pending' });
        return await newBook.save();
    }

    async findAll() {
        return this.bookModel.find({ moderation: 'accepted' });
    }

    async findPending() {
        return this.bookModel.find({ moderation: 'pending' });
    }

    async update(id: string, updateDto: Partial<CreateBookDto>) {
        const book = await this.bookModel.findById(id);
        if (book) {
            Object.assign(book, updateDto);
            return await book.save();
        }
        throw new Error('Book not found');
    }

    async accept(id: string) {
        const book = await this.bookModel.findById(id);
        if (book) {
            book.moderation = 'accepted';
            return await book.save();
        }
        throw new Error('Book not found');
    }

    async reject(id: string) {
        const book = await this.bookModel.findByIdAndDelete(id);
        if (!book) {
            throw new Error('Book not found');
        }
    }
}
