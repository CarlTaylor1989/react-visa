/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  FamilyContainer,
  mapStateToProps
} from '../../../../components/game/network/FamilyContainer';


let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [{
      id: 'c1',
      familyId: 'm1f2',
      status: 3
    }, {
      id: 'c2',
      familyId: 'm1f2',
      status: 4
    }, {
      id: 'c3',
      familyId: 'm1f2',
      status: 1
    }],
    familyId: 'm1f2',
    mapId: 'm1'
  };
});

test('renders the FamilyContainer component', () => {
  const wrapper = shallow(<FamilyContainer {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  const state = {
    mapData: {
      challenges: []
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.mapData
  });
});
