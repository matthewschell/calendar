const activeAudios = {};

export const preloadMedia = (url) => {
  if (!url || activeAudios[url]) return;
  
  // Using native Audio object bypasses CORS restrictions entirely
  const audio = new Audio(url);
  audio.preload = 'auto'; 
  activeAudios[url] = audio;
};

export const playAudio = (url, onEnded = null) => {
  if (!url) {
    if (onEnded) onEnded();
    return;
  }
  
  if (!activeAudios[url]) {
    preloadMedia(url);
  }
  
  const audio = activeAudios[url];
  if (audio) {
    const playClone = audio.cloneNode();
    playClone.volume = 1.0;
    
    if (onEnded) {
      playClone.onended = onEnded;
    }
    
    playClone.play().catch(e => {
      console.warn('Audio play blocked:', e);
      if (onEnded) onEnded(); 
    });
  } else {
    if (onEnded) onEnded();
  }
};

export const preloadEntireLibrary = (urls) => {
  console.log(`[Media Engine] Native background caching of ${urls.length} files...`);
  urls.forEach(url => {
    if (url) preloadMedia(url);
  });
};