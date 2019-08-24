import React, { Component } from 'react';
import { connect } from "react-redux";
import * as action from "./constants/action-types";
import './App.css';
import './css/slider.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { withCookies } from 'react-cookie';
import config from './config';
import { isUserNotLogged, isUserLogged } from './api/Authorization';
import { Redirect } from 'react-router-dom';
import { Login, ImageBrowser, Navigation, WorldMap, ErrorBoundary } from './components';

function mapStateToProps(state, ownProps) {
  return {
    state: state,
    cookies: ownProps.cookies
  };
}

const mapDispatchToProps = dispatch => {
  return {
    initStateByCookies: (cookies) => {
      dispatch({ type: action.INIT_STATE_BY_COOKIES, payload: cookies })
    }
  };
};


export const apolloClient = new ApolloClient({
  link: new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `${token}` : ''
      }
    });
    return forward(operation);
  }).concat(new HttpLink({ uri: config.apiGraphQLUrl })),
  cache: new InMemoryCache()
});

class App extends Component {

  componentDidMount() {
    this.props.initStateByCookies({ cookies: this.props.cookies.cookies });
  }

  render() {

    return (
      <ErrorBoundary>
        <div className="App" style={{ height: "100%" }}>

          <BrowserRouter>
            <ApolloProvider client={apolloClient}>
              <Navigation />
              <Switch>
                {/* TODO: maybe move to rules can do logged/not logged  */}
                <Route path="/" exact render={() => (isUserNotLogged() ? <Login /> : <WorldMap />)} />
                <Route path="/album/:continent/:albumName" isExact="false" render={({ match }) => (isUserNotLogged() ? <Login /> : <ImageBrowser match={match} cookies={this.props.cookies} />)} />
                <Route path="/login" exact render={() => (isUserNotLogged() ? <Login /> : <Redirect to="/" />)} />
                <Route render={() => isUserLogged() ? <Redirect to="/" /> : <Login />} />
              </Switch>
            </ApolloProvider>
          </BrowserRouter>

        </div >
      </ErrorBoundary>
    );
  }

}


export default withCookies(connect(mapStateToProps, mapDispatchToProps)(App));
