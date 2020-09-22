import * as lib from '../../../components/diagnostic/regionselectors';

test('method getAllRegions()', () => {
  const output = lib.getAllRegions();
  expect(output.length).toEqual(0);
});

test('method getSelectedRegion()', () => {
  const output = lib.getSelectedRegion();
  expect(output.length).toEqual(0);
});

test('method getRegionsList()', () => {
  const output = lib.getRegionsList();
  expect(output).toBeDefined();
});
