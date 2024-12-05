import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  DRACOLoader,
  GLTFExporter,
  GLTFLoader,
  USDZExporter,
} from "three/examples/jsm/Addons.js";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const SceneContent = ({ setArLink }) => {
  const meshRef = useRef();

  useEffect(() => {
    const exporter = new USDZExporter();
    if (meshRef.current) {
      exporter.parseAsync(meshRef.current).then((arraybuffer) => {
        const blob = new Blob([arraybuffer], {
          type: "application/octet-stream",
        });
        const usdzURL = URL.createObjectURL(blob);
        setArLink(usdzURL);
      });
    }
  }, [setArLink]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
};

const IOSAR = () => {
  const [arLink, setArLink] = useState(null);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {arLink && (
        <a
          rel="ar"
          href={arLink}
          download="asset.usdz"
          style={{ display: "flex" }}>
          Enter ar
          <img src="https://via.placeholder.com/80" alt="Enter AR" />
        </a>
      )}
      <Canvas
        camera={{ position: [-2.5, 0.6, 3.0], fov: 45 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          scene.background = new THREE.Color(0xf0f0f0);
        }}>
        <SceneContent setArLink={setArLink} />
        <OrbitControls enableZoom enableRotate autoRotate />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
    </div>
  );
};

export default IOSAR;
