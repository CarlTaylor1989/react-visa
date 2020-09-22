import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import ProgressBar from '../../progressbar/ProgressBar';
import {
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../../../../config/constants';

import './ProductCompletion.scss';

export const ProductCompletion = (props) => {
  const {
    challenges,
    familyId,
    productId
  } = props;

  const productChallenges = challenges.filter(ch => (
    ch.productId === productId && ch.familyId === familyId
  ));
  const completed = productChallenges.filter(ch => (
    ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS
  ));
  const percent = (completed.length / productChallenges.length) * 100;

  return (
    <div className="productCompletion">
      <div className="progress">
        {completed.length}
        <Translate value="generic.dashboard.productProgressDivider" />
        {productChallenges.length}
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
};

ProductCompletion.propTypes = {
  challenges: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges
});

export default connect(
  mapStateToProps
)(ProductCompletion);
