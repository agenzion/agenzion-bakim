const REMOTE_IMAGE_SRC_PATTERN = /^https?:\/\//i;
const LOCAL_IMAGE_SRC_PATTERN = /^\//;
const DATA_IMAGE_SRC_PATTERN = /^data:image\//i;

export function getSafeImageSrc(src?: string | null) {
  const value = src?.trim();

  if (!value) {
    return null;
  }

  if (
    REMOTE_IMAGE_SRC_PATTERN.test(value) ||
    LOCAL_IMAGE_SRC_PATTERN.test(value) ||
    DATA_IMAGE_SRC_PATTERN.test(value)
  ) {
    return value;
  }

  return null;
}

export function isRemoteImageSrc(src?: string | null) {
  const value = getSafeImageSrc(src);
  return Boolean(value && REMOTE_IMAGE_SRC_PATTERN.test(value));
}
