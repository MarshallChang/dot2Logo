import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import AnimationChainContainer from './hooks/useAnimationChain'
import DotSphere from './components/DotSphere'
import CenterDots from './components/CenterDots'
import BigCenterDot from './components/BigCenterDot'
import Logo3D from './components/Logo3D'

function App() {
  return (
    <AnimationChainContainer.Provider>
      <Canvas camera={{ position: [0, 0, 40], fov: 50 }}>
        <fog attach='fog' args={['#202025', 10, 80]} />
        <DotSphere />
        <CenterDots radius={7} count={20} positionZ={-5} />
        <CenterDots radius={2} count={10} positionZ={5} />
        <BigCenterDot />
        <Logo3D />
        <ambientLight color={'#fff'} intensity={0.5} />
        {/* <OrbitControls /> */}
        {/* <axesHelper args={[10]}></axesHelper> */}
      </Canvas>
    </AnimationChainContainer.Provider>
  )
}

export default App
