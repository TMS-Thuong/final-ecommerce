const imageCache = new Map<string, string>();

export const getCachedImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  if (imageCache.has(url)) {
    return imageCache.get(url) || '';
  }
  
  imageCache.set(url, url);
  return url;
};

export const preloadImages = (urls: (string | null | undefined)[]): void => {
  urls.forEach(url => {
    if (!url || imageCache.has(url)) return;
    imageCache.set(url, url);
  });
};

export const getThumbnailFromImages = (images: any[] | undefined | null): string => {
  if (!images || images.length === 0) return '';
  
  const thumbnail = images.find(img => img.isThumbnail) || images[0];
  return getCachedImageUrl(thumbnail?.imageUrl);
};