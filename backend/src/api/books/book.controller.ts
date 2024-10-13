import {
    Body,
    Controller,
    Get,
    Delete,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './create-book.dto';

@Controller('api/books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post('/')
    async addBook(@Body() createBookDto: CreateBookDto) {
        try {
            await this.bookService.create({ ...createBookDto, moderation: 'pending' });
            return { message: 'Book submitted for moderation' };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to submit this book',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Get('/')
    async findAcceptedBooks() {
        return this.bookService.findAll();
    }

    @Get('/pending')
    async findPendingBooks() {
        return this.bookService.findPending(); 
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() updateDto: Partial<CreateBookDto>) {
        try {
            const updatedBook = await this.bookService.update(id, updateDto);
            return updatedBook;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to update this book',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Put(':id/accept')
    async acceptBook(@Param('id') id: string) {
        try {
            const acceptedBook = await this.bookService.accept(id);
            return acceptedBook;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to accept this book',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Delete(':id/reject')
    async rejectBook(@Param('id') id: string) {
        try {
            await this.bookService.reject(id);
            return { message: 'Book rejected successfully' };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to reject this book',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }
}