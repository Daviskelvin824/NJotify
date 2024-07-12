const setCookie = (cName: string, cValue: string, expDays: number) => {
  const date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000); // Set expiration time in milliseconds
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${cName}=${cValue}; ${expires}; path=/`; // Adjust path as needed
};

export default setCookie;
