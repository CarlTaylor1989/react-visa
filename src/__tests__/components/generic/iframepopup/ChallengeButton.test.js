/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ChallengeButton from '../../../../components/generic/iframepopup/ChallengeButton';
import { getChallengeStatus } from '../../../../lib/map';
import { CHALLENGE_COMPLETED_CLASS } from '../../../../config/constants';

jest.mock('../../../../lib/map');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    btnIndex: 2,
    familyId: 'm1f2',
    onChangeChallenge: jest.fn(),
    selectedIndex: 1,
    status: 1
  };

  getChallengeStatus.mockImplementation(() => ({
    className: CHALLENGE_COMPLETED_CLASS,
    disabled: false
  }));
});

test('renders the ChallengeButton component', () => {
  const wrapper = shallow(<ChallengeButton {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ChallengeButton component and sets the class to current', () => {
  const wrapper = shallow(<ChallengeButton {...mockProps} selectedIndex={mockProps.btnIndex} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onClick()', () => {
  const wrapper = shallow(<ChallengeButton {...mockProps} />);
  wrapper.instance().onClick();
  expect(mockProps.onChangeChallenge).toHaveBeenCalledWith(mockProps.btnIndex);
});
