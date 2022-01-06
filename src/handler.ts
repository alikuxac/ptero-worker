import getMethod from "./handlers/getMethod";
import postMethod from "./handlers/postMethod";

export async function handleRequest(request: Request): Promise<Response> {
  const token = request.headers.get('Authorization');
  if (!token || !token?.startsWith('Bearer') || token.split(' ')[1] !== PTERO_API) {
    return new Response('Unauthorized', { status: 401 });
  }

  switch (request.method) {
    case "GET":
      return getMethod(request);
    case "POST":
      return postMethod(request);
    default:
      return new Response("Not implemented", { status: 404 });

  }
}
