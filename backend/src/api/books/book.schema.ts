import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

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

    @Prop({ type: Date })
    published_date: Date;

    @Prop({ type: Date, default: Date.now })
    updated_date: Date;

    @Prop({ default: 'pending' })
    moderation: 'pending' | 'accepted' | 'rejected';

    @Prop({ type: [Number], default: [] }) 
    ratings: number[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
