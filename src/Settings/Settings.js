import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
// import './settings.scss';

const FavoriteStyleSearch = React.lazy(() => import('../FavoriteStyleSearch/FavoriteStyleSearch.js'));
const LocaleSearch = React.lazy(() => import('../LocaleSearch/LocaleSearch.js'));
const StyleSearch = React.lazy(() => import('../StyleSearch/StyleSearch.js'));

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

class Settings extends Component {
  render() {
    return (
      <div className="settingsContainer">
        <h1 id="settingsHeader"><Icon className="settings" /> Settings</h1>
        <div className="options">
          <label className="settingsLabel">Favorite Styles</label>
          <FavoriteStyleSearch />
          <label className="settingsLabel">Locales</label>
          <LocaleSearch />
          <label className="settingsLabel">Styles</label>
          <StyleSearch />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);