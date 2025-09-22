export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p className="text-4xl font-bold">This is the profile page
        <span className="text-red-500 bg-amber-200 rounded-lg p-2 hover:bg-amber-800">{id}</span>
        </p>

    </div>
    )
}

