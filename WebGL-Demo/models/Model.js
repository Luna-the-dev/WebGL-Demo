// Parent class for all models in this program
class Model {
  constructor(color) {
      this.vertices = new Float32Array([]);
      this.indices  = new Uint16Array([]);
      this.normals  = new Float32Array([]);

      this.color = color;

      this.translate = [0.0, 0.0, 0.0];
      this.rotate    = [0.0, 0.0, 0.0];
      this.scale     = [1.0, 1.0, 1.0];
  }

  // sets the translate property for the cylinder
  setTranslate(x, y, z) {
    this.translate[0] = x;
    this.translate[1] = y;
    this.translate[2] = z;
  }

  // sets the rotate property for the cylinder
  setRotate(x, y, z) {
    this.rotate[0] = x;
    this.rotate[1] = y;
    this.rotate[2] = z;
  }
  
  // sets the scale property for the cylinder
  setScale(x, y, z) {
    this.scale[0] = x;
    this.scale[1] = y;
    this.scale[2] = z;
  }

  /**
   * draws the model
   * @param {Boolean} drawWireFrame draw wireframe if true, polys if false
   */
   drawModel(drawWireFrame) {
    // perform transformations
    this.transform();

    // Set u_Color variable from fragment shader
    gl.uniform3f(u_Color, this.color[0], this.color[1], this.color[2]);

    // Send vertices and indices from cube to the shaders
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    if (drawWireFrame === false) {
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0); // drawing the cylinder
      return;
    }

    // drawing the wireframe
    gl.drawElements(gl.LINE_LOOP, this.indices.length, gl.UNSIGNED_SHORT, 0); // drawing the cylinder
  }

  // utility function to perform transformations (translate, rotate, and scale)
  // uses a global Matrix4 object (modelMatrix) to calculate and perform the transformations
  transform() {
    // Update model matrix combining translate, rotate and scale from cube
    modelMatrix.setIdentity();

    // Apply translation
    modelMatrix.translate(this.translate[0], this.translate[1], this.translate[2]);

    // Apply rotations
    modelMatrix.rotate(this.rotate[0], 1, 0, 0);
    modelMatrix.rotate(this.rotate[1], 0, 1, 0);
    modelMatrix.rotate(this.rotate[2], 0, 0, 1);

    // Apply scaling
    modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Compute normal matrix N_mat = (M^-1).T
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  }
}
