import { RenderContactsHtml } from './render-html.js';
import http from 'node:http';
import 'disposablestack/auto';
import { MimeMap } from '@user3232/mime/mimemap.js';
export declare function contactsEndpointStreaming({ spaPath, res, contacts }: {
    spaPath: string;
    res: http.ServerResponse<http.IncomingMessage>;
    contacts: {
        baseUrl: string;
        baseDirPath: string;
        mimeMap: MimeMap;
        mimeUnknown: string;
        title: string;
        entryHtml: typeof RenderContactsHtml;
    };
}): Promise<void>;
