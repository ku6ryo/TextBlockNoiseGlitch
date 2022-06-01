import { Renderer } from "./Renderer"
import "./style.scss"
import Stats from "stats.js"

;(async () => {
  const stats = new Stats()
  document.body.appendChild(stats.dom)
  const renderer = new Renderer()
  const canvas = renderer.getCanvas()
  document.body.appendChild(canvas)

  const width = 500
  const height = 500

  const text = "鬼"
  const sourceCanvas = document.createElement("canvas")
  sourceCanvas.width = width
  sourceCanvas.height = height
  const sourceCtx = sourceCanvas.getContext("2d", { alpha: false })!
  sourceCtx.fillStyle = "white"
  sourceCtx.font = "150px serif"
  const size = sourceCtx.measureText(text)
  sourceCtx.fillText(
    text,
    (width - size.actualBoundingBoxRight - size.actualBoundingBoxLeft) / 2,
    (height + size.actualBoundingBoxAscent - size.actualBoundingBoxDescent) / 2,
  )

  renderer.setSize(width, height)

  function loop() {
    stats.begin()
    renderer.render(sourceCanvas)
    stats.end()
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
})()