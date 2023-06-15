import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { animated, useSpring, easings } from '@react-spring/three'
import AnimationChainContainer from '../hooks/useAnimationChain'

type LogoDotType = {
  id: number
  radius: number
  radiusMultiple: number
  isBlue?: boolean
  originalPosition: THREE.Vector3
  position: THREE.Vector3
}

const positionMultiple = 3.5
const baseRaidus = 0.25
const boxGeometryArgs = [0.1, 0.01, 0.1]
const initialState1 = { y1: 1, opacity1: 0 }
const initialState2 = { y2: 1, opacity2: 0 }
const endState1 = { y1: 700, opacity1: 1 }
const endState2 = { y2: 600, opacity2: 1 }
const animation1Delay = 500
const animation2Delay = 1000
const animationConfig = { duration: 400 }

const logoDotArr: LogoDotType[] = [
  {
    id: 1,
    radius: baseRaidus,
    radiusMultiple: 5,
    isBlue: true,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(0, 2.32 * positionMultiple, 4),
  },
  {
    id: 2,
    radius: baseRaidus,
    radiusMultiple: 4,
    isBlue: true,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(-1.78 * positionMultiple, 0, 4),
  },
  {
    id: 3,
    radius: baseRaidus,
    radiusMultiple: 4,
    isBlue: false,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(1.78 * positionMultiple, 0, 4),
  },
  {
    id: 4,
    radius: baseRaidus,
    radiusMultiple: 3,
    isBlue: false,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(
      -2.86 * positionMultiple,
      -2.31 * positionMultiple,
      4
    ),
  },
  {
    id: 5,
    radius: baseRaidus,
    radiusMultiple: 3,
    isBlue: true,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(
      -0.69 * positionMultiple,
      -2.31 * positionMultiple,
      4
    ),
  },
  {
    id: 6,
    radius: baseRaidus,
    radiusMultiple: 3,
    isBlue: false,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(
      0.69 * positionMultiple,
      -2.31 * positionMultiple,
      4
    ),
  },
  {
    id: 7,
    radius: baseRaidus,
    radiusMultiple: 3,
    isBlue: false,
    originalPosition: new THREE.Vector3(0, 0, 4),
    position: new THREE.Vector3(
      2.86 * positionMultiple,
      -2.31 * positionMultiple,
      4
    ),
  },
]

const LogoDot = ({
  radius = 0.1,
  radiusMultiple,
  color,
  originalPosition,
  position,
}: LogoDotType & { color: THREE.ColorRepresentation }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { logoAnimation, resetLogo } = AnimationChainContainer.useContainer()
  const initialLogoState = {
    dotPosition: originalPosition.toArray(),
    scale: 0.1,
    opacity: 0,
  }
  const [{ dotPosition, scale, opacity }, api] = useSpring(() => ({
    from: initialLogoState,
  }))

  useEffect(() => {
    if (logoAnimation) {
      api.start({
        dotPosition: position.toArray(),
        scale: 1,
        opacity: 1,
        config: {
          duration: 1000,
          easing: easings.easeOutBack,
        },
      })
    }
  }, [api, logoAnimation, position])

  useEffect(() => {
    if (resetLogo) {
      api.start({
        ...initialLogoState,
        config: {
          duration: 1000,
          easing: easings.easeOutBack,
        },
      })
    }
  }, [resetLogo])

  return (
    <animated.mesh
      ref={meshRef}
      position={dotPosition.to((x, y, z) => [x, y, z])}
      scale={scale}
      castShadow
      receiveShadow
    >
      {/* @ts-ignore */}
      <animated.meshStandardMaterial
        toneMapped={false}
        // @ts-ignore
        color={color}
        transparent={true}
        opacity={opacity}
      />
      <sphereGeometry args={[radius * radiusMultiple, 64, 64]} />
    </animated.mesh>
  )
}

function Logo3D() {
  const {
    ballColor,
    centerBallColor,
    lineColor,
    logoAnimation,
    resetLine,
    resetLineAnimation,
    resetLogoAnimation,
  } = AnimationChainContainer.useContainer()

  useEffect(() => {
    if (logoAnimation) {
      api1.start({
        to: endState1,
        delay: animation1Delay,
        config: animationConfig,
      })
      api2.start({
        to: endState2,
        delay: animation2Delay,
        config: animationConfig,
        onResolve: () => {
          resetLineAnimation()
        },
      })
    }
  }, [logoAnimation])

  useEffect(() => {
    if (resetLine) {
      api2.start({
        to: initialState2,
        delay: animation2Delay,
        config: animationConfig,
      })
      api1.start({
        to: initialState1,
        delay: animation2Delay + animation1Delay,
        config: animationConfig,
        onResolve: () => {
          resetLogoAnimation()
        },
      })
    }
  }, [resetLine])

  const [{ y1, opacity1 }, api1] = useSpring(() => ({
    from: initialState1,
  }))
  const [{ y2, opacity2 }, api2] = useSpring(() => ({
    from: initialState2,
  }))

  return (
    <animated.group>
      <pointLight
        color={'#fff'}
        intensity={2}
        position={new THREE.Vector3(-5, 10, 30)}
      ></pointLight>
      {logoDotArr.map(
        (
          { id, radius, radiusMultiple, isBlue, originalPosition, position },
          index
        ) => (
          <LogoDot
            key={index}
            id={id}
            radius={radius}
            radiusMultiple={radiusMultiple}
            color={isBlue ? centerBallColor : ballColor}
            originalPosition={originalPosition}
            position={position}
          />
        )
      )}
      <group>
        <animated.mesh
          scale-y={y1}
          position={calcPointsCenter(logoDotArr[0], logoDotArr[1])}
          rotation-z={calcAngles(logoDotArr[0], logoDotArr[1])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity1}
          />
        </animated.mesh>
        <animated.mesh
          scale-y={y1}
          position={calcPointsCenter(logoDotArr[0], logoDotArr[2])}
          rotation-z={calcAngles(logoDotArr[0], logoDotArr[2])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity1}
          />
        </animated.mesh>
        <animated.mesh
          scale-y={y2}
          position={calcPointsCenter(logoDotArr[1], logoDotArr[3])}
          rotation-z={calcAngles(logoDotArr[1], logoDotArr[3])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity2}
          />
        </animated.mesh>
        <animated.mesh
          scale-y={y2}
          position={calcPointsCenter(logoDotArr[1], logoDotArr[4])}
          rotation-z={calcAngles(logoDotArr[1], logoDotArr[4])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity2}
          />
        </animated.mesh>
        <animated.mesh
          scale-y={y2}
          position={calcPointsCenter(logoDotArr[2], logoDotArr[5])}
          rotation-z={calcAngles(logoDotArr[2], logoDotArr[5])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity2}
          />
        </animated.mesh>
        <animated.mesh
          scale-y={y2}
          position={calcPointsCenter(logoDotArr[2], logoDotArr[6])}
          rotation-z={calcAngles(logoDotArr[2], logoDotArr[6])}
        >
          <boxBufferGeometry attach='geometry' args={boxGeometryArgs} />
          <animated.meshStandardMaterial
            color={lineColor}
            toneMapped={false}
            transparent={true}
            opacity={opacity2}
          />
        </animated.mesh>
      </group>
    </animated.group>
  )
}

const calcPointsCenter = (point1: LogoDotType, point2: LogoDotType) => {
  const x1 = point1.position.x
  const y1 = point1.position.y
  const z1 = point1.position.z
  const x2 = point2.position.x
  const y2 = point2.position.y

  return new THREE.Vector3((x1 + x2) / 2, (y1 + y2) / 2, z1)
}

const calcAngles = (point1: LogoDotType, point2: LogoDotType) => {
  const x1 = point1.position.x
  const y1 = point1.position.y
  const x2 = point2.position.x
  const y2 = point2.position.y

  const dx = x2 - x1
  const dy = y2 - y1

  const angle = Math.atan2(dx, dy)

  return -angle
}

export default Logo3D
