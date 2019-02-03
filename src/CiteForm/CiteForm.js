import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Input } from 'semantic-ui-react';
import { types } from './types.js';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

class CiteForm extends Component {

  state = {
    contributors: [],
    form: (<div/>),
    contributorTypes: [
            {
                "text": "Author",
                "value": "Author"
            },
            {
                "text": "Editor",
                "value": "Editor"
            },
            {
                "text": "Translator",
                "value": "Translator"
            }
        ],
        monthNames: [
            {
                "key": "January",
                "text": "January",
                "value": 1
            },
            {
                "key": "February",
                "text": "February",
                "value": 2
            },
            {
                "key": "March",
                "text": "March",
                "value": 3
            },
            {
                "key": "April",
                "text": "April",
                "value": 4
            },
            {
                "key": "May",
                "text": "May",
                "value": 5
            },
            {
                "key": "June",
                "text": "June",
                "value": 6
            },
            {
                "key": "July",
                "text": "July",
                "value": 7
            },
            {
                "key": "August",
                "text": "August",
                "value": 8
            },
            {
                "key": "September",
                "text": "September",
                "value": 9
            },
            {
                "key": "October",
                "text": "October",
                "value": 10
            },
            {
                "key": "November",
                "text": "November",
                "value": 11
            },
            {
                "key": "December",
                "text": "December",
                "value": 12
            }
        ]
  }

  contributorsFormBuilder() {
    if (this.state.contributors.length === 0) {
      return (
        <span style={{marginTop: '10px', marginBottom: '10px'}}>
          <Form.Field>
            <Dropdown selection label="Contributor" placeholder="Author" options={this.state.contributorTypes}/>
          </Form.Field>
          <Form.Field>
            <Input label="First Name" placeholder="First Name"/>
          </Form.Field>
          <Form.Field>
            <Input label="Middle Name" placeholder="Middle Name"/>
          </Form.Field>
          <Form.Field>
            <Input label="Last Name" placeholder="Last Name"/>
          </Form.Field>
        </span>
      );
    }
    else {
      return (
        <Dropdown selection placeholder="Author" options={this.state.contributorTypes}/>,
        this.state.contributors.map((contributor, index) => 
          <span key={index}>
            <Form.Field>
              <Input label="First Name" placeholder="First Name" value={contributor.given}/>
            </Form.Field>
            <Form.Field>
            <label>Middle Name</label>
              <Input label="Middle Name" placeholder="Middle Name" value={contributor.middle}/>
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input label="Last Name" placeholder="Last Name" value={contributor.family}/>
            </Form.Field>
          </span>
        )
      );
    }
  }

  buildForm(typeMap) {
    let inputMap = typeMap.filter(element => element.csl && element.UI && !element.group);
    let form = (
    <Form>
      <Form.Field>
        <Dropdown selection label="Contributor" placeholder="Author" options={this.state.contributorTypes}/>
      </Form.Field>
      {
        this.state.contributors.length === 0 ? 
        (
          <div>
            <Form.Field>
              <Input label="First Name" placeholder="First Name"/>
            </Form.Field>
            <Form.Field>
              <Input label="Middle Name" placeholder="Middle Name"/>
            </Form.Field>
            <Form.Field>
              <Input label="Last Name" placeholder="Last Name"/>
            </Form.Field>
          </div>
        ):
        this.state.contributors.map((contributor, index) => 
          <div key={index}>
            <Form.Field>
              <Input label="First Name" placeholder="First Name" value={contributor.given}/>
            </Form.Field>
            <Form.Field>
              <Input label="Middle Name" placeholder="Middle Name" value={contributor.middle}/>
            </Form.Field>
            <Form.Field>
              <Input label="Last Name" placeholder="Last Name" value={contributor.family}/>
            </Form.Field>
          </div>
        )
      }
      <div style={{marginTop: '10px'}}/>
      {inputMap.map((field, index) => 
        <Form.Field key={index}>
          <Input label={field.UI ? field.UI: ''} placeholder={field.UI ? field.UI: ''}/>
        </Form.Field>
      )}
    </Form>
    );

    this.setState({
      form: form
    });
  }

  async handleChange(e, { value }) {
    try {
      const typeMap = await fetch(`https://cdn.cloudcite.net/maps/${value}.json`)
                              .then((response) => {
                                return response.json();
                              });
      this.buildForm(typeMap);
      
    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
    	<div>
     		<Dropdown style={{marginBottom: '10px'}} placeholder="Other" selection search options={types.map((type, index) => Object.assign(type, {key: index}))} onChange={(e, value) => this.handleChange(e, value)}/>
        {this.state.form}
     	</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CiteForm);
