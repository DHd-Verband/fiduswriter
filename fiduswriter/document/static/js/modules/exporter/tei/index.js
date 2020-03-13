import download from "downloadjs"

import {createSlug} from "../tools/file"
import {removeHidden} from "../tools/doc_contents"
// import {ZipFileCreator} from "../tools/zip"

import convert from './convert'


/*
 * Export a document as TEI XML.
 */
export function exportTEI(doc, bibDB, imageDB, csl) {
    const slug = createSlug(doc.title)
    const fileName = `${slug}.tei.xml`
    const docContents = removeHidden(doc.contents)

    const enc = new TextEncoder()
    const tei = enc.encode(convert(slug, docContents))
    console.log(docContents)
    download(tei, fileName, 'text/xml')
}


/*
this.converter = new TEIConverter(this, this.imageDB, this.bibDB, this.doc.settings)
this.citations = new TEICitations(this, this.bibDB, this.csl)
this.conversion = this.converter.init(this.docContents).then(
    (stuff) => {
        return `
            Dummy document
        `
    } */
/*
) .then(
    blob => download(blob, this.zipFileName, 'text/plain')
) */
