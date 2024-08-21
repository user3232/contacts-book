import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

/**
 *
 * > **Note - Injecting script content problem!**
 * >
 * > Generating parametrized page html using React
 * > will not work because in s
 * > one can not add script content by setting inner
 * > html. It is blocked by browsers for security
 * > reasons.
 */
function RenderContactsHtml({ rootUrl, cssUrl, mainJsUrl, lang, title, icon, viewportContent, HOST, PORT, }) {
    const langAttr = lang
        ? `lang="${lang}"`
        : ``;
    const iconTag = icon
        ? `<link rel="icon" type="${icon.type}" href="${icon.url}" />`
        : ``;
    viewportContent ??= 'width=device-width, initial-scale=1.0';
    return `\
        <html ${langAttr}>
        <head>
            <meta charset="utf-8" />
            ${iconTag}
            <meta name="viewport" content="${viewportContent}" />
            <title>${title}</title>
            <link rel="stylesheet" href="${cssUrl}" />
        </head>
        <body>
            <div id="root"></div>
            <script type="module">
                import {renderApp} from '${mainJsUrl}'
                renderApp({
                    path: '${rootUrl}',
                    ${HOST ? `HOST: '${HOST}',` : ''}
                    ${PORT ? `PORT: ${PORT},` : ''}
                })
            </script>
        </body>
        </html>`.split('\n').map(line => line.substring(8)).join('\n');
}
console.log(RenderContactsHtml({
    lang: 'en',
    icon: {
        url: '/spa/public/vite.svg',
        type: 'image/svg+xml'
    },
    viewportContent: 'width=device-width, initial-scale=1.0',
    title: 'Contacts book',
    cssUrl: '/spa/css/index.css',
    mainJsUrl: '/spa/dist/browser/main.js',
    rootUrl: '/spa'
}));

async function exampleSaveContactsEntrypoint({ PORT, HOST, BASEURL_CONTACTS, TITLE_CONTACTS, ENTRYPATH_CONTACTS, }) {
    const contactsBookHtml = RenderContactsHtml({
        lang: 'en',
        icon: {
            url: `${BASEURL_CONTACTS}/public/vite.svg`,
            type: 'image/svg+xml'
        },
        viewportContent: 'width=device-width, initial-scale=1.0',
        title: TITLE_CONTACTS,
        cssUrl: `${BASEURL_CONTACTS}/css/index.css`,
        mainJsUrl: `${BASEURL_CONTACTS}/dist/browser/main.js`,
        rootUrl: `${BASEURL_CONTACTS}`,
        HOST,
        PORT,
    });
    await fs.writeFile(ENTRYPATH_CONTACTS, contactsBookHtml, {
        encoding: 'utf-8'
    });
}

var css = "text/css; charset=utf-8";
var html = "text/html; charset=utf-8";
var json = "application/json; charset=utf-8";
var js = "application/javascript; charset=utf-8";
var ts = "text/typescript; charset=utf-8";
var svg = "image/svg+xml";
var contactsMimeMap = {
	css: css,
	html: html,
	json: json,
	js: js,
	ts: ts,
	svg: svg
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;

}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    function next() {
        while (env.stack.length) {
            var rec = env.stack.pop();
            try {
                var result = rec.dispose && rec.dispose.call(rec.value);
                if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
            }
            catch (e) {
                fail(e);
            }
        }
        if (env.hasError) throw env.error;
    }
    return next();
}

async function contactsEndpoint({ spaPath, res, contacts }) {
    const resourcePath = path.join(contacts.baseDirPath, spaPath);
    // first try respond with resource and when no resource, 
    // respond with app entry point html.
    const { type, file } = await fs.open(resourcePath, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK)
        .then((file) => ({ type: 'file-open-ok', file, err: null }))
        .catch((err) => ({ type: 'file-open-error', file: null, err }));
    switch (type) {
        case 'file-open-error': {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const contactsBookHtml = contacts.entryHtml({
                    rootUrl: contacts.baseUrl,
                    cssUrl: `${contacts.baseUrl}/css/index.css`,
                    mainJsUrl: `${contacts.baseUrl}/dist/browser/main.js`,
                    icon: {
                        url: `${contacts.baseUrl}/public/vite.svg`,
                        type: 'image/svg+xml'
                    },
                    lang: 'en',
                    title: 'Contacts book',
                    viewportContent: 'width=device-width, initial-scale=1.0',
                });
                const cleanup = __addDisposableResource(env_1, new AsyncDisposableStack(), true);
                cleanup.defer(() => void res.end());
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(contactsBookHtml),
                    'Content-Type': contactsMimeMap.html,
                });
                res.end(contactsBookHtml);
                return;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                const result_1 = __disposeResources(env_1);
                if (result_1)
                    await result_1;
            }
        }
        case 'file-open-ok': {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const cleanup = __addDisposableResource(env_2, new AsyncDisposableStack(), true);
                cleanup.defer(() => void res.end());
                cleanup.defer(() => file.close());
                const fileStat = await file.stat();
                res.writeHead(200, {
                    'Content-Length': fileStat.size,
                    'Content-Type': contacts.mimeMap[path.extname(resourcePath)]
                        ?? contacts.mimeUnknown,
                });
                // wait for file data
                let { buffer, bytesRead } = await file.read();
                while (bytesRead !== 0) {
                    // write file data to res
                    if (!res.write(buffer)) {
                        // wait for res drain event
                        await new Promise((resolve) => res.once('drain', resolve));
                    }
                }
                res.end();
                return;
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                const result_2 = __disposeResources(env_2);
                if (result_2)
                    await result_2;
            }
        }
    }
}

function exampleRunContactsServer({ PORT, HOST, BASEURL_CONTACTS, BASEPATH_CONTACTS, TITLE_CONTACTS, }) {
    const contactsServer = http.createServer(async (req, res) => {
        try {
            const url = req.url;
            // requested resource outside web app base url:
            if (!url || url.startsWith(`${BASEURL_CONTACTS}/`)) {
                const errorHtml = `See Contacts Book at: http://${HOST}${PORT ? `:${PORT}` : ``}${BASEURL_CONTACTS}`;
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(errorHtml),
                    'Content-Type': 'text/html; charset=utf-8',
                });
                res.end(errorHtml);
                return;
            }
            // requested resource web app
            await contactsEndpoint({
                res,
                spaPath: path.normalize(url.substring(BASEURL_CONTACTS.length)),
                contacts: {
                    baseUrl: BASEURL_CONTACTS,
                    baseDirPath: BASEPATH_CONTACTS,
                    mimeMap: contactsMimeMap,
                    mimeUnknown: 'text/plain; charset=utf-8',
                    entryHtml: RenderContactsHtml,
                    title: TITLE_CONTACTS,
                },
            });
        }
        catch (err) {
            console.log('Response error occured!');
            console.error(err);
        }
        finally {
            res.end();
        }
    });
    contactsServer.listen(PORT, HOST, () => {
        console.log(`Listening on http://${HOST}${PORT ? `:${PORT}` : ``}`);
        console.log(`
            See Contacts Book web application at 
            http://${HOST}${PORT ? `:${PORT}` : ``}${BASEURL_CONTACTS}
        `);
    });
}

const EXAMPLE_PORT = 3333;
const EXAMPLE_HOST = 'localhost';
const EXAMPLE_BASEURL_CONTACTS = '/contacts';
const EXAMPLE_BASEPATH_CONTACTS = './node_modules/@user3232/contacts-book';
const EXAMPLE_TITLE_CONTACTS = 'Contacts book';
const EXAMPLE_ENTRYPATH_CONTACTS = `./public/contacts/index.html`;

export { EXAMPLE_BASEPATH_CONTACTS, EXAMPLE_BASEURL_CONTACTS, EXAMPLE_ENTRYPATH_CONTACTS, EXAMPLE_HOST, EXAMPLE_PORT, EXAMPLE_TITLE_CONTACTS, RenderContactsHtml, contactsEndpoint, exampleRunContactsServer, exampleSaveContactsEntrypoint };
