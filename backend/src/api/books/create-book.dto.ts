export class CreateBookDto {
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: Date;
    publisher: string;
    updated_date: Date;
    status?: 'pending' | 'approved' | 'rejected';
}
