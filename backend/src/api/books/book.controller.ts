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
            return { message: 'Article submitted for moderation' };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to submit this Article',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Get('/')
    async findAcceptedBooks() {
        return this.bookService.findAccepted();
    }

    @Get('/pending')
    async findPendingBooks() {
        return this.bookService.findPending();
    }

    @Get('/rejected')
    async findRejectedBooks() {
        return this.bookService.findRejected();
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
                    error: 'Unable to update this Article',
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
                    error: 'Unable to accept this Article',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Put(':id/reject') 
    async rejectBook(@Param('id') id: string) {
        try {
            const rejectedBook = await this.bookService.reject(id);
            return rejectedBook;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to reject this Article',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }

    @Put(':id/rate')
    async rateBook(@Param('id') id: string, @Body('rating') rating: number) {
        try {
            const updatedBook = await this.bookService.addRating(id, rating);
            return updatedBook;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to rate this Article',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }
}
