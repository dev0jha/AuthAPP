export default function UserProfile({ params }: { params: { id: string } }) {
  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p className="text-4xl font-bold">This is the profile page
        <span className="text-red-500 bg-amber-200 rounded-lg p-2 hover:bg-amber-800">{params.id}</span>
        </p>

    </div>
    )
}

