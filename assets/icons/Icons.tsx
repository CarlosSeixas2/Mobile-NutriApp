import React from "react";
import Calendar from "./calendar.svg";
import CalendarFocus from "./calendar_focus.svg";
import Home from "./home.svg";
import HomeFocus from "./home_focus.svg";
import Message from "./message.svg";
import MessageFocus from "./message_focus.svg";
import Profile from "./profile.svg";
import ProfileFocus from "./profile_focus.svg";

type Props = {
  color: string;
  focused: boolean;
};

export function CalendarIcon({ color, focused }: Props) {
  const IconComponent = focused ? CalendarFocus : Calendar;
  return <IconComponent width={22} height={22} />;
}

export function HomeIcon({ color, focused }: Props) {
  const IconComponent = focused ? HomeFocus : Home;
  return <IconComponent width={23} height={23} />;
}

export function MessageIcon({ color, focused }: Props) {
  const IconComponent = focused ? MessageFocus : Message;
  return <IconComponent width={23} height={23} />;
}

export function ProfileIcon({ color, focused }: Props) {
  const IconComponent = focused ? ProfileFocus : Profile;
  return <IconComponent width={23} height={23} />;
}
