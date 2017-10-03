class AppWebGlTrianthis {

  constructor() {
    const canvas = document.getElementById("canvas3D");
    this.gl = canvas.getContext("webgl");
    this.gl.viewportWidth = canvas.width;
    this.gl.viewportHeight = canvas.height;
    // установка шейдеров
    this.initShaders();
    // установка буфера вершин
    this.initBuffers();
    // покрасим в красный цвет фон
    this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
    // отрисовка сцены
    this.draw();
  }

  // Установка конструктора
  initShaders() {
    const fragmentShader = this.getShader(this.gl.FRAGMENT_SHADER, 'shader-fs');
    const vertexShader = this.getShader(this.gl.VERTEX_SHADER, 'shader-vs');

    //создаем объект программы шейдеров
    this.shaderProgram = this.gl.createProgram();
    // прикрепляем к ней шейдеры
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    // связываем программу с контекстом webgl
    this.gl.linkProgram(this.shaderProgram);

    this.gl.useProgram(this.shaderProgram);
    // установка атрибута программы
    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    // подключаем атрибут для использования
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
  }

  // Функция создания шейдера
  getShader(type,id) {
    const source = document.getElementById(id).innerHTML;
    // создаем шейдер по типу
    const shader = this.gl.createShader(type);
    // установка источника шейдера
    this.gl.shaderSource(shader, source);
    // компилируем шейдер
    this.gl.compileShader(shader);

    return shader;
  }

  // установка буферов вершин и индексов
  initBuffers() {
    // установка буфера вершин
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    // массив координат вершин объекта
    const triangleVertices = [
      0.0,  0.5,  0.0,
      -0.5, -0.5,  0.0,
      0.5, -0.5,  0.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);
    // указываем кол-во точек
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numberOfItems = 3;
  }

  draw() {
    // установка области отрисовки
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // указываем, что каждая вершина имеет по три координаты (x, y, z)
    this.gl.vertexAttribPointer(
      this.shaderProgram.vertexPositionAttribute,
      this.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0
    );
    // отрисовка примитивов - треугольников
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexBuffer.numberOfItems);
  }

}

window.onload = () => new AppWebGlTrianthis();