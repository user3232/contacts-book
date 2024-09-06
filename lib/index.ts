

export const EXAMPLE_PORT = 3333
export const EXAMPLE_HOST = 'localhost'
export const EXAMPLE_BASEURL_CONTACTS = '/contacts'
export const EXAMPLE_BASEPATH_CONTACTS = './node_modules/@user3232/contacts-book'
export const EXAMPLE_TITLE_CONTACTS = 'Contacts book'
export const EXAMPLE_ENTRYPATH_CONTACTS = `./public/contacts/index.html`

export { exampleSaveContactsEntrypoint } from './example-entry.js'
export { exampleRunContactsServer } from './example-server.js'
export { contactsEndpointBuffering as contactsEndpoint } from './endpoint-buffering.js'
export { RenderContactsHtml } from './render-html.js'