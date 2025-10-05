import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Form = {
  name: string
  city: string
  address: string
}

export default function AddTheater() {
  const { register, handleSubmit, reset } = useForm<Form>()
  const onSubmit = async (data: Form) => {
    try {
      const res = await api.post('/admin/add-theater', data)
      if (res.data?.success) {
        toast.success('Theater added')
        reset()
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add theater')
    }
  }
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Add Theater</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} required />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} required />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register('address')} required />
        </div>
        <Button type="submit">Add Theater</Button>
      </form>
    </div>
  )
}


