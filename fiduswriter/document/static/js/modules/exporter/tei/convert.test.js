import {
  parseRichText,
  parseText,
  renderFootnotes,
  tag,
  wrap} from './convert'

test('create empty <br /> tag', () => {
  expect(tag('br')).toBe('<br />')
})

test('create empty ref tag with attributes', () => {
  expect(tag('ref', {n: 1, target: 'ftn1'})).toBe('<ref n="1" target="ftn1" />')
})

test('wrap text in p tage', () => {
  expect(wrap('p', 'hello')).toBe('<p>hello</p>')
})

test('wrap with attributes', () => {
  expect(wrap('hi', 'hello', {rend: 'italic'})).toBe('<hi rend="italic">hello</hi>')
})

test('render text-only node', () => {
  expect(
    parseText({
      type:'text',
      text:'hello',
    })
  ).toBe('hello')
})

test('render italic text', () => {
  expect(
    parseText({
       type:'text',
       text:'hello',
       marks:[{type:'em'}]
    })
  ).toBe('<hi rend="italic">hello</hi>')
})

test('render single paragraph', () => {
  expect(parseRichText([{
    type: 'paragraph',
    content: [{type: 'text', text: 'hello'}],
  }])).toBe('<p>hello</p>')
})

test('render paragraph with multiple children', () => {
  expect(parseRichText([{
    type: 'paragraph',
    content: [{type: 'text', text: 'hello '}, {type: 'text', text: 'world', marks: [{type: 'em'}]}],
  }])).toBe('<p>hello <hi rend="italic">world</hi></p>')
})

test('render heading with a single piece of text', () => {
  expect(
    parseRichText([{
      type: 'heading1',
      content: [{type: 'text', text: 'hello'}],
    }])
  ).toBe('<div rend="DH-Heading" type="div1"><head>hello</head></div>')
})

test('render heading with italic text', () => {
  expect(
    parseRichText([
      {
        type: 'heading1',
        content: [
          {type: 'text', text: 'hello '},
          {type: 'text', text: 'world', marks: [{type: 'em'}]},
        ],
      },
    ])
  ).toBe('<div rend="DH-Heading" type="div1"><head>hello <hi rend="italic">world</hi></head></div>')
})

test('render heading and following paragraph', () => {
  expect(
    parseRichText([
      {
        type: 'heading1',
        content: [{type: 'text', text: 'hello'}],
      },
      {
        type: 'paragraph',
        content: [{type: 'text', text: 'world'}],
      },
    ])
  ).toBe('<div rend="DH-Heading" type="div1"><head>hello</head><p>world</p></div>')
})

test('render second order heading', () => {
  expect(
    parseRichText([{
      type: 'heading2',
      content: [{type: 'text', text: 'hello'}],
    }])
  ).toBe('<div rend="DH-Heading" type="div2"><head>hello</head></div></div>')
})

test('render two headings', () => {
  expect(
    parseRichText([
      {
        type: 'heading1',
        content: [{type: 'text', text: 'first'}],
      },
      {
        type: 'heading2',
        content: [{type: 'text', text: 'second'}],
      },
    ])
  ).toBe(
    '<div rend="DH-Heading" type="div1"><head>first</head>' +
    '<div rend="DH-Heading" type="div2"><head>second</head></div></div>'
  )
})

test('render consecutive headings', () => {
  expect(
    parseRichText([
      {type: 'heading1', content: [{type: 'text', text: 'one'}]},
      {type: 'heading1', content: [{type: 'text', text: 'another'}]},
    ])
  ).toBe(
    '<div rend="DH-Heading" type="div1"><head>one</head></div>' +
    '<div rend="DH-Heading" type="div1"><head>another</head></div>'
  )
})

test('render footnotes (inside the main text)', () => {
  expect(
    parseRichText([{
      type: 'footnote',
      attrs: {
        footnote: [
          {type: 'paragraph', content: [{type: 'text', text: 'note of the foot'}]},
        ],
      },
    }])
  ).toBe('<ref n="1" target="ftn1" />')
})

test('consecutive footnotes (inside the main text) must be numbered', () => {
  expect(
    parseRichText([
      {
        type: 'footnote',
        attrs: {
          footnote: [
            {type: 'paragraph', content: [{type: 'text', text: 'note of the foot'}]},
          ],
        }
      },
      {
        type: 'footnote',
        attrs: {
          footnote: [
            {type: 'paragraph', content: [{type: 'text', text: 'foot of the note'}]},
          ],
        }
      }
    ])
  ).toBe('<ref n="1" target="ftn1" /><ref n="2" target="ftn2" />')
})

test('render list of footnotes at the bottom of the document', () => {
  expect(
    renderFootnotes([
      [
        {type: 'paragraph', content: [{type: 'text', text: 'note of the foot'}]},
      ],
      [
        {type: 'paragraph', content: [{type: 'text', text: 'foot of the note'}]},
      ],
    ])
  ).toBe(
    '<div type="notes">' +
    '<note n="1" rend="footnote text" xml:id="ftn1"><p>note of the foot</p></note>' +
    '<note n="2" rend="footnote text" xml:id="ftn2"><p>foot of the note</p></note>' +
    '</div>'
  )
})
