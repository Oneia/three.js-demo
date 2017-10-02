import * as GLMatrix from 'gl-matrix';

class AppWebGl {

  constructor() {
    const canvas = document.getElementById("canvas3D");
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.shaderProgram = null;
    this.vertexBuffer = null; // буфер вершин
    this.indexBuffer = null; //буфер индексов
    this.colorBuffer = null; //буфер цветов

    this.mvMatrix = GLMatrix.mat4.create();
    this.pMatrix = GLMatrix.mat4.create();


    this.gl.viewportWidth = canvas.width;
    this.gl.viewportHeight = canvas.height;

    this.initShaders();
    this.initBuffers();
    this.setupWebGL();
    this.setMatrixUniforms();
    this.draw();
  }

  // установка шейдеров
  initShaders() {
    const fragmentShader = this.getShader(this.gl.FRAGMENT_SHADER, 'shader-fs');
    const vertexShader = this.getShader(this.gl.VERTEX_SHADER, 'shader-vs');

    this.shaderProgram = this.gl.createProgram();

    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);

    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      alert("Не удалось установить шейдеры");
    }

    this.gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.MVMatrix = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.ProjMatrix = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
  }
  setMatrixUniforms(){
    this.gl.uniformMatrix4fv(this.shaderProgram.ProjMatrix,false, this.pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.MVMatrix, false, this.mvMatrix);
  }

  // Функция создания шейдера
  getShader(type,id) {
    const source = document.getElementById(id).innerHTML;

    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);

    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert("Ошибка компиляции шейдера: " + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // установка буферов вершин и индексов
  initBuffers() {

    const vertices =[
      // лицевая часть
      -0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, -0.5, 0.5,
      // задняя часть
      -0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      0.5, -0.5, -0.5
    ];

    const indices = [ // лицевая часть
      0, 1, 2,
      2, 3, 0,
      //нижняя часть
      0, 4, 7,
      7, 3, 0,
      // левая боковая часть
      0, 1, 5,
      5, 4, 0,
      // правая боковая часть
      2, 3, 7,
      7, 6, 2,
      // верхняя часть
      2, 1, 6,
      6, 5, 1,
      // задняя часть
      4, 5, 6,
      6, 7, 4,
    ];

    // установка буфера вершин
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;

    // создание буфера индексов
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    // указываем число индексов это число равно числу индексов
    this.indexBuffer.numberOfItems = indices.length;

    // установка цветов для каждой вершины
    const сolors = [
      0.0, 0.0, 0.3,
      0.0, 0.0, 1.0,
      0.0, 1.0, 0.0,
      0.0, 0.3, 0.0,

      0.0, 0.0, 0.3,
      0.0, 0.0, 1.0,
      0.0, 1.0, 0.0,
      0.0, 0.3, 0.0
    ];
    this.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(сolors), this.gl.STATIC_DRAW);
  }

  draw() {

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
      this.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
      this.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.numberOfItems, this.gl.UNSIGNED_SHORT,0);
  }

  setupWebGL() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT || this.gl.DEPTH_BUFFER_BIT);

    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    GLMatrix.mat4.perspective(this.pMatrix, 1.04, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
    GLMatrix.mat4.identity(this.mvMatrix);
    GLMatrix.mat4.translate(this.mvMatrix, this.mvMatrix,[0, 0, -2.0]);
    GLMatrix.mat4.rotate(this.mvMatrix, this.mvMatrix, 2.0, [0, 1, 0]);
  }

}

window.onload = () => new AppWebGl();
