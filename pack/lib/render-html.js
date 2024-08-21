import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import ReactDOMServer from 'react-dom/server';
// import { renderApp } from './main'
export function PageHtml() {
    return (_jsx(_Fragment, { children: _jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "UTF-8" }), _jsx("link", { rel: "icon", type: "image/svg+xml", href: "/vite.svg" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: "Vite + React + TS" })] }), _jsxs("body", { children: [_jsx("div", { id: "root" }), _jsx("script", { type: "module", children: `
                    import {renderApp} from "/src/main.tsx" */}

                    const typicalPath = '/'
                    const interestingPath = '/static/client-side-page@0.0.0/'
                    renderApp(typicalPath)
                ` })] })] }) }));
}
export function pageHtmlString() {
    return ReactDOMServer.renderToString(_jsx(PageHtml, {}));
}
console.log(pageHtmlString());
