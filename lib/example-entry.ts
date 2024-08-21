import fs from 'node:fs/promises'
import { RenderContactsHtml } from './render-html.js'



export async function exampleSaveContactsEntrypoint({
    PORT,
    HOST,
    BASEURL_CONTACTS,
    TITLE_CONTACTS,
    ENTRYPATH_CONTACTS,
}: {
    PORT?: number,
    HOST?: string,
    BASEURL_CONTACTS: string,
    TITLE_CONTACTS: string,
    ENTRYPATH_CONTACTS: string,
}) {
    
    const contactsBookHtml = RenderContactsHtml({
        lang:               'en',
        icon: {
            url:            `${BASEURL_CONTACTS}/public/vite.svg`,
            type:           'image/svg+xml'
        },
        viewportContent:    'width=device-width, initial-scale=1.0',
        title:              TITLE_CONTACTS,
        cssUrl:             `${BASEURL_CONTACTS}/css/index.css`,
        mainJsUrl:          `${BASEURL_CONTACTS}/dist/browser/main.js`,
        rootUrl:            `${BASEURL_CONTACTS}`,
        HOST,
        PORT,
    })
    
    
    await fs.writeFile(
        ENTRYPATH_CONTACTS, 
        contactsBookHtml, {
            encoding: 'utf-8'
        }
    )
}


