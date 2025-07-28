export interface User {
    email: string;
    password: string;
}

export interface iAuthor {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    profile?: string;
    rank?: string;
    createdAt?: string;
    updatedAt?: string;
    isDisabled?: boolean;
    role?: string;
    disableReason?: string;
    username?: string;
}

export interface iUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    profile?: string;
    rank?: string;
    createdAt?: string;
    updatedAt?: string;
    isDisabled?: boolean;
    role?: string;
    disableReason?: string;
    username?: string;
    password?: string;
    phone?: string;
}

export interface iUserChangePassword {
    
}