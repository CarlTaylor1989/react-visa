export default function removeCSSTransitionKey(json) {
  if (json.type === 'CSSTransition') {
    return {
      ...json,
      props: {
        ...json.props,
        key: ''
      }
    };
  }
  return json;
}
