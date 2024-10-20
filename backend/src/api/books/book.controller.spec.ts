import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './create-book.dto';
import { HttpException } from '@nestjs/common';

describe('BookController', () => {
    let bookController: BookController;
    let mockBookService: Partial<Record<keyof BookService, jest.Mock>>;

    beforeEach(async () => {
        mockBookService = {
            create: jest.fn(),
            findAccepted: jest.fn(),
            findPending: jest.fn(),
            findRejected: jest.fn(),
            update: jest.fn(),
            accept: jest.fn(),
            reject: jest.fn(),
            addRating: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookController],
            providers: [
                { provide: BookService, useValue: mockBookService },
            ],
        }).compile();

        bookController = module.get<BookController>(BookController);
    });

    describe('addBook', () => {
        it('should return success message when article is created', async () => {
            const createBookDto: CreateBookDto = { 
                title: 'Test article', 
                author: 'Author', 
                isbn: '1234567890',
                description: 'A test article description',
                published_date: '2024-10-20',
                ratings: [],
                moderation: 'pending'
            };
            mockBookService.create.mockResolvedValue(undefined);

            const result = await bookController.addBook(createBookDto);
            expect(result).toEqual({ message: 'Article submitted for moderation' });
        });

        it('should throw HttpException if article creation fails', async () => {
            const createBookDto: CreateBookDto = { 
                title: 'Test article', 
                author: 'Author', 
                isbn: '1234567890',
                description: 'A test article description',
                published_date: '2024-10-20',
                ratings: [],
                moderation: 'pending'
            };
            mockBookService.create.mockRejectedValue(new Error('Error'));

            await expect(bookController.addBook(createBookDto)).rejects.toThrow(HttpException);
        });
    });
});
