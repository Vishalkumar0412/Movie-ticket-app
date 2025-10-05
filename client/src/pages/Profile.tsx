import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"

function Profile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <p>Please log in to view your profile.</p>
        <Link to="/login"><Button className="mt-3">Login</Button></Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>Manage your profile information.</FieldDescription>
        <FieldSeparator />

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile Picture" width={80} height={80} />
            ) : (
              <span className="text-gray-500 text-xl">👤</span>
            )}
          </div>
        </div>

        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>Your full name</FieldDescription>
            </FieldContent>
            <Input id="name" defaultValue={user.name} disabled />
          </Field>
          <FieldSeparator />

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldDescription>Primary login email</FieldDescription>
            </FieldContent>
            <Input id="email" type="email" defaultValue={user.email} disabled />
          </Field>
          <FieldSeparator />

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <FieldDescription>User role in the system</FieldDescription>
            </FieldContent>
            <Input id="role" defaultValue={user.role} disabled />
          </Field>
          <FieldSeparator />
        </FieldGroup>
      </FieldSet>

      {user.role === 'ADMIN' ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Admin Panel</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin"><Button variant="outline">Dashboard</Button></Link>
            <Link to="/admin/add-movie"><Button>Add Movie</Button></Link>
            <Link to="/admin/add-theater"><Button>Add Theater</Button></Link>
            <Link to="/admin/add-show"><Button>Add Showtime</Button></Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/movies"><Button>Browse Movies</Button></Link>
            <Link to="/my-bookings"><Button variant="outline">My Bookings</Button></Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
