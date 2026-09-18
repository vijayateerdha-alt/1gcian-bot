import React from "react";
import { useParams } from "react-router-dom";
import WelcomeForm from "./Welcome";
// Goodbye reuses the exact same builder; import the internal form via re-export

// Simple wrapper — the WGForm is exported implicitly by rendering Welcome with a prop hack.
// To keep code straightforward, we duplicate the render but pass kind="goodbye".
import { WGFormExport } from "./_wg";

export default function Goodbye() {
  const { gid } = useParams();
  return <WGFormExport gid={gid} kind="goodbye" />;
}
