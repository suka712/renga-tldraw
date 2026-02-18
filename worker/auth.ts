import { error, IRequest, json } from 'itty-router';
import { Resend } from 'resend';

export const handleEmailOTP = async (request: IRequest, env: Env) => {
  const resend = new Resend(env.RESEND_API_KEY)

  const { email } = await request.json() as { email: string }

  const otp = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000
  const otpString = otp.toString().padStart(6, '0')

  try {
    await resend.emails.send({
      from: 'khiem@sukaseven.com',
      to: `${email}`,
      subject: 'TldRenga OTP',
      html: `
        <p>Your OTP to TldRenga is <b>${otpString}</b></p>
        <br>
        <p>Expiring in 5 minutes</p>
        `
    });

    await env.AUTH_KV.put(`otp:${email}`, `${otpString}`, {
      expirationTtl: 5 * 60
    })

    console.log('Successfully sent email and stored otp')
  } catch (e) {
    console.log('Failed to send email and store OTP:', e)
    return error(500, 'Something went wrong')
  }
  return json({ ok: true })
}

export const handleVerifyOTP = async (request: Request, env: Env) => {
  const { otp, email } = await request.json() as { otp: string, email: string }

  const stored = await env.AUTH_KV.get(`otp:${email}`)

  let token
  try {
    if (stored !== otp) throw new Error('Invalid OTP')

    token = crypto.randomUUID()
    await env.AUTH_KV.put(`session:${token}`, email, { expirationTtl: 7 * 24 * 60 * 60 })
  } catch (e) {
    return error(401, `${e}`)
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    }
  })
}

export const handleLogout = async (request: IRequest, env: Env) => {
  const cookie = request.headers.get('cookie')
  const token = cookie?.match(/token=([^;]+)/)?.[1]

  if (token) await env.AUTH_KV.delete(`session:${token}`)

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `token=; HttpOnly; Secure; Max-Age=0; Path=/`
    }
  })
}

export const requireAuth = async (request: IRequest, env: Env, _ctx?: ExecutionContext) => {
  const cookie = request.headers.get('cookie')
  const token = cookie?.match(/token=([^;]+)/)?.[1]

  if (!token) return error(401, 'Unauthorized')

  const email = await env.AUTH_KV.get(`session:${token}`)
  if (!email) return error(401, 'Invalid session')

  request.email = email
}