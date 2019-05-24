// Borrowed from https://github.com/joola/echo-ui-plugin-sankey/blob/develop/public/lib/observe_resize.js
module.exports = function ($elem, fn, frequency) {

  var currentFrequency = frequency || 500;
  var currentHeight = $elem.height();
  var currentWidth = $elem.width();

  function checkLoop() {
    setTimeout(function () {
      if (currentHeight !== $elem.height() || currentWidth !== $elem.width()) {
        currentHeight = $elem.height();
        currentWidth = $elem.width();

        if (currentWidth > 0 && currentWidth > 0) fn();
      }
      checkLoop();
    }, currentFrequency);
  }
  checkLoop();
};
