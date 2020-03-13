export const header = (authors, title, date, keywords) => `
<teiHeader>
    <fileDesc>
    <titleStmt>
        ${title}
        ${authors}
    </titleStmt>
    <editionStmt>
        <edition>
        ${date}
        </edition>
    </editionStmt>
    <publicationStmt>
        <publisher>Test: Fidus Writer</publisher>
        <address>
        <addrLine>...</addrLine>
        <addrLine>...</addrLine>
        <addrLine>...</addrLine>
        </address>
    </publicationStmt>
    <sourceDesc>
        <p>Based on a Fidus Writer document</p>
    </sourceDesc>
    </fileDesc>
    <encodingDesc>
    <appInfo>
        <application ident="Fidus-Writer-TEI-Exporter" version="0.1">
        <label>Fidus Writer TEI Exporter</label>
        </application>
    </appInfo>
    </encodingDesc>
    <profileDesc>
    <textClass>
        ${keywords}
    </textClass>
    </profileDesc>
</teiHeader>`
