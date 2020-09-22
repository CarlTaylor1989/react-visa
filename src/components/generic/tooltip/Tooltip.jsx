import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import Tippy from '@tippy.js/react';
import { DISPLAY_TOOLTIPS_AFTER } from '../../../config/constants';

import './Tooltip.scss';

export const Tooltip = (props) => {
  const {
    children,
    enabled,
    fieldName,
    forceHide,
    textProps
  } = props;

  const tooltipContent = (
    <Translate
      dangerousHTML
      value={fieldName}
      {...textProps}
    />
  );

  return (
    <>
      {!forceHide && (
        <Tippy
          arrow
          content={tooltipContent}
          delay={[DISPLAY_TOOLTIPS_AFTER, null]}
          enabled={enabled}
          theme="visa"
          touch={false}
          trigger="mouseenter"
        >
          {children}
        </Tippy>
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool.isRequired,
  fieldName: PropTypes.string.isRequired,
  forceHide: PropTypes.bool,
  textProps: PropTypes.object
};

Tooltip.defaultProps = {
  forceHide: false,
  textProps: {}
};

export const mapStateToProps = state => ({
  enabled: state.settingsData.tooltips
});

export default connect(
  mapStateToProps
)(Tooltip);
