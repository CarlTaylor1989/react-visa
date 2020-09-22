import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import { getUnloadEventName } from '../../../../../lib/app';
import { sendResourceStatement } from '../../../../../lib/clients';

import './CategoryResource.scss';

class CategoryResource extends Component {
  constructor() {
    super();
    this.timeAvailable = null;
  }

  componentDidMount() {
    this.timeAvailable = new Date();
    window.addEventListener(getUnloadEventName(), this.sendStatement);
  }

  componentWillUnmount() {
    this.sendStatement();
    window.removeEventListener(getUnloadEventName(), this.sendStatement);
  }

  sendStatement() {
    const { client, resourceIndex } = this.props;
    const description = Object.keys(
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.products`)
    ).map(product => (
      I18n.t(
        `clientprops.clients.${client}.resources.${resourceIndex}.products.${product}.categoryText`
      )
    ));
    sendResourceStatement(
      client,
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.id`),
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.name`),
      description.join(' '),
      this.timeAvailable,
      1
    );
  }

  render() {
    const { client, resourceIndex } = this.props;
    return (
      <div className="categoryResource">
        <Translate
          className="categoryTitle"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.title`}
        />
        <Translate
          className="subtitle"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.subtitle`}
        />
        {Object.keys(
          I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.products`)
        ).map((product, index) => (
          <div className="productsWrapper" key={`category${index.toString()}`}>
            <div className="product">
              <span className="icon" />
              <Translate
                dangerousHTML
                className="productText"
                value={
                  // eslint-disable-next-line max-len
                  `clientprops.clients.${client}.resources.${resourceIndex}.products.${product}.categoryText`
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}


CategoryResource.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string.isRequired
};

export default CategoryResource;
