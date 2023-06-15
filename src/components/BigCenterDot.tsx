import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { animated, useSpring, easings } from '@react-spring/three'
import AnimationChainContainer from '../hooks/useAnimationChain'

type BigCenterDotProps = {
  radius?: number
}

function BigCenterDot({ radius = 1 }: BigCenterDotProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const {
    ballColor,
    centerBallColor,
    blueBallAnimation,
    contractSphereAnimation,
    logoAnimation,
    resetLogo,
    resetAll,
    resetAllAnimation,
  } = AnimationChainContainer.useContainer()

  const [{ scale, dotColor }, api] = useSpring(() => ({
    from: { scale: 0, dotColor: centerBallColor },
  }))

  useEffect(() => {
    if (!blueBallAnimation) {
      api.start({
        scale: 1,
        config: {
          duration: 500,
        },
      })
    }
  }, [blueBallAnimation])

  useEffect(() => {
    if (contractSphereAnimation) {
      api.start({
        dotColor: ballColor,
        scale: 0.5,
        config: {
          duration: 500,
          easing: easings.easeInCubic,
        },
      })
    }
  }, [api, contractSphereAnimation])

  useEffect(() => {
    if (logoAnimation) {
      api.start({
        dotColor: ballColor,
        scale: 0,
        config: {
          duration: 1,
          easing: easings.easeInCubic,
        },
      })
    }
  }, [logoAnimation])

  useEffect(() => {
    if (resetLogo) {
      api.start({
        scale: 1,
        dotColor: centerBallColor,
        config: {
          duration: 500,
          easing: easings.linear,
        },
        onResolve: () => {
          resetAllAnimation()
        },
      })
    }
  }, [resetLogo])

  useEffect(() => {
    if (resetAll) {
      api.start({ scale: 0, dotColor: centerBallColor })
    }
  }, [resetAll])

  return (
    <animated.mesh
      ref={meshRef}
      scale={scale}
      position={new THREE.Vector3(0, 0, 5)}
    >
      {/* @ts-ignore */}
      <animated.meshStandardMaterial color={dotColor} toneMapped={false} />
      <sphereGeometry args={[radius, 64, 64]} />
    </animated.mesh>
  )
}

export default BigCenterDot
