import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import ClientLocked from './ClientLocked';
import ClientIcon from './ClientIcon';

import './ClientIconButton.scss';

const ClientIconButton = ({
  client,
  disabled,
  locked,
  onClientSelected,
  selected,
  completed
}) => {
  const problemType = I18n.t(`clientprops.clients.${client}.problemType`);
  let extraClasses = selected ? ' selected' : '';
  extraClasses = completed ? ' completed' : extraClasses;
  extraClasses = locked && locked.id ? ' locked' : extraClasses;

  return (
    <button
      type="button"
      className={`clientIconButton${extraClasses}`}
      onClick={() => onClientSelected(client)}
      disabled={disabled || (locked && locked.id)}
    >
      <ClientIcon client={client} />
      {locked && locked.id && (
        <ClientLocked client={client} locked={locked} />
      )}
      <div className="infoBlock">
        <div className="nameType">
          <Translate className="clientName" value={`clientprops.clients.${client}.name`} />
          <Translate className="clientType" value={`clientprops.problems.${problemType}.cpBtn`} />
        </div>
      </div>
    </button>
  );
};

ClientIconButton.defaultProps = {
  locked: {}
};

ClientIconButton.propTypes = {
  client: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  locked: PropTypes.object,
  onClientSelected: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired
};

export default ClientIconButton;
