import { RenderContactsHtml } from './render-html.js';
import http from 'node:http';
import 'disposablestack/auto';
export declare function contactsEndpoint({ spaPath, res, contacts }: {
    spaPath: string;
    res: http.ServerResponse<http.IncomingMessage>;
    contacts: {
        baseUrl: string;
        baseDirPath: string;
        mimeMap: Partial<Record<string, string>>;
        mimeUnknown: string;
        title: string;
        entryHtml: typeof RenderContactsHtml;
    };
}): Promise<void>;
