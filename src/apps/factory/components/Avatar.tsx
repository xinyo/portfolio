import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import agentAvatar20 from "@/assets/avatar/agent_avatar_20.svg";

const avatarImages: Record<string, string> = {
  "agent_avatar_20.svg": agentAvatar20,
};

type FactoryAvatarProps = {
  avatar: string;
  name: string;
};

export function FactoryAvatar({ avatar, name }: FactoryAvatarProps) {
  const avatarSrc = avatarImages[avatar];
  const fallback = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="factory-account-avatar">
      <AvatarImage src={avatarSrc} alt="" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
