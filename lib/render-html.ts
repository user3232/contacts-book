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
export function RenderContactsHtml({
    rootUrl,
    cssUrl,
    mainJsUrl,
    lang,
    title,
    icon,
    viewportContent,
    HOST,
    PORT,
}: {
    rootUrl: string,
    mainJsUrl: string,
    cssUrl: string,
    title: string
    lang?: string,
    icon?: {
        url: string,
        type: string,
    },
    viewportContent?: string,
    HOST?: string,
    PORT?: number,
}): string {

    const langAttr = lang 
        ? `lang="${lang}"`
        : ``
    
    const iconTag = icon
        ? `<link rel="icon" type="${icon.type}" href="${icon.url}" />`
        : ``
    viewportContent ??= 'width=device-width, initial-scale=1.0'

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
        </html>`.split('\n').map(line => line.substring(8)).join('\n')
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
}))