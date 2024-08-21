import { RenderContactsHtml } from './render-html.js'
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import contactsMimeMap from '../mime-map.json' with {type: 'json'}
import 'disposablestack/auto'


export async function contactsEndpoint({
    spaPath, res, contacts
}: {
    spaPath: string,
    res: http.ServerResponse<http.IncomingMessage>,
    contacts: {
        baseUrl: string,
        baseDirPath: string,
        mimeMap: Partial<Record<string, {type: string, charset: string}>>,
        mimeUnknown: string,
        title: string,
        entryHtml: typeof RenderContactsHtml,
    }
}) {
    const resourcePath = path.join(contacts.baseDirPath, spaPath)
    console.log(`resourcePath: ${resourcePath}`)


    

    // first try respond with resource and when no resource, 
    // respond with app entry point html.
    const fileRes = await fs.readFile(
        resourcePath,
        'utf-8'
    )
    .then(async (file) => {
        const fileExt = path.extname(resourcePath).substring(1)
        const mime = contacts.mimeMap[fileExt]
        if(!mime) {
            return {
                type: 'file-open-error' as const, 
                err: 'unknown mime!'
            }
        }
        return ({
            type: 'file-open-ok' as const, 
            file, 
            mime,
        })
    })
    .catch((err) => ({
        type: 'file-open-error' as const, 
        err
    }))



    switch(fileRes.type) {
        case 'file-open-error': {
            console.log(fileRes.type)
            console.warn(fileRes.err)
            const contactsBookHtml = contacts.entryHtml({
                rootUrl:    contacts.baseUrl,
                cssUrl:     `${contacts.baseUrl}/css/index.css`,
                mainJsUrl:  `${contacts.baseUrl}/dist/browser/main.js`,
                icon: {
                    url:    `${contacts.baseUrl}/public/vite.svg`,
                    type:   'image/svg+xml'
                },
                lang:       'en',
                title:      'Contacts book',
                viewportContent: 'width=device-width, initial-scale=1.0',
            })

            await using cleanup = new AsyncDisposableStack()
            cleanup.defer(() => { 
                console.log(`ending open-error res stream for ${resourcePath}`)
                res.end() 
            })

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(contactsBookHtml),
                'Content-Type': `${contactsMimeMap.html.type}; charset=${contactsMimeMap.html.charset}`,
            })
            res.write(contactsBookHtml)

            return
        }
        case 'file-open-ok': {
            await using cleanup = new AsyncDisposableStack()
            cleanup.defer(() => { 
                console.log(`ending open-ok res stream ${resourcePath}`)
                res.end() 
            })

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(fileRes.file),
                'Content-Type': `${fileRes.mime.type}; charset=${fileRes.mime.charset}`,
            })
            // wait for file data
            
            res.write(fileRes.file, 'utf-8')
            // res.end()
            return
        }
    }
    
}

