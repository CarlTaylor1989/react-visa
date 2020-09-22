import React from 'react';
import PropTypes from 'prop-types';
import CallResource from './CallResource';
import EmailResource from './EmailResource';
import ReportResource from './ReportResource';
import QuoteResource from './QuoteResource';
import MeetingResource from './MeetingResource';
import CategoryResource from './CategoryResource';


const ResouceContent = ({
  client,
  resourceIndex,
  type
}) => (
  <>
    {type === 'call' && <CallResource client={client} resourceIndex={resourceIndex} />}
    {type === 'email' && <EmailResource client={client} resourceIndex={resourceIndex} />}
    {type === 'report' && <ReportResource client={client} resourceIndex={resourceIndex} />}
    {type === 'quote' && <QuoteResource client={client} resourceIndex={resourceIndex} />}
    {type === 'meeting' && <MeetingResource client={client} resourceIndex={resourceIndex} />}
    {type === 'category' && <CategoryResource client={client} resourceIndex={resourceIndex} />}
  </>
);

ResouceContent.defaultProps = {
  resourceIndex: ''
};

ResouceContent.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default ResouceContent;
