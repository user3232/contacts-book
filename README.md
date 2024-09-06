# Contacts book

Web application for storing contacts.

## Install

Install latest version:

```sh
npm install user3232/contacts-book#semver:latest
```

## Deploy

To deploy:

1.  install using npm: `npm install @user3232/contacts-book@...`,
2.  configure entry point, to be served. It can be served on flay
    or from generated file:

    ```ts
    import {BuildHtml} from '@user3232/contacts-book/server'

    const contatsBookHtml = BuildHtml({
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
    })

    import fs from 'node:fs/promises'
    await fs.writeFile(
        './public/contacts-book/index.html', 
        contactsBookHtml, {
            encoding: 'utf-8'
        }
    )
    ```
3.  serve static files


## Integrations

Integration with [React Query](https://tanstack.com/query/latest):
- https://tanstack.com/query/latest/docs/framework/react/examples/react-router
- https://tkdodo.eu/blog/react-query-meets-react-router