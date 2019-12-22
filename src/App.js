import React, { Component, Suspense, lazy } from 'react';
import { connect } from "react-redux";
import * as action from "./constants/action-types";
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { withCookies } from 'react-cookie';
import config from './config';
import { isUserNotLogged, isUserLogged } from './api/Authorization';
import { Redirect } from 'react-router-dom';
import { Login, Navigation, WorldMap, ErrorBoundary, AboutMe } from './components';

const ImageBrowser = lazy(() => import('./components/ImageBrowser'));

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

  state = {
    windowWidth: 0,
    windowHeight: 0
  };

  componentDidMount() {
    this.props.initStateByCookies({ cookies: this.props.cookies.cookies });

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    this.setState({ windowWidth, windowHeight });
  }

  getGoogleToken(location) {

    if (!location || !location.hash) {
      return "";
    }

    const hash = location.hash;
    const parsed = hash.split("&").find(item => item.startsWith("id_token")).split("=")[1];
    return parsed;
  }

  render() {

    const { windowWidth } = this.state;

    const styles = {
      showLeftMenu: windowWidth > 900
    };

    return (
      <ErrorBoundary>
        <div className="App" style={{ height: "100%", width: "100%" }}>

          <BrowserRouter>
            <ApolloProvider client={apolloClient}>
              <Navigation />
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  {/* TODO: maybe move to rules can do logged/not logged  */}
                  <Route path="/" exact render={() => (isUserNotLogged() ? <Login /> : <WorldMap />)} />
                  <Route path="/google-login" isExact="false" render={({ location }) => <Login googleToken={this.getGoogleToken(location)} />} />
                  <Route path="/album/:continent/:albumName" isExact="false" render={({ match }) => (isUserNotLogged() ? <Login /> : <ImageBrowser match={match} styles={styles} cookies={this.props.cookies} />)} />
                  <Route path="/login" exact render={() => (isUserNotLogged() ? <Login /> : <Redirect to="/" />)} />
                  <Route path="/aboutme" exact render={() => <AboutMe></AboutMe>} />
                  <Route render={() => isUserLogged() ? <Redirect to="/" /> : <Login />} />
                </Switch>
              </Suspense>
            </ApolloProvider>
          </BrowserRouter>

        </div >
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    state: state,
    cookies: ownProps.cookies,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    initStateByCookies: (cookies) => {
      dispatch({ type: action.INIT_STATE_BY_COOKIES, payload: cookies })
    }
  };
};


export default withCookies(connect(mapStateToProps, mapDispatchToProps)(App));
