import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { type Contact } from "../contacts";
export declare function defaultContact(): Contact;
export type ContactParams = {
    contactId: string;
};
export type ContactFavoriteFormData = {
    favorite: 'true' | 'false';
};
export declare function contactLoader({ params }: LoaderFunctionArgs): Promise<{
    contact: Contact | null;
}>;
export declare function contactFavoriteAction({ params, request }: ActionFunctionArgs): Promise<Contact>;
export default function Contact(): import("react/jsx-runtime").JSX.Element;
export declare function ContactName({ contact }: {
    contact?: Contact | null;
}): import("react/jsx-runtime").JSX.Element;
