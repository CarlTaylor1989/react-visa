/**
 * Removes loader a while after component has finished mounting and rendering
 */
import { REMOVE_LOADER_AFTER } from '../config/constants';

export const lib = {};
lib.removeElement = (el) => {
  if (el.parentNode && el.parentNode.removeChild) {
    el.parentNode.removeChild(el);
  }
};

lib.toggleHiddenClass = (el, show) => {
  if (show) {
    el.classList.add('hidden');
  } else {
    el.classList.remove('hidden');
  }
};

/**
 * Hides the loading gif
 */
export const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      lib.toggleHiddenClass(loader, true);
    }, REMOVE_LOADER_AFTER);
  }
};

/**
 * Displays the loading gif
 */
export const displayLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    lib.toggleHiddenClass(loader, false);
  }
};

/**
 * Close game SCO window
 */
lib.findAndCloseWindow = (win) => {
  win.close();
  if (win.parent) {
    win.parent.open('', '_self', '');
    win.parent.close();
  }
};

export const closeWindow = () => {
  lib.findAndCloseWindow(window);
};

lib.detectDevice = () => {
  const agent = window.navigator.userAgent;
  const deviceWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.getElementsByTagName('body')[0].clientWidth;

  // iPhone
  let isIPhone = agent.match(/iPhone/i) != null;

  // iPad up to iOS 12
  /**
   * iPad Pro when run with no launch screen can have error in userAgent reporting as an iPhone
   * rather than an iPad. iPad Pro width portrait 768, iPhone6 plus 414x736 but would probably
   * always report 414 on app startup
   */
  let isIPad = (agent.match(/iPad/i) !== null)
    || ((agent.match(/iPhone/i) !== null) && (deviceWidth > 750));

  if (isIPad) isIPhone = false;

  // iPad from iOS 13
  const isMacSafari = agent.match(/Macintosh/i) != null;
  if (isMacSafari) { // need to distinguish between Macbook and iPad
    const canvas = document.createElement('canvas');
    if (canvas) {
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (context) {
        const info = context.getExtension('WEBGL_debug_renderer_info');
        if (info) {
          const renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL);
          isIPad = renderer.includes('Apple');
        }
      }
    }
  }

  return {
    isIOS: isIPhone || isIPad,
    isIPhone,
    isIPad,
    isMacSafari
  };
};

/**
 * Returns the unload event name based on the device type
 * @return {string}
 */
export const getUnloadEventName = () => {
  let eventName;
  if (lib.detectDevice().isIOS) {
    eventName = 'pagehide'; // before unload is not not supported on iOS
  } else {
    eventName = 'beforeunload';
  }
  return eventName;
};

/**
 * Returns the width and height of the window based on the device
 * @return {object}
 */
export const getScreenSize = () => {
  let width;
  let height;

  if (lib.detectDevice().isIPad) {
    const vw = window.screen.width;
    const vh = window.screen.height;

    // Ensure the viewport width and height is always reported correctly
    if (Math.abs(window.orientation) / 90 === 1) { // Landscape
      width = vw > vh ? vw : vh;
      height = vw > vh ? vh : vw;
    } else { // Portrait
      width = vw > vh ? vh : vw;
      height = vw > vh ? vw : vh;
    }
  } else {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  return { width, height };
};
