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
        mimeMap: Partial<Record<string, string>>,
        mimeUnknown: string,
        title: string,
        entryHtml: typeof RenderContactsHtml,
    }
}) {
    const resourcePath = path.join(contacts.baseDirPath, spaPath)

    // first try respond with resource and when no resource, 
    // respond with app entry point html.
    const fileRes = await fs.open(
        resourcePath, 
        fs.constants.O_RDONLY | fs.constants.O_NONBLOCK
    )
    .then(async (file) => {
        await using cleanup = new AsyncDisposableStack()
        cleanup.defer(() => file.close())
        const fileStat = await file.stat()
        if(!fileStat.isFile()) {
            return {
                type: 'file-open-error' as const, 
                file: null, 
                err: 'file is directory'
            }
        }
        const size = fileStat.size
        return {
            type: 'file-open-ok' as const, 
            file, 
            size,
            cleanup: cleanup.move(),
        }
    })
    .catch((err) => ({type: 'file-open-error' as const, err}))

    


    switch(fileRes.type) {
        case 'file-open-error': {
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
            cleanup.defer(() => void res.end())

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(contactsBookHtml),
                'Content-Type': contactsMimeMap.html,
            })
            res.end(contactsBookHtml)

            return
        }
        case 'file-open-ok': {
            await using cleanup = fileRes.cleanup
            cleanup.defer(() => void res.end())

            res.writeHead(200, {
                'Content-Length': fileRes.size,
                'Content-Type': contacts.mimeMap[path.extname(resourcePath).substring(1)] 
                    ?? contacts.mimeUnknown,
            })
            // wait for file data
            let {buffer, bytesRead} = await fileRes.file.read()
            while(bytesRead !== 0) {
                // write file data to res
                if(!res.write(buffer)) {
                    // wait for res drain event
                    await new Promise((resolve) => res.once('drain', resolve))
                }
            }
            res.end()
            return
        }
    }
    
}

