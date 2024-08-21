import { ActionFunctionArgs, redirect } from "react-router-dom";
import { deleteContact } from "../contacts.js";


export type DestroyContactParams = {
    contactId: string
}

export async function destroyContactAction({params}: ActionFunctionArgs) {
    const {contactId} = params as DestroyContactParams
    const resultOk = await deleteContact(contactId)
    if(!resultOk) {
        throw new Error(`Contact with id="${contactId}" does not exist!`)
    }
    return redirect(`/`)
}