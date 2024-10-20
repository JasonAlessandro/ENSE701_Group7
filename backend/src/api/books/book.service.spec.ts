import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateBookDto } from './create-book.dto';
import { Book } from './book.schema';

describe('BookService', () => {
    let bookService: BookService;
    let mockBookModel: any; 

    beforeEach(async () => {
        mockBookModel = {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookModel,
                },
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
    });

    describe('findAccepted', () => {
        it('should return all accepted books', async () => {
            const acceptedBooks = [{ title: 'Accepted Book 1' }, { title: 'Accepted Book 2' }];
            mockBookModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(acceptedBooks),
            });

            const result = await bookService.findAccepted();
            expect(result).toEqual(acceptedBooks);
            expect(mockBookModel.find).toHaveBeenCalledWith({ moderation: 'accepted' });
        });
    });

    describe('findPending', () => {
        it('should return all pending books', async () => {
            const pendingBooks = [{ title: 'Pending Book 1' }];
            mockBookModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(pendingBooks),
            });

            const result = await bookService.findPending();
            expect(result).toEqual(pendingBooks);
            expect(mockBookModel.find).toHaveBeenCalledWith({ moderation: 'pending' });
        });
    });

    describe('findRejected', () => {
        it('should return all rejected books', async () => {
            const rejectedBooks = [{ title: 'Rejected Book 1' }];
            mockBookModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(rejectedBooks),
            });

            const result = await bookService.findRejected();
            expect(result).toEqual(rejectedBooks);
            expect(mockBookModel.find).toHaveBeenCalledWith({ moderation: 'rejected' });
        });
    });

    describe('update', () => {
        it('should update a book and return the updated book', async () => {
            const updateDto = { title: 'Updated Book Title' };
            const updatedBook = { ...updateDto, _id: '1' };
            mockBookModel.findByIdAndUpdate.mockResolvedValue(updatedBook);

            const result = await bookService.update('1', updateDto);
            expect(result).toEqual(updatedBook);
            expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateDto, { new: true });
        });

        it('should throw an error if the book is not found', async () => {
            mockBookModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(bookService.update('1', {})).rejects.toThrow('Article not found');
        });
    });

    describe('accept', () => {
        it('should accept a book and return the updated book', async () => {
            const acceptedBook = { _id: '1', moderation: 'accepted' };
            mockBookModel.findByIdAndUpdate.mockResolvedValue(acceptedBook);

            const result = await bookService.accept('1');
            expect(result).toEqual(acceptedBook);
            expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { moderation: 'accepted' }, { new: true });
        });

        it('should throw an error if the book is not found', async () => {
            mockBookModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(bookService.accept('1')).rejects.toThrow('Article not found');
        });
    });

    describe('reject', () => {
        it('should reject a book and return the updated book', async () => {
            const rejectedBook = { _id: '1', moderation: 'rejected' };
            mockBookModel.findByIdAndUpdate.mockResolvedValue(rejectedBook);

            const result = await bookService.reject('1');
            expect(result).toEqual(rejectedBook);
            expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { moderation: 'rejected' }, { new: true });
        });

        it('should throw an error if the book is not found', async () => {
            mockBookModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(bookService.reject('1')).rejects.toThrow('Article not found');
        });
    });
});
