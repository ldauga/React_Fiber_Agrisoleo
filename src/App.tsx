import React, { useEffect, useState } from "react";
// import './App.css'
import {
  extend,
  useThree,
  useFrame,
  Canvas,
  useLoader,
} from "@react-three/fiber";
import {
  Stats,
  OrbitControls,
  Sky,
  Loader,
  SoftShadows,
  Plane,
  Html,
  Text3D,
  Center,
} from "@react-three/drei";
import { DoubleSide, LightProbe, SpotLight, TextureLoader } from "three";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

extend({ TextGeometry });

const floor = {
  height: 300,
  width: 200,
};

const Floor = (props: { height: number; width: number }) => {
  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, 0, 0]}
      rotation-x={Math.PI * -0.5}
    >
      <planeBufferGeometry args={[props.height, props.width]} />
      {/* <boxGeometry attach="geometry" args={[props.height, 1, props.width]} /> */}
      <meshStandardMaterial attach="material" color="#0f0" />
    </mesh>
  );
};

const SolarPanel = (props: {
  panel_height: number;
  panel_x: number;
  panel_y: number;
  rotation: number;
  panel_size_height: number;
  panel_size_width: number;
  floor: { height: number; width: number };
  opacity: number;
}) => {
  const materialProps = {
    // thickness: 0,
    roughness: 0,
    // clearCoat: 0,
    // clearcoatRoughness: 1,
    transmission: props.opacity,
    // ior: 1.25,
    // envMapIntensity: 1,
    color: "#00006f",
  };

  return (
    <>
      <mesh
        position={[
          props.panel_y - props.floor.height / 2,
          props.panel_height / 2,
          props.panel_x - props.floor.width / 2,
        ]}
        castShadow
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[1, 1, props.panel_height, 50]}
        />
        <meshStandardMaterial attach="material" color="#333" />
      </mesh>
      <mesh
        castShadow
        position={[
          props.panel_y - props.floor.height / 2,
          props.panel_height + 1,
          props.panel_x - props.floor.width / 2,
        ]}
        rotation={[0, 0, ((Math.PI * 2) / 360) * props.rotation]}
      >
        <boxGeometry
          attach="geometry"
          args={[props.panel_size_height, 2, props.panel_size_width]}
        />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </>
  );
};

const AllSolarPanel = (props: {
  nb_panel_x: number;
  nb_panel_y: number;
  panel_span_x: number;
  panel_span_y: number;
  panel_height: number;
  panel_size_x: number;
  panel_size_y: number;
  panel_rotation: number;
  opacity: number;
}): any => {
  const info = {
    start_x: 30,
    start_y: 30,
    floor: floor,
  };

  var nb_panel_x = 0,
    nb_panel_y = 0;
  var panel_x = props.panel_size_x / 2,
    panel_y = props.panel_size_y / 2;
  var returnArray = [];

  while (nb_panel_x < props.nb_panel_x) {
    while (nb_panel_y < props.nb_panel_y) {
      returnArray.push(
        <SolarPanel
          panel_height={props.panel_height}
          panel_x={panel_x}
          panel_y={panel_y}
          rotation={props.panel_rotation}
          panel_size_height={props.panel_size_y}
          panel_size_width={props.panel_size_x}
          floor={{ height: info.floor.height, width: info.floor.width }}
          opacity={props.opacity}
        />
      );

      panel_y += props.panel_size_y + props.panel_span_y;
      nb_panel_y++;
    }
    nb_panel_y = 0;
    panel_y = props.panel_size_y / 2;
    panel_x += props.panel_size_x + props.panel_span_x;
    nb_panel_x++;
  }

  return returnArray;
};

const Sun = (props: { azimuth: number; inclination: number }) => {
  const phi = (90 - props.inclination) * (Math.PI / 180);
  const theta = props.azimuth * (Math.PI / 180);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [xL, setXL] = useState(0);
  const [yL, setYL] = useState(0);
  const [zL, setZL] = useState(0);

  useEffect(() => {
    setX(350 * Math.sin(phi) * Math.cos(theta));
    setY(350 * Math.cos(phi));
    setZ(350 * Math.sin(phi) * Math.sin(theta));
    setXL(350 * Math.sin(phi) * Math.cos(theta));
    setYL(350 * Math.cos(phi));
    setZL(350 * Math.sin(phi) * Math.sin(theta));
  }, [props]);

  return (
    <>
      <spotLight
        visible={true}
        position={[xL, yL, zL]}
        intensity={1}
        castShadow
        angle={360}
      />
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[10, 32]} />
        <meshStandardMaterial attach="material" color="yellow" transparent />
      </mesh>
    </>
  );
};

export default function App() {
  const info = {
    start_x: 30,
    start_y: 30,
    nb_panel_x: 10,
    nb_panel_y: 6,
    panel_span_x: 8,
    panel_span_y: 14,
    panel_height: 15,
    panel_size_x: 12,
    panel_size_y: 21,
    panel_rotation: 20,
    floor: floor,
  };
  const [hidden, set] = useState(false)
  const [nb_panel_x, setNb_panel_x] = useState(10);
  const [nb_panel_y, setNb_panel_y] = useState(6);
  const [panel_span_x, setPanel_span_x] = useState(8);
  const [panel_span_y, setPanel_span_y] = useState(14);
  const [panel_height, setPanel_height] = useState(15);
  const [panel_size_x, setPanel_size_x] = useState(12);
  const [panel_size_y, setPanel_size_y] = useState(21);
  const [panel_rotation, setPanel_rotation] = useState(20);
  const [azimuth, setAzimuth] = useState(90);
  const [inclination, setInclination] = useState(90);
  const [opacity, setOpacity] = useState(0);

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
        <Canvas frameloop="demand" camera={{ position: [0, 200, 0] }} shadows>
          {/* <Loader /> */}
          {/* <SoftShadows size={20} focus={2} samples={20}/> */}
          <SoftShadows size={1} focus={0} samples={20} />
          <OrbitControls maxPolarAngle={Math.PI / 2.01} />
          <ambientLight color="#fff" intensity={0.3} castShadow={false} />

          <Sun azimuth={azimuth} inclination={inclination} />

          <Floor height={floor.height} width={floor.width} />

          <Text3D
            font={"./fonts/font.json"}
            position={[floor.height / 2 + 50, 0, -floor.width / 2]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            size={15}
            bevelEnabled
            bevelThickness={5}
          >
            NORTH
            <meshStandardMaterial attach="material" color="red" />
          </Text3D>
          <Text3D
            font={"./fonts/font.json"}
            position={[-floor.height / 2 - 50, 0, floor.width / 2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            size={15}
            bevelEnabled
            bevelThickness={5}
          >
            SOUTH
            <meshStandardMaterial attach="material" color="blue" />
          </Text3D>
          <Text3D
            font={"./fonts/font.json"}
            position={[floor.height / 2, 0, floor.width / 2 + 50]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            size={15}
            bevelEnabled
            bevelThickness={5}
          >
            EAST
            <meshStandardMaterial attach="material" color="yellow" />
          </Text3D>
          <Text3D
            font={"./fonts/font.json"}
            position={[-floor.height / 2, 0, -floor.width / 2 - 50]}
            rotation={[-Math.PI / 2, 0, 0]}
            size={15}
            bevelEnabled
            bevelThickness={5}
          >
            WEST
            <meshStandardMaterial attach="material" color="green" />
          </Text3D>

          {/* <mesh position={[0, 10, 0]}>
            <renamedTextGeometry args={["test", {size: 5, height: 1 }]} />
            <meshLambertMaterial attach="material" color={"gold"} />
          </mesh> */}

          <AllSolarPanel
            nb_panel_x={nb_panel_x}
            nb_panel_y={nb_panel_y}
            panel_span_x={panel_span_x}
            panel_span_y={panel_span_y}
            panel_height={panel_height}
            panel_size_x={panel_size_x}
            panel_size_y={panel_size_y}
            panel_rotation={panel_rotation}
            opacity={opacity}
          />
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
        <div style={{ display: "flex", margin: "4%" }}>
          <div>nb_panel_x :</div>
          <input
            type="number"
            min={0}
            value={nb_panel_x}
            onChange={(e) => setNb_panel_x(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>nb_panel_y :</div>
          <input
            type="number"
            min={0}
            value={nb_panel_y}
            onChange={(e) => setNb_panel_y(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_span_x :</div>
          <input
            type="number"
            min={0}
            value={panel_span_x}
            onChange={(e) => setPanel_span_x(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_span_y :</div>
          <input
            type="number"
            min={0}
            value={panel_span_y}
            onChange={(e) => setPanel_span_y(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_height :</div>
          <input
            type="number"
            min={0}
            value={panel_height}
            onChange={(e) => setPanel_height(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_size_x :</div>
          <input
            type="number"
            min={0}
            value={panel_size_x}
            onChange={(e) => setPanel_size_x(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_size_y :</div>
          <input
            type="number"
            min={0}
            value={panel_size_y}
            onChange={(e) => setPanel_size_y(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_rotation :</div>
          <input
            type="number"
            min={0}
            value={panel_rotation}
            onChange={(e) => setPanel_rotation(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>opacity :</div>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_rotation :</div>
          <input
            type="number"
            min={-180}
            max={180}
            value={azimuth}
            onChange={(e) => setAzimuth(Number(e.currentTarget.value))}
          />
        </div>
        <div style={{ display: "flex", margin: "4%" }}>
          <div>panel_rotation :</div>
          <input
            type="number"
            min={0}
            max={360}
            value={inclination}
            onChange={(e) => setInclination(Number(e.currentTarget.value))}
          />
        </div>
      </div>
    </div>
  );
}
