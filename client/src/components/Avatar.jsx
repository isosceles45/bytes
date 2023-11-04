export default function Avatar({ userId, username }) {
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
  console.log(userIdBase10, colorIndex, color);

  return (
    <div className={`flex items-center justify-center h-8 w-8 ${color} rounded-full`}>
      {username.charAt(0).toUpperCase()}
    </div>
  );
}
