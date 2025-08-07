import React from "react";

import Roomcanvas from "../../component/Roomcanvas";

async function page({
  params,
}: {
  socket: WebSocket;
  params: {
    roomId: string;
  };
}) {
  const roomId = (await params).roomId;

  return (
    <div className="h-screen w-full">
      <Roomcanvas roomId={roomId} />
    </div>
  );
}

export default page;
