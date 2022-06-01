import vertexShaderSource from "./effect.vert"
import fragmentShaderSource from "./effect.frag"
import { createShader, createProgram } from "../utils/shader"

export class Renderer {
  
  #canvas: HTMLCanvasElement
  #program: WebGLProgram

  #blockNoiseCanvas: HTMLCanvasElement
  #renderingCount = 0

  constructor() {
    this.#canvas = document.createElement("canvas")
    this.#blockNoiseCanvas = document.createElement("canvas")
    const gl = this.getWebGLContext()
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    this.#program = createProgram(gl, vertShader, fragShader)

    gl.useProgram(this.#program)
    this.bindPosition()
    this.bindTexCoord()
  }

  private getWebGLContext() {
    const ctx = this.#canvas.getContext("webgl")
    if (!ctx) {
      throw new Error("no context")
    }
    return ctx
  }

  getCanvas() {
    return this.#canvas
  }

  setSize(width: number, height: number) {
    this.#canvas.width = width
    this.#canvas.height = height
    this.#blockNoiseCanvas.width = width
    this.#blockNoiseCanvas.height = height
  }

  private generateNoise() {
    if (this.#renderingCount % 10 !== 0) {
      return
    }
    const ctx = this.#blockNoiseCanvas.getContext("2d")!
    ctx.clearRect(0, 0, this.#blockNoiseCanvas.width, this.#blockNoiseCanvas.height)
    for (let i = 0; i < 20; i++) {
      const c = Math.floor(Math.random() * 256).toString()
      ctx.fillStyle = `rgb(${c}, ${c}, ${c})`
      ctx.beginPath()
      ctx.rect(
        Math.random() * this.#blockNoiseCanvas.width,
        Math.random() * this.#blockNoiseCanvas.height,
        Math.random() * this.#blockNoiseCanvas.width * 0.2,
        Math.random() * this.#blockNoiseCanvas.height * 0.1,
      )
      ctx.strokeStyle = ""
      ctx.lineWidth = 0
      ctx.fill()
      ctx.closePath()
    }
  }


  render(image: HTMLImageElement | HTMLCanvasElement) {
    this.#renderingCount += 1
    this.generateNoise()
    const gl = this.getWebGLContext()

    const imageTexture = this.createTexture(image)
    const noiseTexture = this.createTexture(this.#blockNoiseCanvas)
    const uImageLocation = gl.getUniformLocation(this.#program, "uImage")
    gl.uniform1i(uImageLocation, 1)
    const uNoiseLocation = gl.getUniformLocation(this.#program, "uNoise")
    gl.uniform1i(uNoiseLocation, 2)

    const uTime = gl.getUniformLocation(this.#program, "uTime")
    gl.uniform1f(uTime, performance.now() / 1000)

    const uRnadom = gl.getUniformLocation(this.#program, "uRandom")
    gl.uniform1f(uRnadom, Math.random())

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.deleteTexture(imageTexture)
    gl.deleteTexture(noiseTexture)
  }

  private bindPosition() {
    const gl = this.getWebGLContext()
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       -1, -1,
       1, -1,
       -1, 1,
       -1, 1,
       1, -1,
       1, 1,
    ]), gl.STATIC_DRAW)
    const positionLocation = gl.getAttribLocation(this.#program, "aPosition")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  private bindTexCoord() {
    const gl = this.getWebGLContext()
    const texcoordLocation = gl.getAttribLocation(this.#program, "aTexCoord")
    const texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(texcoordLocation)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  createTexture(image: HTMLCanvasElement | ImageBitmap | HTMLImageElement | HTMLVideoElement) {
    const gl = this.getWebGLContext()
    var texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    return texture
  }
}