import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import Arrows from '../../../generic/arrows/Arrows';

import './StatementsInstruction.scss';

const StatementsInstruction = ({ client, completed }) => (
  <div className={`statementsInstruction${completed ? ' completed' : ''}`}>
    <Translate className="title" value="clientprops.requirementsTitle" />
    {completed ? (
      <Translate
        className="text"
        dangerousHTML
        value={`clientprops.clients.${client}.instructionTextFinal`}
      />
    ) : (
      <>
        <Arrows />
        <Translate
          className="text"
          dangerousHTML
          value={`clientprops.clients.${client}.instructionTextInitial`}
        />
      </>
    )}
  </div>
);

StatementsInstruction.propTypes = {
  client: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
};

export default StatementsInstruction;
