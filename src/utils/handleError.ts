export const handleError = (err: any) => {
  if (err.response?.data) {
    const { message, statusCode } = err.response.data;

    throw new Error(message || `Request failed with status ${statusCode}`);
  }

  if (err.request) {
    throw new Error("Network error. Please check your connection.");
  }

  throw new Error(err.message || "An unexpected error occurred");
};
