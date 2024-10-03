export class CreateBookDto {
    title: string;
    isbn: string; // Ensure you're sending this field
    author: string;
    description: string;
    published_date: Date;
    publisher: string;
    updated_date: Date; // Make sure this field is optional in your DTO if you're not sending it
}
