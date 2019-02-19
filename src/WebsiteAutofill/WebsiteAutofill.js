import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import CiteForm from '../CiteForm/CiteForm.js';
import { createCitation } from '../functions/createCitation.js';
import './WebsiteAutofill.scss';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

class WebsiteAutofill extends Component {

    state = {
        websiteInputURL: "",
        startCiting: false,
        citationData: null,
        fieldMap: null,
        creatorsMap: null
    }

    async componentDidMount() {
        const fieldMap = await fetch(`https://cdn.cloudcite.net/fields/webpage.json`)
            .then((response) => {
                return response.json();
            });
        const creatorsMap = await fetch(`https://cdn.cloudcite.net/creators/webpage.json`)
            .then((response) => {
                return response.json();
            });
        this.setState({
            fieldMap: fieldMap,
            creatorsMap: creatorsMap
        });
    }

    formatURL(url) {
        let newURL: string = ""
        switch (url.substring(0, 7)) {
            case 'https:/':
                newURL = url.substring(8, url.length)
                break;
            case 'http://':
                newURL = url.substring(7, url.length)
                break;
            default:
                newURL = url
        }
        if (newURL.substring(0, 4) === "www.") {
            newURL = newURL.substring(4, newURL.length)
        }
        return newURL
    }

    async citeURL(url) {
        try {
            let citationData = await fetch('https://api.cloudcite.net/autofillv2', {
                method: 'POST',
                headers: {
                    'X-Api-Key': '9kj5EbG1bI4PXlSiFjRKH9Idjr2qf38A2yZPQEZy'
                },
                body: JSON.stringify({
                    "format": "website",
                    "URL": (url.substring(0, 4) === 'http') ? url : (`http://${url}`),
                    "transform": true
                })
            }).then((response) => response.json());
            citationData.URL = this.formatURL(citationData.URL);
            this.setState({ citationData: citationData });
        }
        catch (error) {
            this.setState({ citationData: createCitation({"type": "webpage", "URL": this.formatURL(url)})});
        }
    }

    buildForm() {
        if (this.state.citationData && this.state.fieldMap && this.state.creatorsMap) {
            return (
                <CiteForm citationData={this.state.citationData} fieldMap={this.state.fieldMap} creatorsMap={this.state.creatorsMap} />
            );
        }
        else {
            return (
                <Form className="citeForm">
                    <Input onChange={(e) => this.setState({ websiteInputURL: e.target.value })} placeholder="Cite Website" />
                    <Button className="btn" onClick={() => this.citeURL(this.state.websiteInputURL)} type="submit">Cite Website</Button>
                </Form>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="top">
                    <h1>Cite a Website</h1>
                    <label>You can start citing a website by typing the website link and clicking on cite.</label>
                </div>
                {this.buildForm()}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WebsiteAutofill));