export const capitalize = str => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};
export const errorHandler = error => {
  let code = capitalize(
    error?.code?.toString()?.replace('auth/', '')?.replace('-', ' '),
  );
  let message = error?.message?.replace(`[${error?.code}] `, '');
  return {
    code,
    message,
  };
};
