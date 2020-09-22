import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ProposalsSelector from './ProposalsSelector';
import ProposalPage from './proposals/ProposalPage';
import { clientsSelectorPath, proposalPath } from '../../../config/navigation';

import './ClientProposals.scss';
import '../../generic/PageTransitions.scss';


const ClientProposals = ({ location }) => (
  <TransitionGroup className="clients-transition-group">
    <CSSTransition
      key={location.pathname.replace('/', '_')}
      classNames="pageFade"
      timeout={{ enter: 1000, exit: 1000 }}
    >
      <div className="clientProposals">
        <Switch location={location}>
          <Route path={clientsSelectorPath} component={ProposalsSelector} />
          <Route path={proposalPath} component={ProposalPage} />
          <Redirect to={clientsSelectorPath} />
        </Switch>
      </div>
    </CSSTransition>
  </TransitionGroup>
);

ClientProposals.propTypes = {
  location: ReactRouterPropTypes.location.isRequired
};

export default ClientProposals;
