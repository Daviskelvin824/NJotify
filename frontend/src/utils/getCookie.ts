export default function getCookie(cname: string): string {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim(); // Use trim() for simplicity
    if (c.startsWith(name)) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
