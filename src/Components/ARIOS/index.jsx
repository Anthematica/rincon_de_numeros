import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter";

const IOSAR = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer;

    const init = async () => {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      containerRef.current.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.25,
        20
      );
      camera.position.set(-2.5, 0.6, 3.0);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      scene.add(box);

      const shadowMesh = createSpotShadowMesh();
      shadowMesh.position.y = -1.1;
      shadowMesh.position.z = -0.25;
      shadowMesh.scale.setScalar(2);
      scene.add(shadowMesh);

      render();

      // USDZ Exporter
      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parseAsync(box);
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.rel = "ar";
      link.href = URL.createObjectURL(blob);
      link.download = "asset.usdz";
      link.style.position = "absolute";
      link.style.bottom = "15px";
      link.style.left = "calc(50% - 40px)";
      link.innerHTML = `<img width="80" src="https://via.placeholder.com/80" alt="Enter AR">`;
      document.body.appendChild(link);
    };

    const createSpotShadowMesh = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;

      const context = canvas.getContext("2d");
      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0.1, "rgba(130,130,130,1)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const shadowTexture = new THREE.CanvasTexture(canvas);

      const geometry = new THREE.PlaneGeometry();
      const material = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;

      return mesh;
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    init();

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default IOSAR;
