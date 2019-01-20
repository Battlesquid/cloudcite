import { generateCSL } from './generateCSL';
import { cite } from './cite';

/**
 * @param {Object} style 
 * @param {Object} locale 
 * @param {Array<Object>} citationTray 
 * @param {Array<String>} cslHTML 
 */
export async function generateHTML(style, locale, citationTray, cslHTML) {
    let csl = generateCSL(citationTray);
    return new Promise(async (resolve, reject) => {
        try {
            if (style && locale && csl && (Object.keys(csl).length > 0)) {
                const response = await cite(style, locale, csl);
                if (response[0] && response[1].length > 0) {
                    const format = response[0];
                    let html = [];
                    let richTextHTML = "";
                    for (let i=0; i < response[1].length; i++) {
                        let generatedHTML = response[1][i];
                        let cslIndentIndex = (generatedHTML && generatedHTML[i]) ? generatedHTML[i].indexOf('class="csl-indent"'): -1;
                        if (cslIndentIndex !== -1) {
                            generatedHTML = `${response[1][i].substring(0, cslIndentIndex - 1)} style="margin: .5em 0 0 2em; padding: 0 0 .2em .5em; border-left: 5px solid #ccc;" ${response[1][i].substring(cslIndentIndex, response[1].length)} `;
                        }
                        let cslRightInlineIndex = (generatedHTML && generatedHTML[i]) ? generatedHTML.indexOf('class="csl-right-inline"'): -1;
                        if (cslRightInlineIndex !== -1) {
                            generatedHTML = `${generatedHTML.substring(0, cslRightInlineIndex - 1)} style="margin: 0 .4em 0 ${format.secondFieldAlign ? format.maxOffset + format.rightPadding : '0'}em;" ${generatedHTML.substring(cslRightInlineIndex, generatedHTML.length)}`;
                        }
                        let cslLeftMarginIndex = (generatedHTML && generatedHTML[i]) ? generatedHTML.indexOf('class="csl-left-margin"'): -1;
                        if (cslLeftMarginIndex !== -1) {
                            generatedHTML = `${generatedHTML.substring(0, cslLeftMarginIndex - 1)} style="float: left; padding-right:${format.rightpadding}em; ${format.secondFieldAlign ? `text-align: right; width:${format.maxoffset}em;`: ''}" ${generatedHTML.substring(cslLeftMarginIndex, generatedHTML.length)}`;
                        }
                        html.push({id: format.entry_ids[i][0], html: generatedHTML});
                        if (format && response[1].length > 0) {
                            richTextHTML = `<div class="csl-bib-body" style="${format && format.linespacing ? (`line-height: ${format.linespacing}; `): ''} ${format && format.hangingindent ? (` text-indent: -${format.hangingindent}em;`): ''}`;
                            for (let i=0; i < response[1].length; i++) {
                                richTextHTML += `<div style="clear: left;${format && format.entryspacing ? (`margin-bottom:${format.entryspacing}em;`): ''}"> ${cslHTML[i] ? cslHTML[i]: ''}</div>`;
                            }
                            richTextHTML += '</div>';
                        }
                    }
                    resolve({format: format, html: html, richTextHTML: richTextHTML});
                }
                else {
                    reject({error: "HTML can not be generated"});
                }
            }
            else {
                reject({error: "Invalid function parameters"});
            }
        }
        catch (error) {
            reject(error);
        }
    });
}