import { ActionFunctionArgs, Form, LoaderFunctionArgs, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, updateContact, type Contact } from "../contacts.js";


export function defaultContact(): Contact {
    return {
        first: "Your",
        last: "Name",
        avatar: "https://robohash.org/you.png?size=200x200",
        twitter: "your_handle",
        notes: "Some notes",
        favorite: true,
    }
} 



export type ContactParams = {
    contactId: string,
}

export type ContactFavoriteFormData = {
    favorite: 'true' | 'false'
}

export async function contactLoader({params}: LoaderFunctionArgs) {
    const {contactId} = params as ContactParams
    const contact = await getContact(contactId)
    return {contact}
}


export async function contactFavoriteAction({params, request}: ActionFunctionArgs) {
    const {contactId} = params as ContactParams
    const favorite = (await request.formData()).get('favorite') as ContactFavoriteFormData['favorite'] | null
    return updateContact(contactId, {
        favorite: favorite === 'true'
    })
}

export default function Contact() {
    const {contact} = useLoaderData() as Awaited<ReturnType<typeof contactLoader>>

    return <div id="contact">
        <ContactAvatar contact={contact} />
        <div>
            <h1>
                <ContactName contact={contact} />
                <ContactFavorite contact={contact} />
            </h1>
            <ContactTwitter contact={contact} />
            <ContactNotes contact={contact} />
            <ContactActions />
        </div>
    </div>
}


function ContactAvatar({ contact }: {contact?: Contact | null}) {
    return <div><img 
        src={
            contact?.avatar
            || `https://robohash.org/${contact?.id}.png?size=200x200`
        } 
        key={contact?.avatar}
    /></div>
}

export function ContactName({ contact }: {contact?: Contact | null}) {
    return <>
        {contact?.first || contact?.last ? (
            <>
                {contact.first} {contact.last}
            </>
        ) : (
            <i>No Name</i>
        )}{" "}
    </>
}

function ContactTwitter({ contact }: {contact?: Contact | null}) {
    return <>
        {contact?.twitter && (
            <p>
                <a
                    target="_blank"
                    href={`https://twitter.com/${contact.twitter}`}
                >
                    {contact.twitter}
                </a>
            </p>
        )}
    </>
}

function ContactNotes({ contact }: {contact?: Contact | null}) {
    return <>{contact?.notes && <p>{contact.notes}</p>}</>
}


function ContactActions() {
    return <div>
        <Form 
            action="edit"
        >
            <button type="submit">Edit</button>
        </Form>
        <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
                if (
                    !confirm(
                        "Please confirm you want to delete this record."
                    )
                ) {
                    event.preventDefault();
                }
            }}
        >
            <button type="submit">Delete</button>
        </Form>
    </div>
}


function ContactFavorite({ contact }: {contact?: Contact | null}) {
    const fetcher = useFetcher()

    const favorite = contact?.favorite;
    return (
        <fetcher.Form 
            method="post" 
        >
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
            <span
                id="favorite-spinner"
                aria-hidden
                hidden={fetcher.state !== 'submitting' ? true : false}
            />
            
      </fetcher.Form>
    );
  }