import * as hyperHTML from 'hyperhtml';
import removeEmptyFromObject from './functions/removeEmptyFromObject';
import generateCSL from './functions/generateCSL';
import generateHTML from './functions/generateHTML';
import clipboard from 'clipboard-polyfill';
import ProjectStore from './state/project-store';


class CloudCiteBibliography extends HTMLElement {
    static get observedAttributes() {
        return []
    }
    
    constructor(...args) {
        super(...args);
        this._citationStyle = ProjectStore.style.value;
        this._locale = ProjectStore.locale.value;
        this._format = [];
        this._citationHTML = [];
        this._cslBibRef = null;
        this._citationData = {};
        this.html = hyperHTML.bind(this.attachShadow({mode: 'closed'}));
    }

    get citationStyle() {
        return this._citationStyle;
    }

    set citationStyle(value) {
        this._citationStyle = value;
    }

    get locale() {
        return this._locale;
    }

    set locale(value) {
        this._locale = value;
    }

    get format() {
        return this._format;
    }

    set format(value) {
        this._format = value;
    }

    get citationData() {
        return this._citationData;
    }

    set citationData(value) {
        this._citationData = value;
    }

    get citationHTML() {
        return this._citationHTML;
    }

    set citationHTML(value) {
        this._citationHTML = value;
    }

    get cslBibRef() {
        return this._cslBibRef;
    }

    set cslBibRef(value) {
        this._cslBibRef = value;
    }

    async generatePreview() {
        let cslObject = await removeEmptyFromObject(this._citationData);
        for (let i = 0; i < ProjectStore.project.citations.length; i++) {
            this._citationData[ProjectStore.project.citations[i].id] = ProjectStore.project.citations[i];
        }
        const generatedHTML = await generateHTML({style: this._citationStyle, locale: this._locale, csl: this._citationData, lang: "en-US", cslHTML: this._citationHTML});
        this._format = generatedHTML.format;
        this._citationHTML = generatedHTML.html;
        if (generatedHTML && generatedHTML.error) {
            console.log(generatedHTML.error)
        } 
        else {
            this._format = generatedHTML.format;
            if (generatedHTML.html && generatedHTML.html.length > 0) {
                this._citationHTML = generatedHTML.html.map(htmlItem => htmlItem.html);
                this._cslBibRef = hyperHTML.wire()`
                <div>
                    <button id="copyBibliographyButton">Copy Bibliography</button>
                    <div style=${{marginTop: '10px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '5px', textAlign: 'left', fontWeight: 'normal !important'}}>
                        <div class="csl-bib-body" style=${{lineHeight: this._format.linespacing, marginLeft: `${this._format.hangingindent}em`, textIndent: `-${this._format.hangingindent}em`, wordBreak: 'break-all'}}>
                            ${this._citationHTML.map((cslEntry, index) =>
                                `<div id="cslEntryContainer${index}" style="clear: left; margin-bottom: ${this._format.entryspacing}}">
                                    ${cslEntry}
                                </div>
                                <button id="copyCitationButton${index}">Copy Citation</button>`
                            )}
                        </div>
                    </div>
                </div>`;
                this._cslBibRef.querySelector('#copyBibliographyButton').addEventListener('click', async e => {
                    let dt = new clipboard.DT(); 
                    let bibliographyContent = "";
                    for (let i = 0; i < ProjectStore.project.citations.length; i++) {
                        bibliographyContent += this._cslBibRef.querySelector(`#cslEntryContainer${i}`).innerText;
                    }
                    dt.setData("text/plain", bibliographyContent);
                    dt.setData("text/html", `<div class="csl-bib-body" style="${this._format ? (this._format.linespacing ? (`line-height:${this._format.linespacing};`): ''): ''} ${this._format ? (this._format.hangingindent ? (`text-indent:-${this._format.hangingindent}em;`): ''): ''}">${this._citationHTML.map(cslHTMLItem => `<div style="clear: left;${(this._format.entryspacing ? (`margin-bottom:${this._format.entryspacing}em;"`): '"')}>${cslHTMLItem}</div>`).join('')}</div>`);
                    clipboard.write(dt);
                });

                for (let i = 0; i < ProjectStore.project.citations.length; i++) {
                    this._cslBibRef.querySelector(`#copyCitationButton${i}`).addEventListener('click', async e => {
                        let dt = new clipboard.DT(); 
                        console.log(this._cslBibRef.querySelector(`#cslEntryContainer${i}`).innerText)
                        dt.setData("text/plain", this._cslBibRef.querySelector(`#cslEntryContainer${i}`).innerText);
                        dt.setData("text/html", `<div class="csl-bib-body" style="${this._format ? (this._format.linespacing ? (`line-height:${this._format.linespacing};`): ''): ''} ${this._format ? (this._format.hangingindent ? (`text-indent:-${this._format.hangingindent}em;`): ''): ''}">${`<div style="clear: left;${(this._format.entryspacing ? (`margin-bottom:${this._format.entryspacing}em;"`): '"')}>${this._citationHTML[i]}</div>`}</div>`);
                        clipboard.write(dt);
                    });
                }
                return this._cslBibRef;
            }
        }
    }

    attributeChangedCallback() {
        this.render();
    }
    async connectedCallback() {
        this.render();
    }

    render() {
        return this.html`
        <div>
            ${this.generatePreview()}
        </div>`;
    }
}
  
customElements.define('cloudcite-bibliography', CloudCiteBibliography);
  
export default CloudCiteBibliography;