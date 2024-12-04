import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";

const IOSAR = () => {
  const [text, setText] = useState("It works!");
  const [usdzUrl, setUsdUrl] = useState(null);
  const objectsRef = useRef(new THREE.Group());
  const hdrCubeMapRef = useRef(null);
  const pmremGeneratorRef = useRef(null);
  const worldEnvMapRef = useRef(null);

  const addSticks = () => {
    const group = objectsRef.current;
    for (let i = 0; i < 100; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
      });
      const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.1);
      const stick = new THREE.Mesh(geometry, material);
      stick.position.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );
      stick.lookAt(new THREE.Vector3());
      stick.position.normalize().multiplyScalar(0.4);
      group.add(stick);
    }
  };

  const drawText = async (scene, fontUrl, text) => {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync(fontUrl);
    const textGeo = new TextGeometry(text, {
      font,
      size: 0.1,
      height: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 1,
    });

    const material = new THREE.MeshStandardMaterial({
      color: 0xc0e0ff,
      metalness: 1,
      envMap: worldEnvMapRef.current,
      roughness: 0.1,
    });

    // Remove previous text if exists
    objectsRef.current.children = objectsRef.current.children.filter(
      (child) => !(child.geometry instanceof TextGeometry)
    );

    const textMesh = new THREE.Mesh(textGeo, material);
    objectsRef.current.add(textMesh);
    textMesh.position.x -= (0.1 * text.length) / 3;
  };

  const initHDR = (scene, renderer) => {
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGeneratorRef.current = pmremGenerator;

    const hdrUrls = [
      "px.hdr",
      "nx.hdr",
      "py.hdr",
      "ny.hdr",
      "pz.hdr",
      "nz.hdr",
    ];
    const hdrCubeMap = new HDRCubeTextureLoader()
      .setPath("https://threejs.org/examples/textures/cube/pisaHDR/")
      .setDataType(THREE.HalfFloatType)
      .load(hdrUrls, () => {
        const hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
        hdrCubeMap.magFilter = THREE.LinearFilter;
        hdrCubeMap.needsUpdate = true;

        scene.background = hdrCubeMap;
        worldEnvMapRef.current = hdrCubeRenderTarget.texture;

        scene.traverse((el) => {
          if (!el.material) return;
          el.material.envMap = hdrCubeRenderTarget.texture;
          el.material.needsUpdate = true;
        });
      });

    hdrCubeMapRef.current = hdrCubeMap;
  };

  const SceneComponent = () => {
    const { scene, camera, gl } = useThree();

    useEffect(() => {
      const renderer = gl;
      initHDR(scene, renderer);
      addSticks();
      drawText(
        scene,
        "https://threejs.org/examples/fonts/optimer_bold.typeface.json",
        text
      );
    }, [scene, gl]);

    useEffect(() => {
      drawText(
        scene,
        "https://threejs.org/examples/fonts/optimer_bold.typeface.json",
        text
      );
    }, [text, scene]);

    useFrame(() => {
      camera.lookAt(new THREE.Vector3());
      camera.position.set(
        0.5 * Math.sin(Date.now() / 3000),
        0.3,
        0.5 * Math.cos(Date.now() / 2000)
      );
    });

    return <primitive object={objectsRef.current} />;
  };

  const handleSaveUSDZ = async () => {
    const exporter = new USDZExporter();
    const data = await exporter.parse(objectsRef.current);
    const blob = new Blob([data], { type: "model/vnd.usdz+zip" });
    const url = URL.createObjectURL(blob);
    setUsdUrl(url);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Type to update text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          position: "fixed",
          top: "10px",
          right: "30px",
          width: "50%",
          padding: "10px",
          borderRadius: "20px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
      <a
        href={usdzUrl}
        rel="ar"
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          border: "1px solid black",
          backgroundColor: "white",
          padding: "9px",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        download="model.usdz"
        onClick={handleSaveUSDZ}>
        <img
          src="https://via.placeholder.com/150" // Replace with a relevant preview image
          alt="View in AR"
          style={{ width: "100%", height: "auto" }}
        />
        View in AR
      </a>
      <Canvas
        style={{
          position: "fixed",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        camera={{ position: [0, 0, 1] }}>
        <SceneComponent />
      </Canvas>
    </>
  );
};

export default IOSAR;
