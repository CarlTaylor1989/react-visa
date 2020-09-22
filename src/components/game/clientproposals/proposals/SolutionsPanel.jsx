import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScrollBar from 'react-scrollbars-custom';
import ProductButton from './ProductButton';
import SolutionsInfo from './SolutionsInfo';
import { CLIENT_GIVENUP } from '../../../../config/constants';
import Arrows from '../../../generic/arrows/Arrows';
import ActionCreators from '../../../../actions/index';
import scrollBarSettings from '../../../../config/scrollBar';
import {
  checkSolutionCorrectness,
  getNumberOfCorrectSolutions,
  getSolutionStatus,
  sendClientQuestionStatement
} from '../../../../lib/clients';

import './SolutionsPanel.scss';

export class SolutionsPanel extends Component {
  constructor(props) {
    super(props);

    this.products = I18n.t(`clientprops.clients.${props.clientData.id}.products`);

    this.state = {
      products: this.getProductsIds().reduce(
        (ids, id) => ({
          ...ids,
          [id]: {
            ...getSolutionStatus(
              props.clientData.id,
              props.answeredCorrectly,
              props.clientData && props.clientData.status === CLIENT_GIVENUP,
              id
            )
          }
        }),
        {}
      ),
      canSubmit: false,
      displayInfo: false,
      solutionId: ''
    };

    this.timeAvailable = null;
    this.questionChoices = null;

    this.closeInfo = this.closeInfo.bind(this);
    this.onProductChange = this.onProductChange.bind(this);
    this.onLearnMore = this.onLearnMore.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.timeAvailable = new Date();
    this.questionChoices = [];
  }

  componentDidUpdate(prevProps) {
    const { answeredCorrectly, clientData, displaySoluFeedback } = this.props;

    if (prevProps.displaySoluFeedback && !displaySoluFeedback
      && !prevProps.answeredCorrectly && !answeredCorrectly) {
      const { products } = this.state;
      const updatedProducts = {};

      Object.keys(products).forEach((id) => {
        updatedProducts[id] = {
          ...products[id],
          disabled: clientData && clientData.status === CLIENT_GIVENUP,
          selected: false
        };
      });
      this.setSolutionSubmit(false, updatedProducts);
    }
  }

  onProductChange(id) {
    const { products } = this.state;
    let noOfSelected = 0;

    Object.keys(products).forEach((product) => {
      const value = product === id ? !products[product].selected : products[product].selected;
      noOfSelected = value ? noOfSelected + 1 : noOfSelected;
    });

    this.setState(prevState => ({
      canSubmit: noOfSelected > 0,
      products: {
        ...prevState.products,
        [id]: {
          ...prevState.products[id],
          selected: !prevState.products[id].selected
        }
      }
    }));
  }

  onLearnMore(id) {
    this.setState({
      displayInfo: true,
      solutionId: id
    });
  }

  onSubmit() {
    const { clientData, setPromptsPaused, setSolutionFeedback } = this.props;
    const { products } = this.state;
    const updatedProducts = {};
    let noOfCorrect = 0;
    let noOfIncorrect = 0;
    const answers = [];
    const correctResponses = [];

    Object.keys(products).forEach((id) => {
      const productCorrectness = checkSolutionCorrectness(clientData.id, id);
      noOfCorrect = (products[id].selected && checkSolutionCorrectness(clientData.id, id))
        ? noOfCorrect + 1
        : noOfCorrect;
      noOfIncorrect = products[id].selected && !checkSolutionCorrectness(clientData.id, id)
        ? noOfIncorrect + 1
        : noOfIncorrect;

      updatedProducts[id] = {
        ...products[id],
        disabled: true
      };

      if (products[id].selected) {
        answers.push(id);
      }

      if (productCorrectness) {
        correctResponses.push(id);
      }
    });

    setPromptsPaused(true);
    this.setSolutionSubmit(false, updatedProducts);
    const correct = getNumberOfCorrectSolutions(clientData.id) === noOfCorrect && !noOfIncorrect;
    setSolutionFeedback(correct);

    sendClientQuestionStatement(
      clientData.id,
      this.questionChoices,
      correctResponses,
      answers,
      correct,
      this.timeAvailable,
      2
    );
  }

  setSolutionSubmit(canSubmit, products) {
    this.setState({
      canSubmit,
      products: Object.assign({}, products)
    });
  }

  getAllProducts() {
    const { clientData } = this.props;
    const { products } = this.state;
    this.questionChoices = [];

    return Object.keys(this.products).map((product) => {
      const id = I18n.t(`clientprops.clients.${clientData.id}.products.${product}.id`);
      const text = I18n.t(`clientprops.clients.${clientData.id}.products.${product}.text`);
      this.questionChoices.push({
        id,
        text
      });
      return (
        <ProductButton
          client={clientData.id}
          key={product}
          id={product}
          disabled={products[id].disabled}
          productId={id}
          isSelected={products[id].selected}
          onProductChange={this.onProductChange}
          onLearnMore={this.onLearnMore}
        />
      );
    });
  }

  getProductsIds() {
    const { clientData } = this.props;
    return Object.keys(this.products)
      .map(product => I18n.t(`clientprops.clients.${clientData.id}.products.${product}.id`));
  }

  closeInfo() {
    this.setState({
      displayInfo: false,
      solutionId: ''
    });
  }

  render() {
    const { answeredCorrectly, clientData } = this.props;
    const {
      canSubmit,
      displayInfo,
      products,
      solutionId
    } = this.state;

    const allProducts = this.getAllProducts();
    const lengthOfAllProducts = allProducts.length;
    const lengthOfProductsSelected = Object.keys(products).filter(
      p => products[p].selected
    ).length;
    const hasGivenUp = clientData && clientData.status === CLIENT_GIVENUP;

    return (
      <div className="solutionsPanel">
        <div className="group">
          <div className="info">
            <Translate className="title" value="clientprops.solutionsSet.solutionsTitle" />
            <Arrows />
            <Translate className="text" value="clientprops.solutionsSet.solutionsText" />
          </div>
          <div className="scrollingArea">
            <ScrollBar {...scrollBarSettings}>
              <div className="solutionsWrapper">
                <Translate
                  className="productsTitle"
                  value="clientprops.solutionsSet.productsTitle"
                />
                <Translate
                  className="solutionCount"
                  value="clientprops.solutionsSet.solutionsCount"
                  selected={lengthOfProductsSelected}
                  total={lengthOfAllProducts}
                />
                <div className="productsList">
                  {allProducts}
                </div>
              </div>
            </ScrollBar>
          </div>
          <SolutionsInfo
            id={solutionId}
            client={clientData.id}
            closeInfo={this.closeInfo}
            showInfo={displayInfo}
          />
        </div>
        {!answeredCorrectly && !hasGivenUp && (
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

SolutionsPanel.defaultProps = {
  clientData: null
};

SolutionsPanel.propTypes = {
  answeredCorrectly: PropTypes.bool.isRequired,
  clientData: PropTypes.object,
  displaySoluFeedback: PropTypes.bool.isRequired,
  setPromptsPaused: PropTypes.func.isRequired,
  setSolutionFeedback: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(SolutionsPanel);
