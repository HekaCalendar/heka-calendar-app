/**
 * SCROLL FIX - DISABLED
 * Native scrollbar is now handling everything
 */
(function() {
  'use strict';
  
  // Remove any custom hex scrollbar if it exists
  function cleanup() {
    const hexScrollbars = document.querySelectorAll('.hex-scrollbar');
    hexScrollbars.forEach(el => el.remove());
  }
  
  cleanup();
  setTimeout(cleanup, 1000);
  setTimeout(cleanup, 3000);
  
})();
