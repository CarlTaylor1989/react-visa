import getPercentageComplete from '../../lib/productscompleted';

test('function getPercentageComplete', () => {
  const completed = 5;
  const total = 25;
  const output = getPercentageComplete(completed, total);
  expect(output).toEqual(20);
});
