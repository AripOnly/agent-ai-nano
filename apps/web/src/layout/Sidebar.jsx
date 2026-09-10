// apps/web/src/components/sidebar/index.jsx

import { Settings, Search, PanelRightOpen, SquarePen } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="relative w-full max-w-64 border border-zinc-500 flex flex-col flex-nowrap">
      {/* sidebar nav */}
      <nav className="flex-1 overflow-y-auto">
        <div className="sticky top-0 flex flex-row flex-nowrap bg-gray-200 p-2 items-center shadow-lg shadow-gray-300">
          <p className="text-2xl flex-1 font-medium">Nano</p>

          <div className="flex flex-row flex-nowrap gap-2">
            <Search></Search>
            <PanelRightOpen></PanelRightOpen>
          </div>
        </div>
        <div className="mt-2 px-2">
          <ul>
            <li className="px-2 py-1 flex flex-nowrap gap-x-2 hover:bg-gray-200 rounded-sm">
              <SquarePen /> <span>New Chat</span>
            </li>
            <li className="px-2 py-1 flex flex-nowrap gap-x-2 hover:bg-gray-200 rounded-sm">
              <SquarePen /> <span>New Chat</span>
            </li>
            <li className="px-2 py-1 flex flex-nowrap gap-x-2 hover:bg-gray-200 rounded-sm">
              <SquarePen /> <span>New Chat</span>
            </li>
          </ul>
        </div>

        <div className="pl-2 py-1 mt-2">
          <p className="text-lg font-medium">Sessions</p>
        </div>

        <div className="px-2">
          <ul>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
            <li className="px-2 py-0.5 hover:bg-gray-200 rounded-sm">
              Session-1
            </li>
          </ul>
        </div>
      </nav>

      {/* sidebar footer */}
      <div className="w-full px-2 py-3 flex flex-row flex-nowrap bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">
        <Settings></Settings>
        <p>Setting</p>
      </div>
    </aside>
  );
}
