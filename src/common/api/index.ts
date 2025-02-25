/* eslint-disable @typescript-eslint/no-explicit-any */
export const apiBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;

export async function get({
  apiEndpoint,
  params,
}: {
  apiEndpoint: string;
  params?: any;
}) {
  const response = await fetch(`${apiEndpoint}${getParams(params)}`, {
    method: "GET",
  });

  if (!response.ok) {
    return handleError(response);
  }

  const parsedResponse = await response.json();

  return parsedResponse;
}

export async function post({
  apiEndpoint,
  body,
  responseHeader,
}: {
  apiEndpoint: string;
  body?: any;
  responseHeader?: any;
}) {
  const response = await fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...responseHeader,
    },
  });

  if (!response.ok) {
    return handleError(response);
  }

  // 204 No Content - return nothing.
  if (response.status === 204) {
    return null;
  }

  const parsedResponse = await response.json();

  return parsedResponse;
}

export async function patch({
  apiEndpoint,
  data,
  responseHeader,
}: {
  apiEndpoint: string;
  data: any;
  responseHeader?: any;
}) {
  const response = await fetch(apiEndpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...responseHeader,
    },
  });

  if (!response.ok) {
    return handleError(response);
  }

  const parsedResponse = await response.json();

  return parsedResponse;
}

export async function del({
  apiEndpoint,
  params,
}: {
  apiEndpoint: string;
  params: any;
}) {
  const response = await fetch(`${apiEndpoint}${getParams(params)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return handleError(response);
  }

  return response.ok;
}

function getParams(params: any) {
  const filteredParams: any[] = [];

  if (params) {
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        if (Array.isArray(params[key])) {
          params[key].forEach((value) => {
            filteredParams.push([`${key}[]`, value]);
          });
        } else {
          filteredParams.push([key, params[key]]);
        }
      }
    });
  }

  const search = new URLSearchParams(filteredParams).toString();

  return search ? `?${search}` : "";
}

async function handleError(response: Response) {
  let errorMsg = `API Error (${response.status}): An error occurred with your request.`;

  try {
    const responseJson = await response.json();

    if (responseJson && responseJson.message) {
      errorMsg = `API Error (${response.status}): ${responseJson.message}`;
    } else {
      errorMsg = `API Error (${response.status}): No specific error message provided.`;
    }
  } catch (error: any) {
    return error;
  }

  throw new Error(errorMsg);
}
