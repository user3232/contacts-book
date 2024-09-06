import { RenderContactsHtml } from './render-html.js'
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import contactsMimeMap from '../mimemap.json' with {type: 'json'}
import 'disposablestack/auto'
import streamWeb from 'node:stream/web'
import { MimeMap, Extension } from '@user3232/mime/mimemap.js'


export async function contactsEndpointStreaming({
    spaPath, res, contacts
}: {
    spaPath: string,
    res: http.ServerResponse<http.IncomingMessage>,
    contacts: {
        baseUrl: string,
        baseDirPath: string,
        mimeMap: MimeMap,
        mimeUnknown: string,
        title: string,
        entryHtml: typeof RenderContactsHtml,
    }
}) {
    const resourcePath = path.join(contacts.baseDirPath, spaPath)
    console.log(`resourcePath: ${resourcePath}`)

    // first try respond with resource and when no resource, 
    // respond with app entry point html.
    const sendFileResult = await fs.open(
        resourcePath, 
        fs.constants.O_RDONLY | fs.constants.O_NONBLOCK
    )
    .then(async (file) => {
        await using cleanup = new AsyncDisposableStack()
        cleanup.defer(async () => {
            await file.close()
        })
        const fileStat = await file.stat()
        if(!fileStat.isFile()) {
            return {
                type: 'file-open-error' as const, 
                resourcePath, 
                err: 'file is directory'
            }
        }
        const size = fileStat.size

        const fileExt = path.extname(resourcePath).substring(1)
        const mime = contacts.mimeMap.mimes?.[fileExt as Extension]
        if(!mime) {
            return {
                type: 'file-mime-error' as const, 
                resourcePath,
                err: 'unknown mime!'
            }
        }

        cleanup.defer(async () => {
            await res.end()
        })
        res.writeHead(200, {
            'Content-Length': size,
            'Content-Type': `${mime.mime}; charset=${mime.charset}`,
            'Transfer-Encoding': 'chunked'
        })

        console.log({
            log: 'streaming',
            resourcePath,
            fileExt,
            mime,
            'Content-Length': size,
            'Content-Type': `${contactsMimeMap.mimes['.html'].mime}; charset=${contactsMimeMap.mimes['.html'].charset}`,
            'Transfer-Encoding': 'chunked'
        })

        if(false) {
            const buffer = new Uint8Array(0xffff)
            let {bytesRead} = await file.read(buffer, 0, 0xffff)
            let bufferView = buffer.subarray(0, bytesRead)

            while(bytesRead !== 0) {
                // write file data to res
                if(!res.write(bufferView)) {
                    // wait for res drain event
                    await new Promise<void>((resolve) => res.once('drain', () => resolve()))
                }
                ({bytesRead} = await file.read(buffer, 0, 0xffff))
                bufferView = buffer.subarray(0, bytesRead)
            }
        }

        if(false) {
            let {bytesRead, buffer} = await file.read()

            while(bytesRead !== 0) {
                // write file data to res
                if(!res.write(buffer.subarray(0, bytesRead))) {
                    // wait for res drain event
                    await new Promise<void>((resolve) => res.once('drain', () => resolve()))
                }
                ({bytesRead, buffer} = await file.read())
            }
        }

        if(false) {
            const mutableBuffer = Buffer.alloc(0xffff)
            let {bytesRead} = await file.read({
                buffer: mutableBuffer,
            })

            while(bytesRead !== 0) {
                // write file data to res
                await writeHttpResponse(res, mutableBuffer.subarray(0, bytesRead))
                ;({bytesRead} = await file.read({buffer: mutableBuffer}))
            }
        }

        if(true) {
            
            const fileReadable: streamWeb.ReadableStream<Uint8Array> 
                = file.readableWebStream({type: 'bytes'})
            
            const httpWritable = writableFromHttpResponse(res)

            await fileReadable.pipeTo(httpWritable, {
                signal: AbortSignal.timeout(10000)
            })

        }

        
        return {
            type: 'file-open-ok' as const, 
            resourcePath,
        }
    })
    .catch((err) => ({
        type: 'file-stream-error' as const, 
        err
    }))

    
    if(
        sendFileResult.type === 'file-stream-error'
        || sendFileResult.type === 'file-open-error' 
        || sendFileResult.type === 'file-mime-error'
    ) {
        console.error(sendFileResult)
    }

    if(
        sendFileResult.type === 'file-open-error' 
        || sendFileResult.type === 'file-stream-error'
        || sendFileResult.type === 'file-mime-error'
    ) {
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
        cleanup.defer(async () => { 
            await res.end() 
        })

        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(contactsBookHtml),
            'Content-Type': `${contactsMimeMap.mimes['.html'].mime}; charset=${contactsMimeMap.mimes['.html'].charset}`,
        })
        res.end(contactsBookHtml)

        return
    }

    return
    
}




function writableFromHttpResponse(
    res: http.ServerResponse<http.IncomingMessage>,
) {
    return new WritableStream<Uint8Array>({
        start(controller) {
            if(!res.writable) {
                new Error('Response is not writable', {cause: {res}})
            }
            controller.signal.addEventListener('abort', function() {
                controller.error(this.reason)
            })
        },
        write(chunk, /* controller */) {
            // is controller.error(err) needed if rejected?
            return writeHttpResponse(res, chunk)
        },
        close() {
            res.end()
        },
        abort(reason?: any) {
            res.destroy(reason instanceof Error 
                ? reason
                : new Error('http response destroyed', {cause: reason})
            )
        }
    })
}



function writeHttpResponse(
    res: http.ServerResponse<http.IncomingMessage>,
    chunk: any,
) {
    return new Promise<void>((resolve, reject) => {
        const ready = res.write(
            chunk, 
            (err) => { if(err) reject(err) }
        )
        if(ready) {
            resolve()
        }
        else {
            res.once('drain', resolve)
        }
    })
}


