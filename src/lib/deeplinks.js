/**
 * Gets the SCO url from a cornestone deeplink
 */
import { LMS_URL } from '../config/constants';

export const lib = {};

const sendRequest = (url, success, error) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (success) {
          success(xhr.responseText);
        }
      } else if (error) {
        error();
      }
    }
  };
  xhr.open('GET', url);
  xhr.send(null);
};
lib.sendRequest = sendRequest;

const getStringBetween = (text, str1, str2) => {
  let str = '';
  const firstPart = text.split(str1);
  if (firstPart.length === 2) {
    const secondPart = firstPart[1].split(str2);
    if (secondPart.length === 2) {
      str = secondPart[0];
    }
  }
  return str;
};
lib.getStringBetween = getStringBetween;

const getFinalLink = (response, callback) => {
  const url = lib.getStringBetween(
    response,
    'coursePopupWindow = popupTitle("',
    '",1'
  );
  callback(url);
};
lib.getFinalLink = getFinalLink;

const getSecondLink = (response, options) => {
  const location = lib.getStringBetween(response, 'url=', '"><title>');
  if (location) {
    const newUrl = LMS_URL + location;
    lib.sendRequest(
      newUrl,
      (responseText) => {
        lib.getFinalLink(responseText, options.success);
      },
      options.error
    );
  } else {
    const url = lib.getStringBetween(
      response,
      'coursePopupWindow = popupTitle("',
      '",1'
    );
    if (url) {
      options.success(url);
    } else {
      options.error();
    }
  }
};
lib.getSecondLink = getSecondLink;

const getFirstLink = (response, options) => {
  const location = lib.getStringBetween(
    response,
    'window.location = \'../scorm/',
    '\';var htmlElem'
  );
  if (location) {
    const newUrl = LMS_URL + location;
    lib.sendRequest(
      newUrl,
      (responseText) => {
        lib.getSecondLink(responseText, options);
      },
      options.error
    );
  } else {
    options.error();
  }
};
lib.getFirstLink = getFirstLink;

export const getDeeplinkURL = (url, options) => {
  lib.sendRequest(
    url,
    (response) => {
      lib.getFirstLink(response, options);
    },
    options.error
  );
};
