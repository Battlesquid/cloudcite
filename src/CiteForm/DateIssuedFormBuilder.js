import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Dropdown } from 'semantic-ui-react';
import { monthNames } from './monthNames.js';

class DateIssuedFormBuilder extends Component {

  render() {
    return (
      <Fragment>
        <Form.Group>
          <Form.Field control={Dropdown} selection lazyLoad label="Month Published" placeholder="Month Published" options={monthNames} value={this.props.issued.month} onChange={(e, value) => this.props.changeDateIssued(e, 'month', value)}/>
          <Form.Field control={Input} label="Day Published" type="number" placeholder="Day Published" defaultValue={this.props.issued.day} onChange={(e, value) => this.props.changeDateIssued(e, 'day', value)}/>
          <Form.Field control={Input} label="Year Published" type="number" placeholder="Year Published" defaultValue={this.props.issued.year} onChange={(e, value) => this.props.changeDateIssued(e, 'year', value)}/>
        </Form.Group>
        <Button.Group>
          <Button style={{backgroundColor: '#b71c1c', color: '#ffffff'}} onClick={() => this.props.removeDateIssued()}>Remove Date</Button>
          <Button.Or />
          <Button style={{backgroundColor: '#005eea', color: '#ffffff'}} onClick={() => this.props.setDateIssuedToday()}>Add Today's Date</Button>
        </Button.Group>
      </Fragment>
    );
  }
}

export default DateIssuedFormBuilder;