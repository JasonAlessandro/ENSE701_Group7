import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';
import { Book } from './book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    async create(createBookDto: CreateBookDto) {
        const newBook = new this.bookModel({
            ...createBookDto,
            published_date: createBookDto.published_date,
        });
        return await newBook.save();
    }
    
    async findAccepted() {
        return this.bookModel.find({ moderation: 'accepted' }).exec();
    }

    async findPending() {
        return this.bookModel.find({ moderation: 'pending' }).exec();
    }

    async findRejected() {
        return this.bookModel.find({ moderation: 'rejected' }).exec();
    }

    async update(id: string, updateDto: Partial<CreateBookDto>) {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateDto, { new: true });
        if (!updatedBook) {
            throw new Error('Article not found');
        }
        return updatedBook;
    }

    async accept(id: string) {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, { moderation: 'accepted' }, { new: true });
        if (!updatedBook) {
            throw new Error('Article not found');
        }
        return updatedBook;
    }
    
    async reject(id: string) {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, { moderation: 'rejected' }, { new: true });
        if (!updatedBook) {
            throw new Error('Article not found');
        }
        return updatedBook; 
    }

    async addRating(id: string, rating: number) {
        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }
        book.ratings[0] = rating; 
        return await book.save();
    }
}
