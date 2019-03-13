import React, { Component } from 'react';
import { connect } from 'react-redux';
import './_App.scss';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { SET_TITLE } from './actions/projects';

const Bibliography = React.lazy(() => import('./Bibliography/Bibliography.js'));
const FavoriteStyleSearch = React.lazy(() => import('./FavoriteStyleSearch/FavoriteStyleSearch.js'));

const mapStateToProps = state => ({
  selectedProject: state.projectsReducer.selectedProject,
  projects: state.projectsReducer.projects
});

const mapDispatchToProps = dispatch => ({
  SET_TITLE: (PROJECT_ID, TITLE) => dispatch(SET_TITLE(PROJECT_ID, TITLE))
});

class App extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      window.ga('send', 'pageview');
    }
  }
  
  cite(type) {
    switch (type) {
      case "webpage":
        this.props.history.push('/website');
        break;
      case "books":
        this.props.history.push('/books');
        break;
      case "films":
        this.props.history.push('/films');
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
  setProjectTitle(e) {
    if (e.target.value.length > 0) {
      this.props.SET_TITLE(this.props.selectedProject, e.target.value);
    }
  }

  render() {
    return (
      <div id="mainPage">
        <div style={{ backgroundColor: 'rgb(0, 94, 234)', color: '#ffffff', minHeight: '35vh', marginBottom: '5vh' }}>
          <div className="container">
            <div style={{ paddingLeft: '5vh', paddingRight: '5vh', paddingTop: '10vh', paddingBottom: '10vh' }}>
              <h1>Welcome to CloudCite</h1>
              <p>CloudCite processes citations in the cloud so you never have to create citations manually again.</p>
              <div style={{ textAlign: 'center' }}>
                <Button id="citeButton" onClick={(e) => this.cite("webpage")}>Website</Button>
                <Button id="citeButton" onClick={(e) => this.cite("books")}>Book</Button>
                <Button id="citeButton" onClick={(e) => this.cite("films")}>Film</Button>
                <Button id="citeButton" onClick={(e) => this.cite("other")}>Other</Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <input id="titleInput" placeholder="Project Title" defaultValue={this.props.projects.find(project => project.id === this.props.selectedProject).title} onChange={(e) => this.setProjectTitle(e)}/>
          <div>
            <FavoriteStyleSearch/>
          </div>
          <Bibliography citations={this.props.projects.find((project) => project.id === this.props.selectedProject).citations} />
        </div>
      </ div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
