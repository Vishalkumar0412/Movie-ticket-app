import { Link } from 'react-router-dom'

export default function Admin() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/add-movie" className="border rounded p-4 hover:bg-gray-50">Add Movie</Link>
        <Link to="/admin/add-theater" className="border rounded p-4 hover:bg-gray-50">Add Theater</Link>
        <Link to="/admin/add-show" className="border rounded p-4 hover:bg-gray-50">Add Showtime</Link>
      </div>
    </div>
  )
}


