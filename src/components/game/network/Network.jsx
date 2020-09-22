import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NetworkMap from './NetworkMap';
import ProductPage from './products/ProductPage';
import { networkMapPath, networkProductPath } from '../../../config/navigation';

import './Network.scss';
import '../../generic/PageTransitions.scss';

const Network = ({ location }) => (
  <TransitionGroup className="network-transition-group">
    <CSSTransition
      key={location.pathname.replace('/', '_')}
      timeout={{ enter: 1000, exit: 1000 }}
      classNames="pageFade"
    >
      <div className="network">
        <Switch location={location}>
          <Route path={networkMapPath} component={NetworkMap} />
          <Route path={networkProductPath} component={ProductPage} />
          <Redirect to={networkMapPath} />
        </Switch>
      </div>
    </CSSTransition>
  </TransitionGroup>
);

Network.propTypes = {
  location: ReactRouterPropTypes.location.isRequired
};

export default Network;
