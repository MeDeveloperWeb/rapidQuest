export async function apiGET(path, params) {
  try {
    const apiParams = new URLSearchParams(params);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/${path}?${apiParams.toString()}`
    );

    if (!res.ok) {
      console.log(res.statusText);
      return {
        error: res.statusText,
        data: null,
      };
    }

    const data = await res.json();

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.log(error?.message || "Something went wrong");
    return {
      data: null,
      error: error?.message || "Something went wrong",
    };
  }
}
