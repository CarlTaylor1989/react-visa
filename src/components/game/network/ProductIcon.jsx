import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import InlineSVG from 'svg-inline-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tooltip from '../../generic/tooltip/Tooltip';
import ActionCreators from '../../../actions/index';
import {
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS,
  PRODUCT_INCOMPLETE_CLASS,
  PRODUCT_COMPLETED_CLASS
} from '../../../config/constants';
import { networkProductPath } from '../../../config/navigation';
import priorities from '../../../config/priorities';

import './ProductIcon.scss';

export class ProductIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ''
    };
    this.onProductClick = this.onProductClick.bind(this);
  }

  componentDidMount() {
    this.updateProductState();
  }

  componentDidUpdate(prevProps) {
    const {
      currentProduct,
      lastChallengesModified,
      productId,
      mapInitialised
    } = this.props;
    if ((prevProps.lastChallengesModified !== lastChallengesModified
      && currentProduct === productId)
      || (!prevProps.mapInitialised && mapInitialised)) {
      this.updateProductState();
    }
  }

  onProductClick() {
    const {
      familyId,
      mapId,
      productId,
      setCurrentFamilyProduct
    } = this.props;
    setCurrentFamilyProduct(mapId, familyId, productId);
  }

  updateProductState() {
    const {
      challenges,
      familyId,
      productId,
      lastChallengesModified
    } = this.props;
    const { status } = this.state;
    let newStatus = PRODUCT_INCOMPLETE_CLASS;

    const found = challenges.find(challenge => challenge.familyId === familyId
      && (challenge.id === lastChallengesModified[0]
        || challenge.status === CHALLENGE_COMPLETION_STATUS
        || challenge.status === CHALLENGE_PERFECT_STATUS)
      && challenge.isFinal
      && challenge.productId === productId);

    // Is final challenge completed
    if (found && (found.status === CHALLENGE_COMPLETION_STATUS
      || found.status === CHALLENGE_PERFECT_STATUS)) {
      newStatus = PRODUCT_COMPLETED_CLASS;
    }

    if (status !== newStatus) {
      this.setState({ status: newStatus });
    }
  }

  render() {
    const {
      coordinates,
      familyId,
      mapId,
      priorityPosition,
      productId,
      region,
      type,
      useButton
    } = this.props;
    const { status } = this.state;

    const styles = {
      left: coordinates[0],
      top: coordinates[1]
    };

    let isPriority = false;
    if (priorities[region] && priorities[region][familyId]) {
      isPriority = priorities[region][familyId].includes(productId);
    }

    const svg = require(`../../../resources/${mapId}/${familyId}/products/${productId}.svg`); // eslint-disable-line

    let content;
    if (useButton) {
      content = (
        <span className="productIconWrapper" style={styles}>
          {isPriority && (
            <Tooltip fieldName="generic.tooltips.product.flag">
              <span className={`flag ${priorityPosition}`} />
            </Tooltip>
          )}
          <Tooltip fieldName="generic.tooltips.productnetwork.product">
            <span>
              <NavLink
                to={networkProductPath}
                className={`productIcon button ${familyId} ${productId} ${type} ${status}`}
                onClick={this.onProductClick}
              >
                <InlineSVG className="icon" src={svg} />
              </NavLink>
            </span>
          </Tooltip>
        </span>
      );
    } else {
      content = (
        <span style={styles} className={`productIcon ${familyId} ${productId} ${type} ${status}`}>
          {isPriority && (
            <Tooltip fieldName="generic.tooltips.productnetwork.flag">
              <span className={`flag ${priorityPosition}`} />
            </Tooltip>
          )}
          <InlineSVG className="icon" src={svg} />
        </span>
      );
    }

    return (content);
  }
}

ProductIcon.propTypes = {
  challenges: PropTypes.array.isRequired,
  coordinates: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  lastChallengesModified: PropTypes.array.isRequired,
  currentProduct: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired,
  mapInitialised: PropTypes.bool.isRequired,
  priorityPosition: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  setCurrentFamilyProduct: PropTypes.func.isRequired,
  type: PropTypes.string,
  useButton: PropTypes.bool
};

ProductIcon.defaultProps = {
  type: '',
  useButton: true
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  lastChallengesModified: state.mapData.lastChallengesModified,
  currentProduct: state.mapData.currentProduct,
  mapInitialised: state.mapData.initialised,
  region: state.diagnosticData.region
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductIcon);
