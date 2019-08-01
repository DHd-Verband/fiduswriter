import {noSpaceTmp, escapeText} from "../../common"

export const articleTemplate = ({front, body, back}) =>
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">${front}${body}${back}</article>`

export const darManifest = ({images, title}) =>
'<?xml version="1.0" encoding="UTF-8"?>\n' +
noSpaceTmp`<!DOCTYPE manifest PUBLIC "DarManifest 0.1.0" "http://darformat.org/DarManifest-0.1.0.dtd">
<dar>
    <documents>
        <document id="manuscript" name="${escapeText(title)}" type="article" path="manuscript.xml" />
    </documents>
    <assets>${
        images.map(image => `<asset id="${image.filename.split(".")[0]}" mime-type="image/${
            image.filename.split(".")[1]==="png" ?
            'png' :
            image.filename.split(".")[1]==="svg" ?
            'svg+xml' :
            'jpeg'
        }" name="${image.title}" path="${image.filename}"/>`).join('')
    }</assets>
</dar>`

export const readMe =
`The manuscript.xml file contains a document in the Journal Archiving and Interchange Tag Library NISO JATS Version 1.2 format.
This export option is new in Fidus Writer 3.7 and the overall structure of the file
is likely to change in the subsequent versions. It is therefore marked as experimental.
`
