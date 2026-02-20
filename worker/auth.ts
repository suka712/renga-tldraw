import { IRequest } from 'itty-router';
import { config } from './config';

const isNavigationRequest = (request: IRequest) => {
  const upgrade = request.headers.get('upgrade')
  if (upgrade === 'websocket') return false
  const accept = request.headers.get('accept') || ''
  return accept.includes('text/html')
}

const unauthorized = (request: IRequest) => {
  if (isNavigationRequest(request)) {
    return Response.redirect(config.LOGIN_URL, 302)
  }
  return new Response('Unauthorized', { status: 401 })
}

export const requireAuth = async (request: IRequest, _env: Env, _ctx?: ExecutionContext) => {
  const cookie = request.headers.get('cookie')
  const sessionToken = cookie?.match(/session_token=([^;]+)/)?.[1]

  if (!sessionToken) {
    return unauthorized(request)
  }

  const res = await fetch(`${config.API_URL}/auth/session`, {
    headers: { 'Cookie': `session_token=${sessionToken}` },
  })

  if (!res.ok) {
    return unauthorized(request)
  }

  const { email } = await res.json() as { email: string }
  request.email = email
}
