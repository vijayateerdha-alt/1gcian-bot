import React from "react";
import { useParams } from "react-router-dom";
import { WGFormExport } from "./_wg";

export default function Welcome() {
  const { gid } = useParams();
  return <WGFormExport gid={gid} kind="welcome" />;
}
