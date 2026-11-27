import React from "react";
import { Composition, staticFile } from "remotion";
import { Episod } from "./Episod";

const FPS = 30;

export const Root: React.FC = () => (
  <Composition
    id="Episod"
    component={Episod}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={FPS * 60}
    defaultProps={{ ep: "EP007_kenapa-pocong-melompat" }}
    calculateMetadata={async ({ props }) => {
      const d = await fetch(staticFile(`${props.ep}/adegan.json`)).then((r) => r.json());
      const end = d.scene[d.scene.length - 1].tamat;
      return { durationInFrames: Math.ceil(end * FPS) };
    }}
  />
);
