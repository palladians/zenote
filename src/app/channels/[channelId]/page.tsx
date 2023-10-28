

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { EditorForm } from "@/components/forms/editor-form";
import { NotesList } from "@/components/notes-list";
import { ConfirmDeleteNoteDialog } from "@/components/confirm-delete-note-dialog";

const ChannelPage = async ({ params }: { params: { channelId: string } }) => {
  const { channel } = await api.channels.get.query({ id: params.channelId })
  if (!channel) return null
  return (
    <div className="flex flex-col flex-1">
      <ConfirmDeleteNoteDialog />
      <Navbar title={channel.name} addon={<Button size="sm" variant="secondary">Share</Button>} />
      <div className="container flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col justify-end flex-1 max-w-[48rem] w-full mx-auto">
          <NotesList channelId={params.channelId} />
        </div>
        <div className="px-4 sticky bottom-0">
          <div className="bg-background rounded-t-lg">
            <EditorForm />
            <div className="text-right text-xs p-1 text-zinc-500">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelPage
