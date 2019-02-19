import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ADD_CITATION } from '../actions/projects';
import { SET_CITATION_SAVE_MODE } from '../actions/citationSaveMode';
import { UPDATE_CREATORS_TYPES } from '../actions/creatorsTypes';
import { Dropdown, Form, Input, Button } from 'semantic-ui-react';
import { types } from './types.js';
import './CiteForm.css';
import { createCitation } from '../functions/createCitation.js';
import { withRouter } from 'react-router-dom';
import ContributorFormBuilder from './ContributorFormBuilder.js';
import DateAccessedFormBuilder from './DateAccessedFormBuilder.js';
import DateIssuedFormBuilder from './DateIssuedFormBuilder.js';
import Preview from '../Preview/Preview.js';
import crypto from 'crypto';

const mapStateToProps = state => ({
  selectedProject: state.projectsReducer.selectedProject,
  citationSaveMode: state.citationSaveModeReducer.citationSaveMode
});

const mapDispatchToProps = dispatch => ({
  ADD_CITATION: (id, citation) => dispatch(ADD_CITATION(id, citation)),
  SET_CITATION_SAVE_MODE: (payload) => dispatch(SET_CITATION_SAVE_MODE(payload)),
  UPDATE_CREATORS_TYPES: (creatorsMap) => dispatch(UPDATE_CREATORS_TYPES(creatorsMap)),
});

class CiteForm extends Component {
  constructor(props) {
    super(props);
    this.addContributor = this.addContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);
    this.setContributor = this.setContributor.bind(this);
    this.changeDateAccessed = this.changeDateAccessed.bind(this);
    this.removeDateAccessed = this.removeDateAccessed.bind(this);
    this.setDateAccessedToday = this.setDateAccessedToday.bind(this);
    this.changeDateIssued = this.changeDateIssued.bind(this);
    this.removeDateIssued = this.removeDateIssued.bind(this);
    this.setDateIssuedToday = this.setDateIssuedToday.bind(this);
  }

  state = {
    fieldMap: this.props.fieldMap ? this.props.fieldMap: [],
    creatorsMap: this.props.creatorsMap ? this.props.creatorsTypes: [],
    citation: this.props.citationData ? createCitation(this.props.citationData): createCitation(null)
  }

  async componentDidMount() {
    if (this.state.citation.type && this.state.citation.type != '') {
      const fieldMap = await fetch(`https://cdn.cloudcite.net/fields/${this.state.citation.type}.json`)
                          .then((response) => {
                            return response.json();
                          });
      const creatorsMap = await fetch(`https://cdn.cloudcite.net/creators/${this.state.citation.type}.json`)
                            .then((response) => {
                              return response.json();
                            });
      this.setState({
        fieldMap: fieldMap,
        creatorsMap: creatorsMap.map((creator, index) => Object.assign(creator, {"key": creator.index, "text": creator.UI, "value": creator.csl}))
      });
      this.props.UPDATE_CREATORS_TYPES(creatorsMap);
    }
  }

  cancelCitation() {
    this.props.history.push('/');
  }

  saveCitation() {
    const SAVE_MODES = {
      ADD: "ADD",
      EDIT: "EDIT"
    }
    if (this.props.citationSaveMode === SAVE_MODES.ADD) {
      this.props.ADD_CITATION(this.props.selectedProject, this.state.citation);
    }
    else {
      this.props.SET_CITATION_SAVE_MODES(SAVE_MODES.EDIT);
    }
    this.props.history.push('/');
  }

  addContributor() {
    this.setState({
      citation: {
        ...this.state.citation,
        contributors: [...this.state.citation.contributors, {key: crypto.randomBytes(10).toString('hex'), given: '', middle: '', family: '', type: 'Author'}]
      }
    })
  }

  removeContributor(key) {
    if (this.state.citation.contributors.length <= 1) {
      this.setState({
        citation: {
          ...this.state.citation,
          contributors: [{key: crypto.randomBytes(10).toString('hex'), given: '', middle: '', family: '', type: 'Author'}]
        }
      })
    }
    else {
      this.setState({
        citation: {
          ...this.state.citation,
          contributors: this.state.citation.contributors.filter((contributor) => contributor.key !== key)
        }
      });
    }
  }

  setContributor(e, key, field, { value }) {
    this.setState({
      citation: {
        ...this.state.citation,
        contributors: this.state.citation.contributors.map((contributor) => contributor.key === key ? {...contributor, [field]: value}: contributor)
      }
    });
  }

  changeDateAccessed(e, field, { value }) {
    this.setState({
      citation: {
        ...this.state.citation,
        accessed: {
          ...this.state.citation.accessed,
          [field]: value
        }
      }
    });
  }

  removeDateAccessed() {
    this.setState({
      citation: {
        ...this.state.citation,
        accessed: {
          month: "",
          day: "",
          year: ""
        }
      }
    });
  }

  setDateAccessedToday() {
    let currentDate = new Date();
    this.setState({
      citation: {
        ...this.state.citation,
        accessed: {
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
          year: currentDate.getFullYear()
        }
      }
    })
  }

  changeDateIssued(e, field, { value }) {
    this.setState({
      citation: {
        ...this.state.citation,
        issued: {
          ...this.state.citation.issued,
          [field]: value
        }
      }
    });
  }

  removeDateIssued() {
    this.setState({
      citation: {
        ...this.state.citation,
        issued: {
          month: "",
          day: "",
          year: ""
        }
      }
    });
  }

  setDateIssuedToday() {
    let currentDate = new Date();
    this.setState({
      citation: {
        ...this.state.citation,
        issued: {
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
          year: currentDate.getFullYear()
        }
      }
    })
  }

  setCSLValue(e, cslKey, { value }) {
    this.setState({
      citation: {
        ...this.state.citation,
        [cslKey]: value
      }
    });
  }

  async handleChange(e, { value }) {
    const fieldMap = await fetch(`https://cdn.cloudcite.net/fields/${value}.json`)
                          .then((response) => {
                            return response.json();
                          });
    const creatorsMap = await fetch(`https://cdn.cloudcite.net/creators/${value}.json`)
                          .then((response) => {
                            return response.json();
                          });
    this.setState({
      citation: {
        ...this.state.citation,
        type: value
      },
      fieldMap: fieldMap,
      creatorsMap: creatorsMap.map((creator, index) => Object.assign(creator, {"key": creator.index, "text": creator.UI, "value": creator.csl}))
    });
    this.props.UPDATE_CREATORS_TYPES(creatorsMap);
  }

  render() {
    return (
    	<div id="citeForm">
        <div style={{textAlign: 'center'}}>
     		 <Dropdown fluid style={{marginBottom: '10px'}} placeholder="Select Citation Type" value={this.state.citation.type ? this.state.citation.type: null} selection search options={types.map((type, index) => Object.assign(type, {key: index}))} onChange={(e, value) => this.handleChange(e, value)}/>
        </div>
        <Form widths="equal">
        {
          this.state.fieldMap.length > 0 && this.state.creatorsMap ? (
            <div>
              <ContributorFormBuilder citation={this.state.citation} creatorsMap={this.state.creatorsMap} removeContributor={this.removeContributor} addContributor={this.addContributor} setContributor={this.setContributor}/>
              <div style={{marginTop: '15px'}}/>
              <DateAccessedFormBuilder accessed={this.state.citation.accessed} changeDateAccessed={this.changeDateAccessed} removeDateAccessed={this.removeDateAccessed} setDateAccessedToday={this.setDateAccessedToday}/>
              <div style={{marginTop: '15px'}}/>
              <DateIssuedFormBuilder issued={this.state.citation.issued} changeDateIssued={this.changeDateIssued} removeDateIssued={this.removeDateIssued} setDateIssuedToday={this.setDateIssuedToday}/>
              <div style={{marginTop: '15px'}}/>
            </div>
          ): <div/>
        }
          {this.state.fieldMap.filter(element => element.csl && element.csl !== '' && element.UI && element.UI !== '' && !element.group)
            .map((field, index) => 
              <Form.Field key={field.csl}>
                <Input label={field.UI ? field.UI: ''} placeholder={field.UI ? field.UI: ''} value={this.state.citation[field.csl] ? this.state.citation[field.csl]: ''} onChange={(e, value) => this.setCSLValue(e, field.csl, value)}/>
              </Form.Field>
          )}
          <div style={{marginTop: '15px'}}/>
          <Preview citations={[this.state.citation]}/>
          {
            this.state.fieldMap.length > 0 ? (
              <Button.Group style={{marginTop: '15px'}}>
                <Button onClick={(e) => this.cancelCitation()}>Cancel</Button>
                <Button.Or />
                <Button style={{backgroundColor: '#005eea', color: '#ffffff'}} onClick={(e) => this.saveCitation()}>Save</Button>
              </Button.Group>
            ): <div/>
          }
        </Form>
     	</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CiteForm));
