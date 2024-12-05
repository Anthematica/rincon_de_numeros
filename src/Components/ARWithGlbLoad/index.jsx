import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const SceneContent = ({ setArLink, gltfPath }) => {
  const modelRef = useRef();
  console.log("glb", gltfPath);

  useEffect(() => {
    const loader = new GLTFLoader();

    // Load the GLTF/GLB model
    loader.load(
      gltfPath,
      (gltf) => {
        modelRef.current.add(gltf.scene);

        // Convert to USDZ
        const exporter = new USDZExporter();
        exporter.parseAsync(gltf.scene).then((arraybuffer) => {
          const blob = new Blob([arraybuffer], {
            type: "application/octet-stream",
          });
          const usdzURL = URL.createObjectURL(blob);
          setArLink(usdzURL);
        });
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF/GLB model:", error);
      }
    );
  }, [gltfPath, setArLink]);

  return <group ref={modelRef} />;
};

const ARWithLgbLoad = ({ gltfPath }) => {
  const [arLink, setArLink] = useState(null);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [-2, 2, 4], fov: 45 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          scene.background = new THREE.Color(0xf0f0f0);
        }}>
        <SceneContent setArLink={setArLink} gltfPath={gltfPath} />
        <OrbitControls enableZoom enableRotate autoRotate />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
      {arLink && (
        <a
          rel="ar"
          href={arLink}
          download="model.usdz"
          style={{
            position: "absolute",
            bottom: "15px",
            left: "calc(50% - 40px)",
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
            textDecoration: "none",
          }}>
          View in AR
          <img src="https://via.placeholder.com/80" alt="Enter AR" />
        </a>
      )}
    </div>
  );
};

export default ARWithLgbLoad;

// Usage Example:
// <IOSARViewer gltfPath="/path-to-your-model/model.gltf" />
