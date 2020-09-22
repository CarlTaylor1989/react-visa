export const lib = {};
lib.getIframeDoc = iframe => iframe.contentDocument || iframe.contentWindow.document;
lib.createStyleElement = () => document.createElement('style');

export const hideCourseExit = (iframe) => {
  try {
    const iframeDoc = lib.getIframeDoc(iframe);
    // Iframe created by Cornerstone to load the SCO
    const activeFrame = iframeDoc.getElementById('activityFrame');
    const activeFrameDoc = lib.getIframeDoc(activeFrame);
    const style = lib.createStyleElement();
    style.textContent = '.strapControls #exitL{display:none !important;}';
    activeFrameDoc.head.appendChild(style);
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
};
