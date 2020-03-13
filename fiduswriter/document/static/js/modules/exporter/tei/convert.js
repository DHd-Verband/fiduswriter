// import {escapeText} from "../../common"
// import {FIG_CATS} from "../../schema/i18n"

import extract from "./extract"
import {header} from "./templates/header"
import {body} from "./templates/body"
import {back} from "./templates/back"
import {TEITemplate} from "./templates"


/**
 * Create an empty XML tag.
 */
function tag(tagName, attrs={}) {
    if (Object.keys(attrs).length) {
        const attributes = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')
        return `<${tagName} ${attributes} />`
    }
    return `<${tagName} />`
}

/**
 * Wrap content in opening and closing XML tags.
 */
function wrap(tag, content, attrs={}) {
    if (Object.keys(attrs).length) {
        const attributes = Object.entries(attrs)
            .map(([key, val]) => `${key}="${val}"`)
            .join(' ')
        return `<${tag} ${attributes}>${content}</${tag}>`
    }
    return `<${tag}>${content}</${tag}>`
}

function convertAuthors(authors) {
    const tei = authors.map(({firstname, lastname, institution, email}) => {
        const name = wrap('persName', `${wrap('surname', lastname)} ${wrap('forename', firstname)}`)
        const inst = wrap('affiliation', institution)
        email = wrap('email', email)
        return wrap('author', `${name} ${inst} ${email}`)
    }).join('\n')
    return tei
}

function convertKeywords(keywords) {
    if (keywords.length) {
        const kws = keywords.map(kw => wrap('term', kw)).join('\n')
        return wrap('keywords', kws, {n: 'keywords', scheme: 'ConfTool'})
    }
    return ''
}

/**
 * Parse a leaf element of docContents, i.e. an element with type 'text' and
 * (optionally) some marks for emhasis.
 */
function parseText(item) {
    if (item.marks && item.marks.length) {
        const result = item.marks.reduce((previous, current) => {
            if (current.type === 'em') {
                return wrap('hi', previous, {rend: 'italic'})
            }
            else if (current.type === 'strong') {
                return wrap('hi', previous, {rend: 'bold'})
            }
            return previous
        }, item.text)
        return result
    }
    return item.text
}

/**
 * Build a string of TEI from the content of a part of docContents 
 * with type 'richtext'.
 */
function parseRichText(richTextContent) {
    let divLevel = 0
    let fnCount = 0

    function f(item) {
        /* This is a base case. */
        if (item.type === 'text') {
            return parseText(item)
        }
        /* Another base case, since the actual content of the footnote
         * is only needed at the bottom of the text. */
        if (item.type === 'footnote') {
            // This only handles the markup for footnotes inside the
            // regular text. The actual footnotes have to be generated
            // separately and placed at the bottom of the text.
            fnCount++
            return tag('ref', {n: fnCount, target: `ftn${fnCount}`})
        }

        /* Various recursive cases which require further parsing. */
        if (item.type === 'paragraph') {
            return wrap('p', item.content.map(c => f(c)).join(''))
        }

        if (item.type.startsWith('heading')) {
            const order = parseInt(item.type.slice(-1))
            // Whenever the new heading is of a higher order (i.e. the number is smaller!)
            // or the same as the preceding heading, we need to close some of our
            // previous div(s).
            const closing = (order <= divLevel) ? '</div>'.repeat(divLevel+1-order) : ''
            divLevel = order
            const opening = `<div rend="DH-Heading" type="div${order}">`
            const head = wrap('head', item.content.map(c => f(c)).join(''))
            return `${closing}${opening}${head}`
        }

        console.log(`Could not parse richtextContent of type ${item.type}`)
        return ''
    }

    const result = richTextContent.map(c => f(c)).join('')
    const closing = '</div>'.repeat(divLevel)

    return `${result}${closing}`
}

function renderFootnotes(footnotes) {
    const fns = footnotes.map((fn, idx) => {
        const i = idx + 1
        const text = parseRichText(fn)
        return wrap('note', text, {n: i, rend: 'footnote text', 'xml:id': `ftn${i}`})
    }).join('')
    return wrap('div', fns, {type: 'notes'})
}

/**
 * This is the main entry point of this module. It takes the title-slug of
 * the document and the documents content object and generates a string
 * of TEI XML suitable for download. 
 */
function convert(slug, docContents) {
    const fields = extract(docContents)

    // All the fields used in the TEI header:
    const authors = convertAuthors(fields.authors)
    const date = wrap('date', fields.date)
    const keywords = convertKeywords(fields.keywords)
    const title = wrap('title', fields.title)
    const TEIheader = header(authors, title, date, keywords)

    // All the fields used in the TEI body:
    const text = parseRichText(fields.richText)
    const TEIbody = body(text)

    // All the fields used in the TEI back:
    const footnotes = renderFootnotes(fields.footnotes)
    const TEIback = back(footnotes)

    return TEITemplate(slug, TEIheader, TEIbody, TEIback)
}

export {parseRichText, parseText, renderFootnotes, tag, wrap}
export default convert
