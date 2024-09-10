import React, { useState } from "react";
import { Canvas, Euler } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const faceColors = [
  "#FF5733", // Mặt 1
  "#33FF57", // Mặt 2
  "#3357FF", // Mặt 3
  "#FF33A6", // Mặt 4
  "#33FFF5", // Mặt 5
  "#F5FF33", // Mặt 6
];

export const GameColorDice: React.FC = () => {
  const [rotation, setRotation] = useState<Euler | undefined>([0, 0, 0]);

  const handleDiceClick = () => {
    setRotation([
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ]);
  };

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Box
        onClick={handleDiceClick}
        rotation={rotation}
        args={[3, 3, 3]}
        position={[0, 0, 0]}
      >
        {faceColors.map((color, index) => (
          <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            color={color}
          />
        ))}
      </Box>
    </Canvas>
  );
};
