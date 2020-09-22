export const history = {
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  length: 0,
  listen: jest.fn(),
  location: {
    hash: '',
    key: '',
    pathname: '',
    search: ''
  },
  push: jest.fn(),
  replace: jest.fn()
};

export default history;
