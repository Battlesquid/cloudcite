import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import LocaleSearch from './LocaleSearch/LocaleSearch.js';
import StyleSearch from './StyleSearch/StyleSearch.js';
import FavoriteStyleSearch from './FavoriteStyleSearch/FavoriteStyleSearch.js';
import { Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
//import Bibliography from './Bibliography/Bibliography.js';
//<Bibliography citation={this.props.projects.find((project) => project.id === this.props.selectedProject).citations}/>

const mapStateToProps = state => ({
  selectedProject: state.projectsReducer.selectedProject,
  projects: state.projectsReducer.projects
});

const mapDispatchToProps = dispatch => ({

});

var EXPERIMENT_DATA = [{"id":"citation-0","type":"webpage","URL":"cloudcite.net","contributors":[{"given":"Naval","middle":"","family":"Patel","type":"Author"}],"source":null,"archive":null,"archive_location":null,"call-number":null,"container-title":"CloudCite","dimensions":null,"edition":null,"ISBN":null,"medium":null,"number-of-volumes":null,"number-of-pages":null,"volume":null,"title":"CloudCite · The Best Free Automatic Bibliography Generator · MLA, APA, Chicago, Harvard Citation Styles","title-short":null,"genre":null,"publisher":null,"publisher-place":null,"issued":{"month":8,"day":10,"year":2018},"accessed":{"month":9,"day":19,"year":2018},"abstract":"CloudCite is a free, automatic, and ad-free bibliography generator for popular citation styles such as MLA 8th Edition, APA, and Chicago."},{"id":"citation-1","type":"webpage","URL":"bugbrowser.net","contributors":[{"given":"Avi","middle":"","family":"Shah","type":"Author"}],"source":null,"archive":null,"archive_location":null,"call-number":null,"container-title":"Bug Browser","dimensions":null,"edition":null,"ISBN":null,"medium":null,"number-of-volumes":null,"number-of-pages":null,"volume":null,"title":"Bug Browser ","title-short":null,"genre":null,"publisher":null,"publisher-place":null,"accessed":{"month":1,"day":20,"year":2019}}];

class App extends Component {

  handleChange(e, { value }) {
    console.log(value);
  }

  cite(type) {
    switch (type) {
      case "webpage":
        this.props.history.push('/cite/website');
        break;
      case "other":
        this.props.history.push('/cite');
        break;
      default: this.props.history.push('/cite');
    }
  }
  citeOther() {
    this.props.history.push('/cite');
  }

  render() {
    return (
      <div className="App">
          <div className="container">
            <div style={{padding: '5vh'}}>
              <h1>Welcome to CloudCite</h1>
              <p>CloudCite processes citations in the cloud so you never have to create citations manually again.</p>
              <div style={{textAlign: 'center'}}>
                <Button id="citeButton" onClick={(e) => this.cite("webpage")}>Website</Button>
                <Button id="citeButton">Book</Button>
                <Button id="citeButton">Film</Button>
                <Button id="citeButton" onClick={(e) => this.cite("other")}>Other</Button>
              </div>
            </div>
            <Divider/>
          </div>
          <div>
          <FavoriteStyleSearch/>
          </div>
          <div>
          <LocaleSearch/>
          </div>
          <div>
          <StyleSearch/>
          </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
