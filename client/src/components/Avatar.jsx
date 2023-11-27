export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-red-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200",
  ];

  const userIdBase10 = parseInt(userId, 12);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={`flex relative items-center justify-center h-8 w-8 ${color} rounded-full`}
    >
      {online && (
        <div className="absolute top-0 right-0 rounded-full w-2 h-2 shadow-md bg-green-400"></div>
      )}
      {username?.charAt(0).toUpperCase()}
    </div>
  );
}
