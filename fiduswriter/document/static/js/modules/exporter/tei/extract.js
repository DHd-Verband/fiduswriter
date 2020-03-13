/**
 * Utility functions to extract needed fields from documents.
 * @module
 */


function extractAuthors(docContents) {
    const autorPart = docContents.content.find(part => part.type==='contributors_part')
    const authors = autorPart.content
        .filter(item => item.type==='contributor')
        .map(author => author.attrs)
    return authors
}

/**
 * For every part of type 'footnote', extract the array with the
 * actual text contents. So, this returns an array of arrays.
 */
function extractFootnotes(docContents) {
    return extractRichText(docContents)
        .filter(part => part.type==='footnote')
        .map(fn => fn.attrs.footnote)
}

function extractKeywords(docContents) {
    const kwPart = docContents.content.find(part => part.type==='tags_part')
    const keywords = kwPart.content
        .filter(item => item.type==='tag')
        .map(kw => kw.attrs.tag)
    return keywords
}

function extractRichText(docContents) {
    const body = docContents.content.find(part => {
        return part.type==='richtext_part' && part.attrs.id==='body'
    })
    return body.content
}

function extractTitle(docContents) {
    const titlePart = docContents.content.find(part => part.type==='title')
    const title = titlePart.content.find(item => item.type==='text')
    return title.text
}

/**
 * Extract all the required fields from the document's content.
 */
export default function extract(docContents, docSettings) {
    const currentDate = new Date().toISOString()
    
    const authors = extractAuthors(docContents)
    const footnotes = extractFootnotes(docContents)
    const keywords = extractKeywords(docContents)
    const richText = extractRichText(docContents)
    const title = extractTitle(docContents)
    
    return {
        authors,
        footnotes,
        keywords,
        richText,
        title,
        date: currentDate,
    }
}
