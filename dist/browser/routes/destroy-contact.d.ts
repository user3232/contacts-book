import { ActionFunctionArgs } from "react-router-dom";
export type DestroyContactParams = {
    contactId: string;
};
export declare function destroyContactAction({ params }: ActionFunctionArgs): Promise<Response>;
