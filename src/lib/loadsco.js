export const lib = {};

lib.createFrame = (doc, name) => {
  const frame = doc.createElement('frame');
  frame.id = name;
  frame.name = name;
  frame.url = 'result.thml';
  return frame;
};

lib.setupFramesHandles = (scope) => {
  const me = scope;
  me.frmRequest = scope.parent.frames.frmRqst;
  // because of network latency sometimes the content of the request frame
  // is not completly loaded. Check if the form fields exists, if not try to get it again.
  if (typeof (me.frmRequest) === 'undefined') {
    window.setTimeout(() => {
      lib.setupFramesHandles(scope);
    }, 500);
    return;
  }
  me.frmRequestGet = scope.parent.frames.frmRsltGetLeo;
};

lib.getParam = (scope) => {
  const me = scope;
  me.communicateCommand = 'getparam';
  me.communicateParam = '';
  me.communicateFrame = 'frmRsltGetLeo';
  me.Communicate();
  me.GetParamResult();
};

export const loadSco = (iframe) => {
  const doc = iframe.contentDocument;

  if (doc) {
    const frameset = doc.querySelector('frameset');
    if (frameset) {
      const frame = lib.createFrame(doc, 'frmRsltGetLeo');
      frameset.append(frame);

      const winIframe = iframe.contentWindow;
      const apiElement = winIframe.document.querySelector('#frmApi');

      if (apiElement) {
        const winApi = apiElement.contentWindow;
        winApi.SetupFramesHandles = lib.setupFramesHandles(winApi);
        winApi.GetParam = lib.getParam(winApi); // Run initialization
      }
    }
  }
};
