import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function DestroyContactErrorPage() {
    const error = useRouteError()
    console.log(error)

    return (
        <div id="error-page">
            <h1>Ooops!</h1>
            <p>Sorry unexpected error has occurred during contact delete.</p>
            <p>
                <i>{extractError(error)}</i>
            </p>
        </div>
    )
}


function extractError(error: unknown) {
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