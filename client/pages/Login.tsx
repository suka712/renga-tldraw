import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle, } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useEffect, useState } from 'react'
import { LucideEdit2, RefreshCcw } from 'lucide-react'

type Toggle = 'login' | 'otp' | 'request'

export const Portal = () => {
  const [toggle, setToggle] = useState<Toggle>('login')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  useEffect(() => {
    setToggle('otp')
  }, [])


  const handleSubmitEmail: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    try {
      await fetch(`/api/auth/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      setToggle('otp')
    } catch (e) {
      console.log('Shit went wrong:', e)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className="w-full max-w-sm py-10" >
        <CardHeader className='flex flex-col pt-4 items-center justify-center'>
          <CardTitle className='text-md text-secondary'>sukaseven/portal</CardTitle>
          <CardTitle className='pt-4 text-xl'>Welcome back</CardTitle>
          <CardDescription className='text-secondary'>
            Login to see cool shit
          </CardDescription>
        </CardHeader>
        <CardContent>

          <form>
            <div className="flex flex-col gap-6">
              <div className="">
                {toggle === 'login' &&
                  <>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className='mt-2'
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="poophead@sukaseven.com"
                      required
                    />
                  </>
                }

                {toggle === 'otp' &&
                  <>
                    <Label htmlFor="email">{`OTP sent to ${email}`}</Label>
                    <div className='flex justify-between mt-2'>
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={v => setOtp(v)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button variant={'outline'}><LucideEdit2 /></Button>
                      <Button variant={'outline'}><RefreshCcw /></Button>
                    </div>
                  </>
                }
              </div>
            </div>
          </form>

        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" onClick={handleSubmitEmail} className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Request Access?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}