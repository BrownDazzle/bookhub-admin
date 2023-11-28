
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Button from "./Button";
import prismadb from "@/lib/prismadb";
import getCurrentUser from "@/actions/get-current-user";
import UserMenu from "./ui/UserMenu";

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
