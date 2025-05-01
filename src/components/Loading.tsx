const Loading = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <img
        src="/Logo-2.png"
        alt="Loading"
        className="w-48 h-24"
      />
      <div className="mt-4 text-gray-600">Loading...</div>
    </div>
  );
}

export default Loading;