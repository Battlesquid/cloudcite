import React, { Component, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './navbar.scss';


const App = lazy(() => import("../App.js"));
const Projects = lazy(() => import('../Projects/Projects.js'));
const CiteForm = lazy(() => import('../CiteForm/CiteForm.js'));

function loadingComponent(Component) {
  return props => (
    <Suspense fallback={<div />}>
      <Component {...props} />
    </Suspense>
  );
}

export class Navbar extends Component {

  render() {
    return (
      <React.Fragment>
        <div id="navbar" className="nav">
          <Link className="closeHam" to="/">CloudCite</Link>
          <Link className="closeHam" to="/projects">Projects</Link>
          <a href="https://api.cloudcite.net/" target="_blank" className="closeHam" rel="noopener noreferrer">API</a>
          <a href="https://cloudcite.net/blog" target="_blank" className="closeHam" rel="noopener noreferrer">Blog</a>
          <a href="https://status.cloudcite.net/" target="_blank" className="closeHam" rel="noopener noreferrer">Status</a>
          <a href="https://help.cloudcite.net/" target="_blank" className="closeHam" rel="noopener noreferrer">Help</a>
          <a href="https://feedback.cloudcite.net/" target="_blank" className="closeHam" rel="noopener noreferrer">Feedback</a>
          <a href="https://github.com/Hackdromeda/cloudcite/" target="_blank" className="closeHam" rel="noopener noreferrer">Contribute</a>
          <a id="burger" href="javascript:void(0)">X</a>
        </div>
        <Switch>
          <Route path="/" exact component={loadingComponent(App)} />
          <Route path="/projects" component={loadingComponent(Projects)} />
          <Route path="/cite" component={loadingComponent(CiteForm)} />
        </Switch>
      </React.Fragment>
    )
  }
}

export default Navbar;