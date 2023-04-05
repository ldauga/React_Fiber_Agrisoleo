import React, { useState } from "react";
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

const AllSolarPannel = (props: {
  nb_pannel_x: number;
  nb_pannel_y: number;
  pannel_span_x: number;
  pannel_span_y: number;
  pannel_height: number;
  pannel_size_x: number;
  pannel_size_y: number;
  pannel_rotation: number;
}): any => {
  const info = {
    start_x: 30,
    start_y: 30,
    floor: floor,
  };

  var nb_pannel_x = 0,
    nb_pannel_y = 0;
  var pannel_x = props.pannel_size_x / 2,
    pannel_y = props.pannel_size_y / 2;
  var returnArray = [];

  while (nb_pannel_x < props.nb_pannel_x) {
    while (nb_pannel_y < props.nb_pannel_y) {
      returnArray.push(
        <SolarPannel
          pannel_height={props.pannel_height}
          pannel_x={pannel_x}
          pannel_y={pannel_y}
          rotation={props.pannel_rotation}
          pannel_size_height={props.pannel_size_y}
          pannel_size_width={props.pannel_size_x}
          floor={{ height: info.floor.height, width: info.floor.width }}
        />
      );

      pannel_y += props.pannel_size_y + props.pannel_span_y;
      nb_pannel_y++;
    }
    nb_pannel_y = 0;
    pannel_y = props.pannel_size_y / 2;
    pannel_x += props.pannel_size_x + props.pannel_span_x;
    nb_pannel_x++;
  }

  return returnArray;
};

export default function App() {
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

  const [nb_pannel_x, setNb_pannel_x] = useState(10);
  const [nb_pannel_y, setNb_pannel_y] = useState(6);
  const [pannel_span_x, setPannel_span_x] = useState(8);
  const [pannel_span_y, setPannel_span_y] = useState(14);
  const [pannel_height, setPannel_height] = useState(15);
  const [pannel_size_x, setPannel_size_x] = useState(12);
  const [pannel_size_y, setPannel_size_y] = useState(21);
  const [pannel_rotation, setPannel_rotation] = useState(20);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Canvas camera={{ position: [0, 50, 0] }} shadows>
          <OrbitControls />
          <ambientLight color="#fff" intensity={0.3} />
          <pointLight visible={true} position={[-200, 200, -200]} castShadow />
          <mesh position={[-200, 200, -200]}>
            <sphereGeometry args={[10, 32]} />
            <meshStandardMaterial
              attach="material"
              color="yellow"
              transparent
            />
          </mesh>
          <Floor height={floor.height} width={floor.width} />

          <AllSolarPannel
            nb_pannel_x={nb_pannel_x}
            nb_pannel_y={nb_pannel_y}
            pannel_span_x={pannel_span_x}
            pannel_span_y={pannel_span_y}
            pannel_height={pannel_height}
            pannel_size_x={pannel_size_x}
            pannel_size_y={pannel_size_y}
            pannel_rotation={pannel_rotation}
          />

          {/* <SolarPannel pannel_height={10} pannel_x={40} pannel_y={50} rotation={15} pannel_size_height={10} pannel_size_width={20} floor={{height: floor.height, width: floor.width}}/> */}
        </Canvas>
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: "30%",
          height: "40%",
          backgroundColor: "#EEE",
        }}
      >
        <div style={{display: 'flex', margin: '4%'}}>
          <div>nb_pannel_x :</div>
          <input type="number" min={0} value={nb_pannel_x} onChange={(e) => setNb_pannel_x(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>nb_pannel_y :</div>
          <input type="number" min={0} value={nb_pannel_y} onChange={(e) => setNb_pannel_y(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_span_x :</div>
          <input type="number" min={0} value={pannel_span_x} onChange={(e) => setPannel_span_x(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_span_y :</div>
          <input type="number" min={0} value={pannel_span_y} onChange={(e) => setPannel_span_y(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_height :</div>
          <input type="number" min={0} value={pannel_height} onChange={(e) => setPannel_height(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_size_x :</div>
          <input type="number" min={0} value={pannel_size_x} onChange={(e) => setPannel_size_x(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_size_y :</div>
          <input type="number" min={0} value={pannel_size_y} onChange={(e) => setPannel_size_y(Number(e.currentTarget.value))}/>
        </div>
        <div style={{display: 'flex', margin: '4%'}}>
          <div>pannel_rotation :</div>
          <input type="number" min={0} value={pannel_rotation} onChange={(e) => setPannel_rotation(Number(e.currentTarget.value))}/>
        </div>
      </div>
    </div>
  );
}
