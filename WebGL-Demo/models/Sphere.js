class Sphere extends Model {
  constructor(color, n=13) {
    super(color); // initializes the color, as well as the translate, scale, and rotate coordinates for the unit model
    
    this.n = n; // number of "lines" intersecting the sphere either longitudally or latitudally

    this.vertices = this.generateVertices(this.n); // calculate the vertices' coordinates and put them into a Float32Array object
    this.indices = this.generateIndices(this.n); // generating the indices
    this.normals = this.vertices // generating the vertex normals for flat shading
  }

  setShading(smoothShading) {
    this.smoothShading = smoothShading;
    return;
  }

  // calculates the x, y, and z coords of an n-divided sphere
  generateVertices(n) {
    // array of vertices
    let vertices = new Float32Array( (n+1) * (n+1) * 3 );

    // Generate coordinates
    let count = 0;
    for (let j = 0; j <= n; j++) {
      let aj = j * Math.PI / n;
      let sj = Math.sin(aj);
      let cj = Math.cos(aj);
      for (let i = 0; i <= n; i++) {
        let ai = i * 2 * Math.PI / n;
        let si = Math.sin(ai);
        let ci = Math.cos(ai);

        vertices[count++] = si * sj; // x
        vertices[count++] = cj;      // y
        vertices[count++] = ci * sj; // z
      }
    }

    return vertices;
  }

  // generates a Uint16Array object contining the indices of the triangles making up the faces
  generateIndices(n) {
    // array of indices
    let indices = new Uint16Array( n * n * 6 );

    // Generate indices
    let count = 0;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        let p1 = j * (n+1) + i;
        let p2 = p1 + (n+1);

        indices[count++] = p1;
        indices[count++] = p2;
        indices[count++] = p1 + 1;

        indices[count++] = p1 + 1;
        indices[count++] = p2;
        indices[count++] = p2 + 1;
      }
    }

    return indices;
  }
}
