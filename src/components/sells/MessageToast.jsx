export default function MessageToast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
}
