import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { Model } from 'mongoose';

const mockBook = {
  title: 'Test Book',
  isbn: '123456789',
  author: 'John Doe',
  description: 'A test book',
  published_date: new Date(),
  publisher: 'Test Publisher',
  updated_date: new Date(),
};

describe('BookService', () => {
  let service: BookService;
  let model: Model<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockBook),
            constructor: jest.fn().mockResolvedValue(mockBook),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new book', async () => {
    jest.spyOn(model, 'create').mockResolvedValueOnce(mockBook as any);
    const newBook = await service.create(mockBook);
    expect(newBook).toEqual(mockBook);
  });

  it('should find all books', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockBook]),
    } as any);
    const books = await service.findAll();
    expect(books).toEqual([mockBook]);
  });

  it('should find a book by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const book = await service.findOne('123');
    expect(book).toEqual(mockBook);
  });

  it('should update a book', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const updatedBook = await service.update('123', mockBook);
    expect(updatedBook).toEqual(mockBook);
  });

  it('should delete a book', async () => {
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const result = await service.delete('123');
    expect(result).toEqual(mockBook);
  });
});
