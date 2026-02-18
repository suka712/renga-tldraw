import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const Portal = () => {
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="poophead@sukaseven.com"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
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