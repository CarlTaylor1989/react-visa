import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';
import ProgressBar from '../progressbar/ProgressBar';
import getPercentageComplete from '../../../lib/productscompleted';
import productData from '../../../translations/en_us/network/maps/map1/products/index';
import {
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS,
} from '../../../config/constants';

import './ProductsCompleted.scss';

export const ProductsCompleted = (props) => {
  const { challenges } = props;
  const completed = challenges.filter(ch => (
    ch.isFinal === true
    && (ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS)
  ));
  let total = 0;
  _.forIn(productData, (data) => {
    total += data.length;
  });

  const percent = getPercentageComplete(completed.length, total);
  return (
    <div className="productsCompleted">
      <Translate value="generic.miniDashboard.productsCompleted" />
      <div className="completedContainer">
        <div className="completed">
          {completed.length}
          <div className="divider">
            <Translate value="generic.miniDashboard.productsDivider" />
          </div>
          {total}
        </div>
        <div className="progress">
          <ProgressBar percent={percent} colour="white" />
        </div>
      </div>
    </div>
  );
};

ProductsCompleted.propTypes = {
  challenges: PropTypes.array.isRequired,
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges
});

export default connect(
  mapStateToProps
)(ProductsCompleted);
