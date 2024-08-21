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
export declare function RenderContactsHtml({ rootUrl, cssUrl, mainJsUrl, lang, title, icon, viewportContent, HOST, PORT, }: {
    rootUrl: string;
    mainJsUrl: string;
    cssUrl: string;
    title: string;
    lang?: string;
    icon?: {
        url: string;
        type: string;
    };
    viewportContent?: string;
    HOST?: string;
    PORT?: number;
}): string;
