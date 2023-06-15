import { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { animated, useSpring, easings } from '@react-spring/three'
import AnimationChainContainer from '../hooks/useAnimationChain'

type DotPropsType = {
  randomPosition: THREE.Vector3
  spherePosition: THREE.Vector3
  color: THREE.ColorRepresentation
  scale: number
  start: boolean
  onChangePositionFinished?: () => void
}

function Dot({
  randomPosition,
  spherePosition,
  color,
  scale,
  start = false,
  onChangePositionFinished,
}: DotPropsType) {
  const meshRef = useRef<THREE.Mesh>(null)

  const {
    littleBallFloatAnimation,
    contractSphereAnimation,
    resetAll,
    startLogoAnimation,
  } = AnimationChainContainer.useContainer()

  const rotationIncrementRef = useRef(
    Math.random() * 0.01 + Math.random() * 0.01
  )

  const [{ position, groupScale, opacity }, api] = useSpring(() => ({
    from: {
      position: randomPosition.toArray(),
      groupScale: scale,
      opacity: 1,
    },
  }))

  useEffect(() => {
    if (start) {
      api.start(() => ({
        from: { position: meshRef.current?.position.toArray() },
        to: {
          position: spherePosition.toArray(),
          groupScale: 1,
          opacity: 1,
          config: {
            duration: 500,
            easing: easings.easeInElastic,
          },
        },
        onResolve: () => {
          onChangePositionFinished && onChangePositionFinished()
        },
      }))
    }
  }, [start])

  useEffect(() => {
    if (resetAll) {
      api.start({
        position: randomPosition.toArray(),
        groupScale: scale,
        opacity: 1,
        delay: 200,
        config: {
          duration: 500,
          easing: easings.easeInSine,
        },
      })
    }
  }, [resetAll])

  useEffect(() => {
    if (contractSphereAnimation) {
      api.start({
        position: [0, 0, 0],
        groupScale: 1,
        opacity: 0,
        config: {
          duration: 600,
          easing: easings.easeInCubic,
        },
        onResolve: () => {
          onChangePositionFinished && startLogoAnimation()
        },
      })
    }
  }, [api, contractSphereAnimation, onChangePositionFinished])

  const flag = Math.random() > 0.5
  useFrame(() => {
    if (littleBallFloatAnimation) {
      const rotationIncrement = flag
        ? rotationIncrementRef.current
        : -rotationIncrementRef.current

      const rotationAxis = new THREE.Vector3(0, 1, 0)
      if (meshRef.current) {
        meshRef.current.position.applyAxisAngle(rotationAxis, rotationIncrement)
      }
    }
  })

  return (
    <animated.group>
      <animated.mesh
        ref={meshRef}
        scale={groupScale}
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

const DotSphere = ({
  count = 18,
  radius = 13,
}: {
  count?: number
  radius?: number
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const {
    ballColor,
    rotateSphereAnimation,
    startRotateSphere,
    startCombineSphere,
    startContractSphere,
    resetAll,
    setResetAll,
  } = AnimationChainContainer.useContainer()
  const startRef = useRef(false)
  const [laps, setLaps] = useState(1)

  useEffect(() => {
    const timeout = setTimeout(() => {
      startCombineSphere()
      startRef.current = true
    }, 3000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined
    if (resetAll) {
      timeout = setTimeout(() => {
        startCombineSphere()
        startRef.current = true
        setResetAll(false)
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [resetAll])

  const dots = useMemo(() => {
    const temp: {
      randomPosition: THREE.Vector3
      spherePosition: THREE.Vector3
      scale: number
    }[] = []
    const spherical = new THREE.Spherical()
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count

    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) {
        const scale = Math.random() + 0.5 // 生成随机缩放因子

        temp.push({
          randomPosition: new THREE.Vector3()
            .random()
            .subScalar(0.5)
            .multiplyScalar(radius * 3),
          spherePosition: new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j)
          ),
          scale,
        })
      }

    return temp
  }, [count, radius])

  const onChangePositionFinished = () => {
    startRotateSphere()
  }

  const [groupRotation, api] = useSpring(() => ({
    rotationY: 0,
  }))

  useEffect(() => {
    if (rotateSphereAnimation) {
      api.start({
        rotationY: -Math.PI * laps,
        config: {
          easing: easings.easeOutCubic,
          duration: 3000,
        },
        onResolve: () => {
          startRef.current = false
          setLaps(laps + 1)
          startContractSphere()
        },
      })
    }
  }, [rotateSphereAnimation])

  return (
    <animated.group ref={groupRef} rotation-y={groupRotation.rotationY}>
      {dots.map(({ randomPosition, spherePosition, scale }, index) => (
        <Dot
          key={index}
          randomPosition={randomPosition}
          spherePosition={spherePosition}
          color={ballColor}
          scale={scale}
          start={startRef.current}
          onChangePositionFinished={
            index === dots.length - 1
              ? () => onChangePositionFinished()
              : undefined
          }
        />
      ))}
    </animated.group>
  )
}

export default DotSphere
