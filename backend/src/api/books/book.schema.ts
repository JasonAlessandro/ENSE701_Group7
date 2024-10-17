import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    isbn: string;

    @Prop({ required: true })
    author: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    published_date: string;

    @Prop({ default: 'pending' })
    moderation: 'pending' | 'accepted' | 'rejected';

    @Prop({ type: [Number], default: [] }) 
    ratings: number[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
