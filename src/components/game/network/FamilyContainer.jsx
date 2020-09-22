import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InlineSVG from 'svg-inline-react';
import MapText from './MapText';
import ProductIcon from './ProductIcon';
import ChallengeIcon from './ChallengeIcon';
import challengeData from '../../../translations/en_us/network/maps/map1/challenges/index';
import productData from '../../../translations/en_us/network/maps/map1/products/index';
import familyData from '../../../translations/en_us/network/maps/map1/families.json';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS
} from '../../../config/constants';

import './FamilyContainer.scss';

export class FamilyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedChallenges: []
    };
  }

  componentDidMount() {
    this.setState({
      completedChallenges: this.getCompletedChallenges()
    });
  }

  getCompletedChallenges() {
    const { challenges, familyId } = this.props;

    const completedChallenges = challenges.filter(ch => ch.familyId === familyId
      && (ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS));
    return completedChallenges.map(ch => ch.id);
  }

  render() {
    const { familyId, mapId } = this.props;
    const { completedChallenges } = this.state;
    const currentFamilyData = familyData[familyId];
    // Create family name component
    const familyName = (
      <MapText
        key={currentFamilyData.id}
        nameCoord={currentFamilyData.nameCoord}
        type={`familyName ${currentFamilyData.type} ${currentFamilyData.nameCoord.classes
          ? currentFamilyData.nameCoord.classes.join(' ')
          : ''}`}
      />
    );

    // Create product icon and product name components
    const productIconsNames = [];
    productData[familyId].forEach((data) => {
      productIconsNames.push((
        <ProductIcon
          key={`${data.familyId}${data.id}`}
          coordinates={data.coordinates}
          productId={data.id}
          familyId={data.familyId}
          status={data.status || 0}
          mapId={mapId}
          priorityPosition={data.priorityPosition}
          useButton
        />
      ), (
        <MapText
          key={`name${data.familyId}${data.id}`}
          nameCoord={data.nameCoord}
          type={`productName ${data.nameCoord.classes
            ? data.nameCoord.classes.join(' ')
            : ''} ${data.nameCoord.type ? data.nameCoord.type : ''}`}
        />
      ));
    });

    // Create challenge icon component
    const challengeIcons = challengeData[familyId].map(data => (
      <ChallengeIcon
        key={`${familyId}${data.id}`}
        challengeId={data.id}
        coordinates={data.coordinates}
        familyId={familyId}
      />
    ));
    const svg = require(`../../../resources/${mapId}/${familyId}/${familyId}.svg`); // eslint-disable-line

    return (
      <div className={`familyContainer ${familyId} ${completedChallenges.join(' ')}`}>
        <InlineSVG className="family" src={svg} />
        {challengeIcons}
        {productIconsNames}
        {familyName}
      </div>
    );
  }
}

FamilyContainer.propTypes = {
  challenges: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges
});

export default connect(
  mapStateToProps
)(FamilyContainer);
