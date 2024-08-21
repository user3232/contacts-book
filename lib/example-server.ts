import { RenderContactsHtml } from './render-html'
import http from 'node:http'
import path from 'node:path'
import contactsMimeMap from '../mime-map.json' with {type: 'json'}
import { contactsEndpoint } from './endpoint.js'



export function exampleRunContactsServer({
    PORT,
    HOST,
    BASEURL_CONTACTS,
    BASEPATH_CONTACTS,
    TITLE_CONTACTS,
}: {
    PORT?: number,
    HOST?: string,
    BASEURL_CONTACTS: string,
    BASEPATH_CONTACTS: string,
    TITLE_CONTACTS: string,
}) {
    const contactsServer = http.createServer(async (req, res) => {
        try {
            const url = req.url
    
            // requested resource outside web app base url:
            if(
                !url || (url !== BASEURL_CONTACTS && !url.startsWith(`${BASEURL_CONTACTS}/`))
            ) {
                const errorHtml =
`See Contacts Book at: http://${HOST}${PORT ? `:${PORT}` : ``}${BASEURL_CONTACTS}`
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(errorHtml),
                    'Content-Type': 'text/html; charset=utf-8',
                })
                res.end(errorHtml)
                return
            }
    
            // requested resource web app
            await contactsEndpoint({
                res,
                spaPath: path.normalize(
                    url.substring(BASEURL_CONTACTS.length)
                ),
                contacts: {
                    baseUrl: BASEURL_CONTACTS,
                    baseDirPath: BASEPATH_CONTACTS,
                    mimeMap: contactsMimeMap,
                    mimeUnknown: 'text/plain; charset=utf-8',
                    entryHtml: RenderContactsHtml,
                    title: TITLE_CONTACTS,
                },
            })
        }
        catch (err) {
            console.log('Response error occured!')
            console.error(err)
        }
        finally {
            res.end()
        }
    })
    
    contactsServer.listen(PORT, HOST, () => {
        console.log(`Listening on http://${HOST}${PORT ? `:${PORT}` : ``}`)
        console.log(`
            See Contacts Book web application at 
            http://${HOST}${PORT ? `:${PORT}` : ``}${BASEURL_CONTACTS}
        `)
    })
    
}


