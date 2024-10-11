import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';
import { Book } from './book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    async create(createBookDto: CreateBookDto) {
        const newBook = new this.bookModel(createBookDto);
        return await newBook.save();
    }
    
    async findAll() {
        return this.bookModel.find({ moderation: 'accepted' }).exec(); // Return only accepted books
    }
    
    async findPending() {
        return this.bookModel.find({ moderation: 'pending' }).exec(); // Return only pending books
    }

    async update(id: string, updateDto: Partial<CreateBookDto>) {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateDto, { new: true });
        if (!updatedBook) {
            throw new Error('Book not found');
        }
        return updatedBook;
    }

    async accept(id: string) {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, { moderation: 'accepted' }, { new: true });
        if (!updatedBook) {
            throw new Error('Book not found');
        }
        return updatedBook;
    }
    
    async reject(id: string) {
        const deletedBook = await this.bookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            throw new Error('Book not found');
        }
    }
}
