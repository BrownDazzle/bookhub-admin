import { redirect } from "next/navigation";


import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";
import getCurrentUser from "@/actions/get-current-user";

const SettingsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={{}} />
      </div>
    </div>
  );
}

export default SettingsPage;
