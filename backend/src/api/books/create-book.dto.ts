export class CreateBookDto {
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: Date;
    ratings?: number[]; 
    moderation?: 'pending' | 'accepted' | 'rejected';
}
