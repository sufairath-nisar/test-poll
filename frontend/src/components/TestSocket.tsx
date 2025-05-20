import React, { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const TestSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return <div>Socket test works!</div>;
};
