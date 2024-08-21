import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import Root from './routes/root.js'
import { 
    rootLoader as rootLoader, 
    rootAction as rootAction 
} from './routes/root.js'
import { 
    contactFavoriteAction,
    contactLoader as contactLoader
} from './routes/contact.js'
import ErrorPage from './error-page.js'
import Contact from './routes/contact.js'
import EditContact, { 
    action as editContactAction 
} from './routes/edit-contact.js'
import { destroyContactAction } from './routes/destroy-contact.js'
import DestroyContactErrorPage from './routes/destroy-contact-error.js'
import RootIndex from './routes/root-index.js'



export function renderApp({
    path,
}: {
    path: string,
    HOST?: string,
    PORT?: number,
}) {
    
    const router = createBrowserRouter([
        {
            path: path,
            loader: rootLoader,
            action: rootAction,
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [{
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <RootIndex />
                    },
                    {
                        path: 'contacts/:contactId',
                        loader: contactLoader,
                        action: contactFavoriteAction,
                        element: <Contact />,
                    }, 
                    {
                        path: 'contacts/:contactId/edit',
                        loader: contactLoader,
                        action: editContactAction,
                        element: <EditContact />,
                    },
                    {
                        path: 'contacts/:contactId/destroy',
                        action: destroyContactAction,
                        errorElement: <DestroyContactErrorPage />
                    },
                ],
            }]
        }, 
    ])
    
    
    
    
    
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    )
}


