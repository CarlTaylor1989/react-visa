import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import { bindActionCreators } from 'redux';
import StatementsGroup from './StatementsGroup';
import StatementsInstruction from './StatementsInstruction';
import ActionCreators from '../../../../actions/index';
import CheckboxLabel from '../../../generic/checkboxlabel/CheckboxLabel';
import scrollBarSettings from '../../../../config/scrollBar';
import {
  checkStatementCorrectness,
  getNumberOfCorrectStatements,
  getStatementStatus,
  getRequirementStatements,
  getRequirementStatementIds,
  sendClientQuestionStatement
} from '../../../../lib/clients';

import './Requirements.scss';

export class Requirements extends Component {
  constructor(props) {
    super(props);
    const statementIds = getRequirementStatementIds(props.client);
    this.state = {
      canSubmit: false,
      checkboxes: statementIds.reduce(
        (ids, id) => ({
          ...ids,
          [id]: {
            ...getStatementStatus(props.client, props.answeredCorrectly, id)
          }
        }),
        {}
      )
    };

    this.timeAvailable = null;
    this.questionChoices = null;

    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.timeAvailable = new Date();
    this.questionChoices = [];
  }

  componentDidUpdate(prevProps) {
    const { answeredCorrectly, client, displayReqFeedback } = this.props;

    // Feedback closed
    if (prevProps.displayReqFeedback && !displayReqFeedback
      && !prevProps.answeredCorrectly && !answeredCorrectly) {
      const { checkboxes } = this.state;
      const updatedCheckboxes = {};
      let noOfSelected = 0;

      Object.keys(checkboxes).forEach((id) => {
        const isCorrect = checkboxes[id].selected && checkStatementCorrectness(client, id);
        noOfSelected = isCorrect ? noOfSelected + 1 : noOfSelected;

        updatedCheckboxes[id] = {
          ...checkboxes[id],
          disabled: isCorrect,
          selected: isCorrect
        };
      });
      this.setCheckboxesSubmit(noOfSelected > 0, updatedCheckboxes);
    }
  }

  onCheckboxChange(id) {
    const { checkboxes } = this.state;
    let noOfSelected = 0;
    Object.keys(checkboxes).forEach((chk) => {
      const value = chk === id ? !checkboxes[chk].selected : checkboxes[chk].selected;
      noOfSelected = value ? noOfSelected + 1 : noOfSelected;
    });

    this.setState(prevState => ({
      canSubmit: noOfSelected > 0,
      checkboxes: {
        ...prevState.checkboxes,
        [id]: {
          ...prevState.checkboxes[id],
          selected: !prevState.checkboxes[id].selected
        }
      }
    }));
  }

  onSubmit() {
    const { client, setRequirementFeedback, closeResourcePopup } = this.props;
    const { checkboxes } = this.state;
    const updatedCheckboxes = {};
    let noOfCorrect = 0;
    let noOfIncorrect = 0;
    const answers = [];
    const correctResponses = [];

    Object.keys(checkboxes).forEach((id) => {
      const statementCorrectness = checkStatementCorrectness(client, id);
      noOfCorrect = (checkboxes[id].selected && statementCorrectness)
        ? noOfCorrect + 1
        : noOfCorrect;
      noOfIncorrect = checkboxes[id].selected && !statementCorrectness
        ? noOfIncorrect + 1
        : noOfIncorrect;

      updatedCheckboxes[id] = {
        ...checkboxes[id],
        disabled: true
      };

      if (checkboxes[id].selected) {
        answers.push(id);
      }

      if (statementCorrectness) {
        correctResponses.push(id);
      }
    });

    this.setCheckboxesSubmit(false, updatedCheckboxes);
    const correct = getNumberOfCorrectStatements(client) === noOfCorrect && !noOfIncorrect;
    setRequirementFeedback(correct);

    if (!correct) {
      closeResourcePopup();
    }

    sendClientQuestionStatement(
      client,
      this.questionChoices,
      correctResponses,
      answers,
      correct,
      this.timeAvailable,
      1
    );
  }

  setCheckboxesSubmit(canSubmit, checkboxes) {
    this.setState({
      canSubmit,
      checkboxes: Object.assign({}, checkboxes)
    });
  }

  createStatements() {
    const { client } = this.props;
    const { checkboxes } = this.state;
    const stmList = getRequirementStatements(client);
    const groupedStatements = _.groupBy(stmList, 'type');
    const statements = [];
    this.questionChoices = [];

    Object.keys(groupedStatements).forEach((group) => {
      statements.push((
        <StatementsGroup
          key={group}
          client={client}
          group={group}
        />
      ));

      groupedStatements[group].forEach((value, index) => {
        const groupText = I18n.t(`clientprops.${group}`);
        this.questionChoices.push({
          id: value.id,
          text: `${groupText}: ${value.text}`
        });
        statements.push((
          <CheckboxLabel
            key={`${group}${value.id}${index.toString()}`}
            elementId={value.id}
            label={value.text}
            disabled={checkboxes[value.id].disabled}
            isSelected={checkboxes[value.id].selected}
            onCheckboxChange={this.onCheckboxChange}
          />));
      });
    });

    return statements;
  }

  render() {
    const { answeredCorrectly, client } = this.props;
    const { canSubmit } = this.state;
    const statements = this.createStatements();

    return (
      <div className={`requirements${answeredCorrectly ? ' completed' : ''}`}>
        <div className="group">
          <StatementsInstruction client={client} completed={answeredCorrectly} />
          <div className="scrollingArea">
            <ScrollBar {...scrollBarSettings}>
              <div className="statementsWrapper">{statements}</div>
            </ScrollBar>
          </div>
        </div>
        {!answeredCorrectly && (
          <button
            type="button"
            className="submitBtn"
            disabled={!canSubmit}
            onClick={this.onSubmit}
          >
            <Translate value="clientprops.submitBtn" />
          </button>
        )}
      </div>
    );
  }
}

Requirements.propTypes = {
  answeredCorrectly: PropTypes.bool.isRequired,
  client: PropTypes.string.isRequired,
  displayReqFeedback: PropTypes.bool.isRequired,
  setRequirementFeedback: PropTypes.func.isRequired,
  closeResourcePopup: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(Requirements);
