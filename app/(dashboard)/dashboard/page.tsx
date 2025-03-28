import { redirect } from "next/navigation";

import { getUser } from "@/lib/plugin";
import ActivityPage from "./facture/page";

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // const teamData = await getTeamForUser(user.id);
  //
  // if (!teamData) {
  //   throw new Error('Team not found');
  // }

  return <ActivityPage />;
}
