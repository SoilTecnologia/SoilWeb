export const validateLatLongForm = (type: "lat" | "lng", latLong: string) => {
  const number = Number(latLong);
  if (number) {
    return number;
  } else {
    const catchError = {
      type: type,
      error: "Digite somente numeros inteiro ou decimais usando o ponto .",
    };
    return catchError;
  }
};
