import { ActionFunctionArgs } from "react-router-dom";
export declare function action({ params, request }: ActionFunctionArgs): Promise<Response>;
export type EditContactParams = {
    contactId: string;
};
export type EditContactFormData = {
    first?: string;
    last?: string;
    twitter?: string;
    avatar?: string;
    notes?: string;
};
export default function EditContact(): import("react/jsx-runtime").JSX.Element;
