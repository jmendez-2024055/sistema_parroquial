const getInitials = (user) => {
  const name = user?.name ?? user?.fullName ?? user?.username ?? user?.email ?? 'Usuario';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const AvatarUser = ({ user }) => (
  <div className="avatar-user" aria-hidden="true">
    {getInitials(user)}
  </div>
);

export default AvatarUser;
