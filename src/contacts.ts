import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";


export type Contact = {
    id?: string,
    createdAt?: number,
    first?: string,
    last?: string,
    avatar?: string,
    twitter?: string,
    notes?: string,
    favorite?: boolean,
}





export async function getContacts(query?: string | null) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem<Contact[]>("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
    await fakeNetwork();
    const id = Math.random().toString(36).substring(2, 9);
    const contact = { id, createdAt: Date.now() };
    const contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id?: string) {
    await fakeNetwork(`contact:${id}`);
    const contacts = await localforage.getItem<Contact[]>("contacts") ?? [];
    const contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
}

export async function updateContact(id: string | undefined, updates: Contact) {
    await fakeNetwork();
    const contacts = await localforage.getItem<Contact[]>("contacts") ?? [];
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) throw new Error(`No contact found for ${id}`);
    if(contact.favorite !== updates.favorite) {
        await timeout(10000)
    }
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

export async function deleteContact(id: string) {
    const contacts = await localforage.getItem<Contact[]>("contacts") ?? [];
    const index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts: Contact[]) {
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};


async function fakeNetwork(key?: string) {
    if (!key) {
        fakeCache = {};
    }

    if (!key || fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise<void>(res => {
        setTimeout(res, Math.random() * 800);
    });
}


async function timeout(ms: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
}