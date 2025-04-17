export function formatRelativeTime(isoString: Date): string {
  const date = new Date(isoString);
  const now = new Date();

  // Get the difference in seconds
  let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) diffInSeconds = -diffInSeconds; // Handle future timestamps

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}
export function MessageformatRelativeTime(isoString: Date): string {
  const dateString = isoString;
  const date = new Date(dateString);

  // Extract hours, minutes, and seconds
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${hours}:${minutes}`;
}
