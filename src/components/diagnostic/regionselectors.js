import { I18n } from 'react-redux-i18n';

export const getAllRegions = () => document.querySelectorAll('.regionsSelector .region');

export const getSelectedRegion = region => document.querySelectorAll(`[data-name='${region}']`);

export const getRegionsList = () => I18n.t('diagnostic.regions');
