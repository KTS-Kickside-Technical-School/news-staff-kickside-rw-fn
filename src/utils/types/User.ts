export interface User {
    email: string;
    password: string;
}

export interface Author {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    profile?: string;
    rank?: string;
    createdAt?: string;
    updatedAt?: string;
    isDisabled: boolean;
    role: string;
    disableReason: string;
    username: string;
}