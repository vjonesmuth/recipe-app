import React, { Component } from 'react';
import Page from '../Page';
import GitHubLogin from 'react-github-login';
import AuthHandler from '../../AuthHandler';
import userServiceSingleton from '../../UserService';

const authHandler = new AuthHandler();

export default class LoginPage extends Component {
  /**
   * Handle successful login
   *
   * @param {Object} response
   * @public
   */
  onSuccess = async response => {
    await userServiceSingleton.handleLoginSuccess(response);
    this.props.history.push('/');
  };

  /**
   * Handle error login
   *
   * @param {Object} response
   * @public
   */
  onFailure = response => console.error('error', response);

  /**
   * Render the form.
   *
   * @public
   */
  render() {
    return (
      <Page pageTitle="Login">
        <GitHubLogin
          clientId={userServiceSingleton.clientId}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
          redirectUri={authHandler.endpoints.redirectUri}
        />
      </Page>
    );
  }
}