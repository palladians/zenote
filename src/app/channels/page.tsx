

import { Navbar } from "@/components/navbar";

const HomePage = async () => {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <Navbar title="Dashboard" />
      <div className="container flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Bookmarks</h2>
      </div>
    </div>
  );
}

export default HomePage
