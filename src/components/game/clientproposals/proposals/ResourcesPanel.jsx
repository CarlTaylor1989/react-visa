import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import ResourceButton from './ResourceButton';
import ResourcePopup from './resources/ResourcePopup';
import scrollBarSettings from '../../../../config/scrollBar';

import './ResourcesPanel.scss';

class ResourcesPanel extends Component {
  constructor(props) {
    super(props);
    this.clientResources = this.getClientResources();
    this.getClientResources = this.getClientResources.bind(this);
  }

  getClientResources() {
    const { client } = this.props;
    return I18n.t(`clientprops.clients.${client}.resources`);
  }

  render() {
    const {
      client,
      isResourcePopupOpen,
      selectedResourceType,
      selectedResourceId,
      onOpenResourcePopup,
      onCloseResourcePopup
    } = this.props;

    this.resources = Object.keys(this.clientResources).map(resourceId => (
      <ResourceButton
        key={resourceId}
        id={resourceId}
        client={client}
        handleClick={onOpenResourcePopup}
      />
    ));

    return (
      <div className="resourcesPanel">
        <Translate className="title" value="clientprops.resourcesTitle" />
        <Translate className="text" value="clientprops.resourcesText" />
        <div className="scrollingArea">
          <ScrollBar {...scrollBarSettings}>
            <div className="resourcesWrapper">{this.resources}</div>
          </ScrollBar>
        </div>
        <ResourcePopup
          showPopup={isResourcePopupOpen}
          closePopup={onCloseResourcePopup}
          type={selectedResourceType}
          resourceId={selectedResourceId}
          client={client}
          resources={this.clientResources}
        />
      </div>
    );
  }
}

ResourcesPanel.propTypes = {
  client: PropTypes.string.isRequired,
  isResourcePopupOpen: PropTypes.bool.isRequired,
  selectedResourceType: PropTypes.string.isRequired,
  selectedResourceId: PropTypes.string.isRequired,
  onOpenResourcePopup: PropTypes.func.isRequired,
  onCloseResourcePopup: PropTypes.func.isRequired,
};

export default ResourcesPanel;
