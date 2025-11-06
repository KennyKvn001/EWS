import { UserButton } from "@clerk/clerk-react";

export default function DropdownMenuWithIcon() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10 cursor-pointer",
          userButtonPopoverCard: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl",
          userButtonPopoverActions: "text-gray-700 dark:text-gray-300",
          userButtonPopoverActionButton: "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
          userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-300",
          userButtonPopoverActionButtonIcon: "text-gray-500 dark:text-gray-400",
        },
      }}
    />
  );
}
