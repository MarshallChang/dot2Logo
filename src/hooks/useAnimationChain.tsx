import { useState } from 'react'
import { createContainer } from 'unstated-next'

function useAnimationChain() {
  const [ballColor, setBallColor] = useState<THREE.ColorRepresentation>('#fff')
  const [centerBallColor, setCenterBallColor] =
    useState<THREE.ColorRepresentation>('#0067FF')
  const [lineColor, setLineColor] = useState<THREE.ColorRepresentation>('#fff')

  const [blueBallAnimation, setBlueBallAnimation] = useState(true) // 蓝色小球消失 蓝色大球出现 动画
  const [littleBallFloatAnimation, setLittleBallFloatAnimation] = useState(true) // 小球浮动动画
  const [combineSphereAnimation, setCombineSphereAnimation] = useState(false) // 组合成球体动画
  const [rotateSphereAnimation, setRotateSphereAnimation] = useState(false) // 旋转球体动画
  const [contractSphereAnimation, setContractSphereAnimation] = useState(false) // 收缩球体动画
  const [logoAnimation, setLogoAnimation] = useState(false) // logo出现动画

  const [resetLine, setResetLine] = useState(false)
  const [resetLogo, setResetLogo] = useState(false)

  const [resetAll, setResetAll] = useState(false)

  const startCombineSphere = () => {
    setBlueBallAnimation(false)
    setLittleBallFloatAnimation(false)
    setCombineSphereAnimation(true)
  }

  const startRotateSphere = () => {
    setCombineSphereAnimation(false)
    setRotateSphereAnimation(true)
  }

  const startContractSphere = () => {
    setRotateSphereAnimation(false)
    setContractSphereAnimation(true)
  }

  const startLogoAnimation = () => {
    setContractSphereAnimation(false)
    setLogoAnimation(true)
  }

  const resetLineAnimation = () => {
    setResetLine(true)
    setLogoAnimation(false)
  }

  const resetLogoAnimation = () => {
    setResetLine(false)
    setResetLogo(true)
  }

  const resetAllAnimation = () => {
    setResetLogo(false)
    setResetAll(true)
    setBlueBallAnimation(true)
    setLittleBallFloatAnimation(true)
  }

  return {
    ballColor,
    centerBallColor,
    lineColor,
    blueBallAnimation,
    littleBallFloatAnimation,
    combineSphereAnimation,
    rotateSphereAnimation,
    contractSphereAnimation,
    logoAnimation,
    resetLine,
    resetLogo,
    resetAll,
    startCombineSphere,
    startRotateSphere,
    startContractSphere,
    startLogoAnimation,
    resetLineAnimation,
    resetLogoAnimation,
    resetAllAnimation,
    setResetAll,
  }
}
const AnimationChainContainer = createContainer(useAnimationChain)
export default AnimationChainContainer
