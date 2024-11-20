import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function AppearancePage() {
  return (
    <div className="w-[90%] mx-auto pt-16">
      <h2 className="text-2xl font-bold">Fiókbeállítások</h2>
      <p className="text-muted-foreground pt-2">
        Fiókbeállítások kezelése és testreszabása.
      </p>
      <hr className="my-6" />
      <div className="flex">
        <ProfileNavbar />
        <div className="ml-12 mt-2 w-[50%]">
          <h3 className="text-xl font-medium">Megjelenés</h3>
          <p className="text-muted-foreground text-sm pt-2">
            Itt testreszabhatod az alkalmazás megjelenését.
          </p>
          <hr className="my-6" />
          <h4 className="font-medium text-sm">Téma beállítása</h4>
          <p className="text-muted-foreground text-xs pt-2">
            Válaszd ki az alkalmazás témáját.
          </p>

          <div className="flex gap-10 mt-2">
            <div>
              <input type="radio" className="hidden"  />
              <div
                className={`items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}
              >
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-sm text-center pt-2">Világos</h4>
            </div>
            <div>
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <input type="radio" className="hidden" />
                <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-sm text-center pt-2">Sötét</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
