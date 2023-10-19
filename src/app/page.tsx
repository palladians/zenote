import { Editor } from "@/components/editor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const HomePage = () => {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between bg-zinc-900 p-4 border-b">
          <h3 className="font-semibold">Random</h3>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-teal-700" />
          </Avatar>
        </header>
      </div>
      <div className="flex p-4">
        <Editor />
      </div>
    </div>
  );
}

export default HomePage
