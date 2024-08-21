import {
    exampleRunContactsServer,
    // EXAMPLE_BASEPATH_CONTACTS,
    EXAMPLE_BASEURL_CONTACTS,
    EXAMPLE_HOST,
    EXAMPLE_PORT,
    EXAMPLE_TITLE_CONTACTS,
} from '../lib/index.js'
// import contactsMimeMap from '@user3232/contacts-book/mime-map.json' with {type: 'json'}



exampleRunContactsServer({
    BASEPATH_CONTACTS: './',
    BASEURL_CONTACTS: EXAMPLE_BASEURL_CONTACTS,
    TITLE_CONTACTS: EXAMPLE_TITLE_CONTACTS,
    HOST: EXAMPLE_HOST,
    PORT: EXAMPLE_PORT,
})