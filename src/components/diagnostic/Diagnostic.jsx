import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import InlineSVG from 'svg-inline-react';
import _ from 'lodash';
import FooterBar from '../generic/footerbar/FooterBar';
import { GoToScreen, newScreenConnect } from '../generic/GoToScreen';
import { getAllRegions, getSelectedRegion, getRegionsList } from './regionselectors';
import { sendInteractionData } from '../../tracking/xapi/XApiAdapter';
import { HINT_DIAGNOSTIC } from '../../config/hints';
import { diagnosticReferrer } from '../../config/referrers';
import map from '../../resources/region_select.svg';

import './Diagnostic.scss';

let regions;
export class Diagnostic extends GoToScreen {
  constructor(props) {
    super(props);
    this.state = {
      selectedRegion: props.region
    };

    this.timeAvailable = null;

    this.onNext = this.onNext.bind(this);
    this.onRegionSelect = this.onRegionSelect.bind(this);
  }

  componentDidMount() {
    const {
      completed,
      setCurrentHintGroup,
      setDiagnosticVisited,
      setPopupReferrer
    } = this.props;

    this.timeAvailable = new Date();
    setCurrentHintGroup(HINT_DIAGNOSTIC);
    setPopupReferrer(diagnosticReferrer);

    setDiagnosticVisited();

    // Get all regions from the SVG
    if (!completed) {
      regions = getAllRegions();
      _.forEach(regions, element => element.addEventListener('click', this.onRegionSelect));
    }
  }

  componentDidUpdate(prevProps) {
    const { completed } = this.props;

    if (!prevProps.completed && completed) {
      this.findAndGoToScreen();
    }
  }

  onNext() {
    const {
      setDiagnosticCompletion,
      setScreenReferrer,
      setRegion
    } = this.props;
    const { selectedRegion } = this.state;
    setRegion(selectedRegion);
    setDiagnosticCompletion(true);
    this.sendTrackingData(selectedRegion);
    setScreenReferrer(diagnosticReferrer);
  }

  sendTrackingData(response) {
    const availableRegions = getRegionsList();
    const choices = Object.keys(availableRegions).map(id => ({
      id: availableRegions[id].code,
      description: availableRegions[id].name
    }));
    sendInteractionData({
      type: 'answered',
      activity: {
        id: 'diagnostic/question/1',
        type: 'choice',
        title: I18n.t('xapi.diagnostic.title'),
        description: I18n.t('xapi.diagnostic.description'),
        choices
      },
      result: {
        completion: true
      },
      response: {
        detail: availableRegions[response].code,
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: 'diagnostic'
    });
  }

  onRegionSelect(e) {
    const { selectedRegion } = this.state;
    const regionEl = e.currentTarget;
    const regionId = regionEl.getAttribute('data-name');

    if (selectedRegion !== regionId) {
      regionEl.classList.add('selected');
      const currentRegionEl = getSelectedRegion(selectedRegion);
      if (currentRegionEl && currentRegionEl[0]) {
        currentRegionEl[0].classList.remove('selected');
      }
      this.setState({ selectedRegion: regionId });
    }
  }

  render() {
    const { selectedRegion } = this.state;
    return (
      <div className="diagnostic">
        <div className="circleLinesLeft" />
        <div className="logo" />
        <div className="circleLinesRight" />
        <div className="woman" />

        <Translate className="pageTitle" value="diagnostic.pageTitle" />
        <Translate className="bodyText" value="diagnostic.bodyText" />
        <Translate className="questionText" value="diagnostic.questionText" />

        <div className="regionsMap">
          <InlineSVG className="regionsSelector" src={map} />
          <Translate className="regionName na" value="diagnostic.regions.na.name" />
          <Translate className="regionName lac" value="diagnostic.regions.lac.name" />
          <Translate className="regionName eu" value="diagnostic.regions.eu.name" />
          <Translate className="regionName cemea" value="diagnostic.regions.cemea.name" />
          <Translate className="regionName ap" value="diagnostic.regions.ap.name" />
          <Translate className="regionName global" value="diagnostic.regions.global.name" />
        </div>

        <button
          type="button"
          className={`okBtn ${selectedRegion === '' ? 'disabled' : ''}`}
          disabled={selectedRegion === ''}
          onClick={this.onNext}
        >
          <Translate value="diagnostic.okBtn" />
        </button>
        <FooterBar changeRegion={this.onChangeRegion} />
      </div>
    );
  }
}

Diagnostic.propTypes = {
  region: PropTypes.string.isRequired,
  setRegion: PropTypes.func.isRequired,
  setCurrentHintGroup: PropTypes.func.isRequired,
  setDiagnosticVisited: PropTypes.func.isRequired,
  setPopupReferrer: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  completed: state.diagnosticData.completed,
  region: state.diagnosticData.region
});

export default newScreenConnect(Diagnostic, mapStateToProps);
