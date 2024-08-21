export type Contact = {
    id?: string;
    createdAt?: number;
    first?: string;
    last?: string;
    avatar?: string;
    twitter?: string;
    notes?: string;
    favorite?: boolean;
};
export declare function getContacts(query?: string | null): Promise<Contact[]>;
export declare function createContact(): Promise<{
    id: string;
    createdAt: number;
}>;
export declare function getContact(id?: string): Promise<Contact | null>;
export declare function updateContact(id: string | undefined, updates: Contact): Promise<Contact>;
export declare function deleteContact(id: string): Promise<boolean>;
