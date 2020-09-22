/* eslint-disable import/no-extraneous-dependencies */
import {
  configure,
  mount,
  render,
  shallow
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

configure({
  adapter: new Adapter()
});

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;

// Fail tests on any warning
// eslint-disable-next-line no-console
console.error = (message) => {
  throw new Error(message);
};

const matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {}
});
window.matchMedia = window.matchMedia || matchMedia;

const requestAnimationFrame = callback => setTimeout(callback, 0);
window.requestAnimationFrame = window.requestAnimationFrame || requestAnimationFrame;
