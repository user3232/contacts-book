import { LoaderFunctionArgs } from "react-router-dom";
import { Contact } from "../contacts.js";
export declare function rootLoader({ request }: LoaderFunctionArgs): Promise<{
    contacts: Contact[];
    searchQuery: string | null;
}>;
export declare function rootAction(): Promise<Response>;
export default function Root(): import("react/jsx-runtime").JSX.Element;
