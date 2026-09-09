// apps/web/src/layout/index.jsx

import { Settings, Upload, Search, PanelRightOpen } from "lucide-react";

export default function MainLayout() {
  return (
    <>
      <div className="flex w-full h-screen relative overflow-hidden">
        <aside className="relative w-64 border border-zinc-500 flex flex-col flex-nowrap overflow-auto">
          {/* sidebar nav */}
          <nav className="flex-1 overflow-auto">
            <div className="sticky top-0 flex flex-row flex-nowrap bg-gray-200 p-2 items-center shadow-lg shadow-gray-300">
              <p className="text-2xl flex-1 font-medium">Nano</p>

              <div className="flex flex-row flex-nowrap gap-2">
                <Search></Search>
                <PanelRightOpen></PanelRightOpen>
              </div>
            </div>
            <div className="mt-2 px-2">
              <ul>
                <li className="px-2 py-1 hover:bg-gray-200 rounded-sm">
                  New Chat
                </li>
                <li className="px-2 py-1 hover:bg-gray-200 rounded-sm">
                  New Chat
                </li>
                <li className="px-2 py-1 hover:bg-gray-200 rounded-sm">
                  New Chat
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

        <main className="flex-1 flex flex-col min-h-0 bg-white relative">
          {/* chat box */}
          <div className="flex justify-center w-full overflow-y-auto scrollbar-none">
            <div className="w-3xl max-w-3xl flex flex-col mt-4">
              {/* user */}
              <div className="border max-w-2/4 p-2 rounded-md bg-gray-100 ml-auto">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
                impedit atque at doloribus, magni esse quidem voluptatem
                voluptatibus hic beatae iste odio sapiente dolorum saepe vero
                illum nostrum praesentium provident!
              </div>

              {/* assistant */}
              <div className="border w-full p-2 mt-4">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Dolorum eaque officiis quam necessitatibus nulla voluptas soluta
                quis porro, molestias corporis rerum provident incidunt alias
                tenetur iste cum repudiandae aliquam vel.
              </div>
            </div>
          </div>

          {/* prompt input */}
          <div className="flex justify-center relative">
            <div className="w-3xl max-w-3xl border fixed bottom-1 rounded-lg bg-white p-2 box-border shadow-[0_0_25px_20px_rgba(255,255,255,1)]">
              <form action="">
                {/* input */}
                <textarea
                  name="prompt"
                  id=""
                  rows={1}
                  placeholder="Tanyakan apa saja..."
                  autoFocus
                  className="p-2 w-full resize-none outline-none"
                ></textarea>

                {/* uploade */}
                <div className="px-2 mt-4">
                  <div className="">
                    <label
                      htmlFor="uploade"
                      className="inline-block border rounded-[50%] p-1.5 cursor-pointer hover:bg-gray-100"
                    >
                      <Upload size={22} />
                    </label>

                    <input type="file" name="uploade" id="uploade" hidden />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
