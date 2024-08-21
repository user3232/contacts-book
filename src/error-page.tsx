import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError()
    console.log(error)

    return (
        <div id="error-page">
            <h1>Ooops!</h1>
            <p>Sorry unexpected error has occurred.</p>
            <p>
                <i>{extractErrorText(error)}</i>
            </p>
        </div>
    )
}


function extractErrorText(error: unknown) {
    if(error instanceof Error) {
        return 'Generic error: ' + error.message
    }
    else if(isRouteErrorResponse(error)) {
        return 'Route error: ' + error.statusText
    }
    else {
        return 'Unknown error type.'
    }
}