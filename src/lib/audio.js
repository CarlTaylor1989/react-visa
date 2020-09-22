export const getAudioPlayer = () => document.getElementById('gameAudioPlayer');

export const getAppRoot = () => {
  const href = window.location.href;
  const appRoot = href.substring(0, href.lastIndexOf('#'));
  return appRoot.substring(0, appRoot.lastIndexOf('/') + 1);
};
