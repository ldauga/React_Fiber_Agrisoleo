import React from "react";
// import './App.css'
import { extend, useThree, useFrame, Canvas } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const floor = {
  height: 200,
  width: 200,
};

const Floor = (props: { height: number; width: number }) => (
  <mesh castShadow receiveShadow position={[0, 0, 0]}>
    <boxGeometry attach="geometry" args={[props.height, 1, props.width]} />
    <meshStandardMaterial attach="material" color="#0f0" />
  </mesh>
);

const SolarPannel = (props: {
  pannel_height: number;
  pannel_x: number;
  pannel_y: number;
  rotation: number;
  pannel_size_height: number;
  pannel_size_width: number;
  floor: { height: number; width: number };
}) => (
  <>
    <mesh
      position={[
        props.pannel_y - props.floor.height / 2,
        props.pannel_height / 2,
        props.pannel_x - props.floor.width / 2,
      ]}
      castShadow
    >
      <cylinderBufferGeometry
        attach="geometry"
        args={[1, 1, props.pannel_height, 50]}
      />
      <meshStandardMaterial attach="material" color="#333" />
    </mesh>
    <mesh
      castShadow
      receiveShadow
      position={[
        props.pannel_y - props.floor.height / 2,
        props.pannel_height + 1,
        props.pannel_x - props.floor.width / 2,
      ]}
      rotation={[0, 0, ((Math.PI * 2) / 360) * props.rotation]}
    >
      <boxGeometry
        attach="geometry"
        args={[props.pannel_size_height, 2, props.pannel_size_width]}
      />
      <meshPhongMaterial color="#ff0000" transparent flatShading />
    </mesh>
  </>
);

const AllSolarPannel = (): any => {
  const info = {
    start_x: 30,
    start_y: 30,
    nb_pannel_x: 10,
    nb_pannel_y: 6,
    pannel_span_x: 8,
    pannel_span_y: 14,
    pannel_height: 15,
    pannel_size_x: 12,
    pannel_size_y: 21,
    pannel_rotation: 20,
    floor: floor,
  };

  var nb_pannel_x = 0,
    nb_pannel_y = 0;
  var pannel_x = info.pannel_size_x / 2,
    pannel_y = info.pannel_size_y / 2;
  var returnArray = [];

  while (nb_pannel_x < info.nb_pannel_x) {
    while (nb_pannel_y < info.nb_pannel_y) {
      returnArray.push(
        <SolarPannel
          pannel_height={info.pannel_height}
          pannel_x={pannel_x}
          pannel_y={pannel_y}
          rotation={info.pannel_rotation}
          pannel_size_height={info.pannel_size_y}
          pannel_size_width={info.pannel_size_x}
          floor={{ height: info.floor.height, width: info.floor.width }}
        />
      );

      pannel_y += info.pannel_size_y + info.pannel_span_y;
      nb_pannel_y++;
    }
    nb_pannel_y = 0;
    pannel_y = info.pannel_size_y / 2;
    pannel_x += info.pannel_size_x + info.pannel_span_x;
    nb_pannel_x++;
  }

  // for (let  = info.pannel_size_x / 2; x - info.floor.width / 2 < info.floor.width; x+= info.) {

  // }

  return returnArray;
};

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 50, 0] }} shadows>
        <OrbitControls />
        <ambientLight color="#fff" intensity={0.2} />
        <pointLight visible={true} position={[-200, 200, -200]} castShadow />
        <mesh position={[-200, 200, -200]}>
          <sphereGeometry args={[5, 32]} />
          <meshStandardMaterial attach="material" color="yellow" transparent />
        </mesh>
        <Floor height={floor.height} width={floor.width} />

        <AllSolarPannel />

        {/* <SolarPannel pannel_height={10} pannel_x={40} pannel_y={50} rotation={15} pannel_size_height={10} pannel_size_width={20} floor={{height: floor.height, width: floor.width}}/> */}
      </Canvas>
    </div>
  );
}
