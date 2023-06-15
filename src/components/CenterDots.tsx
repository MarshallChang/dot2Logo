import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { animated, useSpring } from '@react-spring/three'
import AnimationChainContainer from '../hooks/useAnimationChain'

type CenterDotPropsType = {
  randomPosition: THREE.Vector3
  color: THREE.ColorRepresentation
  clockwise: boolean
  speed: number
}

function CenterDot({
  randomPosition,
  color,
  clockwise,
  speed,
}: CenterDotPropsType) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { blueBallAnimation, resetAll } = AnimationChainContainer.useContainer()

  const [{ position, opacity }, api] = useSpring(() => ({
    from: { position: randomPosition.toArray(), opacity: 1 },
  }))

  useEffect(() => {
    if (resetAll) {
      api.start(() => ({
        to: {
          position: randomPosition.toArray(),
          opacity: 1,
          config: {
            duration: 600,
          },
        },
      }))
    }
  }, [resetAll])

  useEffect(() => {
    if (!blueBallAnimation) {
      api.start(() => ({
        from: { position: meshRef.current?.position.toArray() },
        to: {
          position: new THREE.Vector3(0, 0, randomPosition.z).toArray(),
          opacity: 0,
          config: {
            duration: 600,
          },
        },
      }))
    }
  }, [api, blueBallAnimation, randomPosition.z])

  useFrame(({ clock }) => {
    if (blueBallAnimation) {
      const angle = speed * clock.elapsedTime
      const rotationAxis = new THREE.Vector3(0, 0, 1)
      if (meshRef.current) {
        const centerPosition = new THREE.Vector3(0, 0, 0)
        const currentPosition = randomPosition
          .clone()
          .applyAxisAngle(rotationAxis, clockwise ? angle : -angle)
        meshRef.current.position.copy(currentPosition.add(centerPosition))
      }
    }
  })

  return (
    <animated.group>
      <animated.mesh
        ref={meshRef}
        material={new THREE.MeshStandardMaterial({ color, toneMapped: false })}
        material-transparent={true}
        material-opacity={opacity}
        position={position.to((x, y, z) => [x, y, z])}
      >
        <sphereGeometry args={[0.2, 32, 16]} />
      </animated.mesh>
    </animated.group>
  )
}

const CenterDots = ({
  count = 5,
  radius = 3,
  positionZ = 0,
  speedOffset = 7,
}: {
  count?: number
  radius?: number
  positionZ?: number
  speedOffset?: number
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { centerBallColor } = AnimationChainContainer.useContainer()

  const dots = useMemo(() => {
    const temp: {
      randomPosition: THREE.Vector3
      clockwise: boolean
      speed: number
    }[] = []
    const thetaSpan = (Math.PI * 2) / count

    for (let i = 0; i < count; i++) {
      const theta = i * thetaSpan
      const x = radius * Math.cos(theta)
      const y = radius * Math.sin(theta)

      const offsetX = (Math.random() * 2 - 1) * 1
      const offsetY = (Math.random() * 2 - 1) * 1

      const clockwise = Math.random() > 0.5
      const speed = (Math.random() * 0.1 + Math.random() * 0.1) * speedOffset

      temp.push({
        randomPosition: new THREE.Vector3(x + offsetX, y + offsetY, positionZ),
        clockwise,
        speed,
      })
    }

    return temp
  }, [count, radius, positionZ])

  return (
    <animated.group ref={groupRef}>
      {dots.map(({ randomPosition, clockwise, speed }, index) => (
        <CenterDot
          key={index}
          randomPosition={randomPosition}
          color={centerBallColor}
          clockwise={clockwise}
          speed={speed}
        />
      ))}
    </animated.group>
  )
}

export default CenterDots
