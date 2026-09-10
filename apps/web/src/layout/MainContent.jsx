// apps/web/src/components/maintContent/index.jsx

import { Plus } from "lucide-react";

export default function MainContent() {
  return (
    <main className="px-4 flex-1 flex flex-col min-h-0 bg-white relative">
      {/* chat box */}
      <div className="flex justify-center w-full h-full overflow-y-auto scrollbar-none">
        <div className="w-full max-w-3xl flex flex-col">
          {/* user */}
          <div className="border max-w-2/4 p-2 mt-4 rounded-md bg-gray-100 ml-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
            impedit atque at doloribus, magni esse quidem voluptatem
            voluptatibus hic beatae iste odio sapiente dolorum saepe vero illum
            nostrum praesentium provident!
          </div>

          {/* assistant */}
          <div className="w-full p-2 mt-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            eaque officiis quam necessitatibus nulla voluptas soluta quis porro,
            molestias corporis rerum provident incidunt alias tenetur iste cum
            repudiandae aliquam vel.
          </div>
          {/* user */}
          <div className="border max-w-2/4 p-2 mt-4 rounded-md bg-gray-100 ml-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
            impedit atque at doloribus, magni esse quidem voluptatem
            voluptatibus hic beatae iste odio sapiente dolorum saepe vero illum
            nostrum praesentium provident!
          </div>

          {/* assistant */}
          <div className="w-full p-2 mt-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            eaque officiis quam necessitatibus nulla voluptas soluta quis porro,
            molestias corporis rerum provident incidunt alias tenetur iste cum
            repudiandae aliquam vel.
          </div>
          {/* user */}
          <div className="border max-w-2/4 p-2 mt-4 rounded-md bg-gray-100 ml-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
            impedit atque at doloribus, magni esse quidem voluptatem
            voluptatibus hic beatae iste odio sapiente dolorum saepe vero illum
            nostrum praesentium provident!
          </div>

          {/* assistant */}
          <div className="w-full p-2 mt-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            eaque officiis quam necessitatibus nulla voluptas soluta quis porro,
            molestias corporis rerum provident incidunt alias tenetur iste cum
            repudiandae aliquam vel.
          </div>
          {/* user */}
          <div className="border max-w-2/4 p-2 mt-4 rounded-md bg-gray-100 ml-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
            impedit atque at doloribus, magni esse quidem voluptatem
            voluptatibus hic beatae iste odio sapiente dolorum saepe vero illum
            nostrum praesentium provident!
          </div>

          {/* assistant */}
          <div className="w-full p-2 mt-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            eaque officiis quam necessitatibus nulla voluptas soluta quis porro,
            molestias corporis rerum provident incidunt alias tenetur iste cum
            repudiandae aliquam vel.
          </div>
          {/* user */}
          <div className="border max-w-2/4 p-2 mt-4 rounded-md bg-gray-100 ml-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
            impedit atque at doloribus, magni esse quidem voluptatem
            voluptatibus hic beatae iste odio sapiente dolorum saepe vero illum
            nostrum praesentium provident!
          </div>

          {/* assistant */}
          <div className="w-full p-2 mt-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            eaque officiis quam necessitatibus nulla voluptas soluta quis porro,
            molestias corporis rerum provident incidunt alias tenetur iste cum
            repudiandae aliquam vel.
          </div>
        </div>
      </div>

      {/* prompt input */}
      <div className="flex justify-center relative">
        <div className="w-full max-w-3xl border absolute bottom-1 rounded-lg bg-white p-2 box-border shadow-[0_0_25px_20px_rgba(255,255,255,1)]">
          <form action="">
            {/* input */}
            <textarea
              name="prompt"
              id=""
              rows={1}
              placeholder="Tanyakan apa saja..."
              autoFocus
              className="py-2 w-full resize-none outline-none"
            ></textarea>

            {/* uploade */}
            <div className="flex flex-row flex-nowrap">
              <div className="">
                <label
                  htmlFor="uploade"
                  className="inline-block rounded-[50%] p-1.5 cursor-pointer hover:bg-gray-200"
                >
                  <Plus size={25} />
                </label>

                <input type="file" name="uploade" id="uploade" hidden />
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
