export class CreateBookDto {
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: string;
    ratings?: number[]; 
    moderation?: 'pending' | 'accepted' | 'rejected';
}
