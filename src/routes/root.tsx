import { 
    Outlet, 
    Form, 
    useLoaderData, 
    LoaderFunctionArgs,  
    redirect,
    NavLink,
    NavLinkRenderProps,
    useNavigation,
    useSubmit
} from "react-router-dom"
import { Contact, createContact, getContacts } from "../contacts.js"
import { ContactName } from "./contact.js"
import { useEffect, useRef } from "react"



export async function rootLoader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('q')
    const contacts = await getContacts(searchQuery)
    return {contacts, searchQuery}
}


export async function rootAction() {
    const contact = await createContact()
    // dynamically specyfing form action:
    return redirect(`/contacts/${contact.id}/edit`)
}


export default function Root() {
    const {contacts, searchQuery} = useLoaderData() as Awaited<ReturnType<typeof rootLoader>>
    const navigation = useNavigation()
    const searchRef = useRef<HTMLInputElement>(null)
    const submit = useSubmit()

    const isSearching = navigation.location && new URLSearchParams(
        navigation.location.search
    ).has('q')

    // With client side routing:
    // * when user navigates back, url changes, but search input value stays
    //   old (list is filtered correctly),
    // * when user refreshes, url does not change, but search input is cleared 
    //   (list is filtered correctly),
    // 
    // so that is way we use here useEffect and input.defaultValue!
    useEffect(() => {
        const searchInput = searchRef.current
        if(searchInput !== null) {
            searchInput.value = searchQuery ?? ''
        }
        // const searchInput = document.getElementById('q') as HTMLInputElement | null
        // if(searchInput !== null) {
        //     searchInput.value = searchQuery ?? ''
        // }
    }, [
        searchQuery
    ])

    return (
        <>
            
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form 
                        id="search-form" 
                        role="search"
                        method="get"
                    >
                        <input 
                            id="q" 
                            aria-label="Search contacts" 
                            placeholder="Search" 
                            type="search" 
                            name="q" 
                            defaultValue={searchQuery ?? ''}
                            ref={searchRef}
                            onChange={(e) => {
                                const isFirstSearch = searchQuery == null
                                submit(e.currentTarget.form, {
                                    replace: !isFirstSearch
                                })
                            }}
                            className={isSearching ? 'loading' : ''}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!isSearching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    <RootContacts contacts={contacts} />
                </nav>
            </div>
            <div>
                <div id="top">
                    <div 
                        id="top-spinner"
                        aria-hidden
                        hidden={navigation.state === 'idle'}
                    />
                </div>
                <div 
                    id="detail"
                    className={navigation.state === 'loading' ? 'loading' : ''}
                >
                    <Outlet />
                </div>
            </div>
        </>
    )
}






function RootContacts({
    contacts
}: {
    contacts: Contact[]
}) {
    return contacts.length !== 0
        ? <RootContactsList contacts={contacts} /> 
        : <RootContactsNone />
}


function RootContactsList({
    contacts
}: {
    contacts: Contact[]
}) {

    return <ul>
        {contacts.map((contact) => (
            <li key={contact.id}>
                <NavLink 
                    to={`contacts/${contact.id}`}
                    className={styleNavLink}
                >
                    <ContactName contact={contact} />
                    {contact.favorite && <span>*</span>}
                </NavLink>
            </li>
        ))}
    </ul>
}


function styleNavLink({
    isActive, 
    isPending
}: NavLinkRenderProps): string | undefined {
    return isActive
    ? 'active'
    : isPending
        ? 'pending'
        : ''
}

function RootContactsNone() {

    return <p>
        <i>No contacts</i>
    </p>
}