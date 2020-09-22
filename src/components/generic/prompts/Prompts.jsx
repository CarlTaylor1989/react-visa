import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../../actions/index';
import PromptsPopup from './PromptsPopup';
import SummaryPropmpt from './SummaryPrompt';
import {
  ACHIEVEMENT_PROMPT,
  BONUS_STREAK_PROMPT,
  PRODUCT_PROMPT,
  RANK_PROMPT
} from '../../../config/constants';

export class Prompts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPrompt: false,
      prompts: [],
      index: 0,
      summaryPrompt: false
    };

    this.onClosePrompt = this.onClosePrompt.bind(this);
    this.onDisplayPrompt = this.onDisplayPrompt.bind(this);
    this.onExitPrompt = this.onExitPrompt.bind(this);
    this.closeSummaryPrompt = this.closeSummaryPrompt.bind(this);
  }

  componentDidMount() {
    const {
      displayPrompts,
      paused
    } = this.props;

    if (displayPrompts && !paused) {
      this.setPrompts();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      displayPrompts,
      paused
    } = this.props;

    if ((!prevProps.displayPrompts && displayPrompts && !prevProps.paused && !paused)
      || (prevProps.paused && !paused)) {
      this.setPrompts();
    }
  }

  onClosePrompt() {
    const { prompts, index } = this.state;
    const noOfAchievements = prompts.filter(
      prompt => prompt.type === ACHIEVEMENT_PROMPT
    ).length;
    const indexValue = noOfAchievements > 1 && prompts[index].type === ACHIEVEMENT_PROMPT
      ? noOfAchievements - 1
      : index;

    this.setState({ displayPrompt: false, index: indexValue });
  }

  onDisplayPrompt(index, prompts) {
    const { paused } = this.props;
    const state = {
      displayPrompt: !paused,
      index
    };
    if (prompts && prompts.length) {
      state.prompts = prompts;
    }
    this.setState(state);
  }

  onExitPrompt() {
    const { setHintsPaused } = this.props;
    const { index, prompts } = this.state;

    if (index + 1 < prompts.length) {
      this.onDisplayPrompt(index + 1, prompts);
      if (prompts[index].type !== prompts[index + 1].type) {
        this.removePrompts(prompts[index].type);
      }
    } else {
      setHintsPaused(false);
      this.removePrompts(prompts[index].type);
      this.setState({
        index: 0,
        prompts: [],
        summaryPrompt: true
      });
    }
  }

  setPrompts() {
    const {
      achievements,
      bonusStreak,
      categories,
      productFamily,
      productMap,
      products,
      setDisplayPrompts,
      setHintsPaused,
      ranks
    } = this.props;

    const prompts = achievements.map(ac => ({
      id: ac,
      type: ACHIEVEMENT_PROMPT
    }));

    ranks.forEach(rank => prompts.push({
      id: rank,
      type: RANK_PROMPT
    }));

    products.forEach(product => prompts.push({
      id: product,
      family: productFamily,
      map: productMap,
      type: PRODUCT_PROMPT
    }));

    if (bonusStreak) {
      prompts.push({
        type: BONUS_STREAK_PROMPT
      });
    }

    if (prompts.length) {
      setHintsPaused(true);
      this.onDisplayPrompt(0, prompts);
    } else {
      const categoriesWithScores = [];
      _.forOwn(categories, (value, key) => {
        if (value) {
          categoriesWithScores.push(key);
        }
      });
      this.setState({
        summaryPrompt: categoriesWithScores.length > 0
      }, () => {
        if (categoriesWithScores.length > 0) {
          setDisplayPrompts();
        }
      });
    }
  }

  closeSummaryPrompt() {
    const { resetDisplayedPrompts } = this.props;
    resetDisplayedPrompts();
    this.setState({
      summaryPrompt: false
    });
  }

  displayPrompts() {
    const { prompts } = this.state;
    this.setState({ displayPrompt: prompts.length > 0 });
  }

  removePrompts(type) {
    const {
      resetAchievementPrompts,
      resetBonusStreakPrompt,
      resetProductPrompt,
      resetRankPrompt
    } = this.props;

    if (type === ACHIEVEMENT_PROMPT) {
      resetAchievementPrompts();
    } else if (type === PRODUCT_PROMPT) {
      resetProductPrompt();
    } else if (type === RANK_PROMPT) {
      resetRankPrompt();
    } else if (type === BONUS_STREAK_PROMPT) {
      resetBonusStreakPrompt();
    }
  }

  render() {
    const { setPlayAudio } = this.props;
    const {
      displayPrompt,
      index,
      prompts,
      summaryPrompt
    } = this.state;

    return (
      <div className="prompts">
        {summaryPrompt ? (
          <SummaryPropmpt closeSummary={this.closeSummaryPrompt} />
        ) : (
          <PromptsPopup
            showPopup={displayPrompt}
            closePopup={this.onClosePrompt}
            exitPopup={this.onExitPrompt}
            index={index}
            prompts={prompts}
            setPlayAudio={setPlayAudio}
          />
        )}
      </div>
    );
  }
}

Prompts.propTypes = {
  achievements: PropTypes.array.isRequired,
  bonusStreak: PropTypes.number.isRequired,
  categories: PropTypes.object.isRequired,
  displayPrompts: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  productFamily: PropTypes.string.isRequired,
  productMap: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  ranks: PropTypes.array.isRequired,
  resetAchievementPrompts: PropTypes.func.isRequired,
  resetBonusStreakPrompt: PropTypes.func.isRequired,
  resetDisplayedPrompts: PropTypes.func.isRequired,
  resetProductPrompt: PropTypes.func.isRequired,
  resetRankPrompt: PropTypes.func.isRequired,
  setDisplayPrompts: PropTypes.func.isRequired,
  setHintsPaused: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  achievements: state.promptsData.achievements,
  bonusStreak: state.promptsData.bonusStreak,
  categories: state.scoreData.categories,
  displayPrompts: state.promptsData.show,
  paused: state.promptsData.paused,
  productFamily: state.mapData.currentFamily,
  productMap: state.mapData.currentMap,
  products: state.promptsData.products,
  ranks: state.promptsData.ranks
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prompts);
