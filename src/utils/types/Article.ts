import { iAuthor } from "./User";

export interface iArticleType {
    _id?: string;
    title: string;
    coverImage: string;
    content: string;
    category: string;
    author: iAuthor;
    createdAt: string;
    updatedAt: string;
    status: string;
    isEditable: boolean;
    views: number;
    slug: string;
}


export interface iNewArticle {
    title: string;
    coverImage: string;
    content: string;
    category: string;
}

export interface iUpdateArticle {
    title: string;
    coverImage: string;
    content: string;
    category: string;
}

export interface MonthlyAnalytics {
    month: string;
    comments: number;
    views: number;
    articles: number;
}

export interface iArticleEditRequest {

}

export interface iArticleApproveEditRequest {

}

export interface iComment {

}

