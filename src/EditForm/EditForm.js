import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EDIT_CITATION } from '../actions/projects';
const CiteForm = React.lazy(() => import('../CiteForm/CiteForm.js'));

const mapStateToProps = state => ({
  selectedProject: state.projectsReducer.selectedProject,
  projects: state.projectsReducer.projects
});

const mapDispatchToProps = dispatch => ({
  EDIT_CITATION: (project_id, citation_id) => dispatch(EDIT_CITATION(project_id, citation_id))
});

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldMap: [],
      creatorsMap: [],
      citationData: null
    };
  }

  componentDidMount() {
    this.fetchFieldAndCreatorsMaps();
  }

  async fetchFieldAndCreatorsMaps() {
    let citation_id = this.props.projects.find(project => project.id === this.props.selectedProject).edit;
    let type = this.props.projects.find(project => project.id === this.props.selectedProject).citations.find(citation => citation.id === citation_id).type;
    let citationData = this.props.projects.find(project => project.id === this.props.selectedProject).citations.find(citation => citation.id === citation_id);
    if (type) {
      const fieldMap = await fetch(`https://cdn.cloudcite.net/fields/${type}.json`)
        .then((response) => {
            return response.json();
        });
      const creatorsMap = await fetch(`https://cdn.cloudcite.net/creators/${type}.json`)
          .then((response) => {
              return response.json();
          });
      this.setState({
          fieldMap: fieldMap,
          creatorsMap: creatorsMap,
          citationData: citationData
      });
    }
    else {
      this.setState({ citationData: citationData });
    }
  }

  render() {
    return (
      <div>
      {
        this.state.fieldMap.length > 0 && this.state.creatorsMap.length > 0 && this.state.citationData ? 
          <CiteForm citationData={this.state.citationData} fieldMap={this.state.fieldMap} creatorsMap={this.state.creatorsMap} />:
          <div/>
      }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);
