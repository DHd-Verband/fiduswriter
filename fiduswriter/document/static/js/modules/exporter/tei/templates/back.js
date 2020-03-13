export const back = (notes) => `
<back>
    <div type="notes">
        ${notes.map((note) => `<note>${note}</note>`).join('\n')}
    </div>
</back>
`