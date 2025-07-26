import { Author } from "./User";

export interface iArticleType {
    _id?: any;
    title: string;
    coverImage: string;
    content: string;
    category: string;
    author: Author;
    createdAt: string;
    updatedAt: string;
    status: string;
    isEditable: boolean;
    views: number;
    slug: string;
}

export interface MonthlyAnalytics {
    month: string;
    comments: number;
    views: number;
    articles: number;
}