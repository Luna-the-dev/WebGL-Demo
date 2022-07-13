// cylinder model
class Cylinder extends Model {
  constructor(color, n=13, smoothShading=true) {
    super(color); // initializes the color, as well as the translate, scale, and rotate coordinates for the unit model

    this.n = n; // number of sides of the cylinder

    this.vertices = this.generateVertices(this.n); // calculate the vertices' coordinates and put them into a Float32Array object
    this.indices = this.generateIndices(this.n); // generating the indices
    this.setShading(smoothShading);
  }

  setShading(smoothShading) {
    this.smoothShading = smoothShading;
    if (smoothShading)
      this.normals = this.vertices
    else
      this.normals = this.generateNormals(this.n, this.vertices, this.indices);
  }

  /**
   * Calculates the x, y, and z coords of an n-sided cylinder of height 1 along the z-axis
      Example Vertex progression for n=4:
          Sides: 
      [0a, 4a, 1a, 5a]  →  [1b, 5b, 2a, 6a]  →  [2b, 6b, 3a, 7a]  →  [3b, 7b, 0b, 4b]
          Top cap:           Bottom cap:      Centers:
      [0c, 1c, 2c, 3c]  →  [4c, 5c, 6c, 7c]  →  [8, 9]

      Order of vertices in the array:
          Top_a:           Bottom_a:                         
      [0, ..., n-1]  →  [n, ..., 2n-1]  →
          Top_b:            Bottom_b:
      [2n, ..., 3n-1]  →  [3n, ..., 4n-1]  →
          Top_c:            Bottom_c:    Cap centers:
      [4n, ..., 5n-1]  →  [5n, ..., 6n-1]  →  [6n, 6n+1]
  * 
  * @param {Number} n number of sides of the cylinder
  * @return {Object} Float32Array object containing the vertices
  */
  generateVertices(n) {
    let nx3 = n * 3; // used to simplify calculations

    // array of vertices
    let vertices = new Float32Array( (nx3*6) + 6 );

    let count = 0; // index counter for the vertices array
    let x_coord = 0, y_coord = 0, theta = 0;

    for (let i = 1; i <= n; ++i) {
      // calculating the x and y coordinates of the ith vertex around the cylinder
      theta = (i * 2 * Math.PI) / n;
      x_coord = Math.cos(theta);
      y_coord = Math.sin(theta);

      // pushing the coords of the ith vertex's first face (side_a)
      vertices[count] = x_coord;
      vertices[count+1] = y_coord;
      vertices[count+2] = 0.5;
      vertices[nx3+count] = x_coord;
      vertices[nx3+count+1] = y_coord;
      vertices[nx3+count+2] = -0.5;

      // pushing the coords of the ith vertex's second face (side_b)
      vertices[2*nx3+count] = x_coord;
      vertices[2*nx3+count+1] = y_coord;
      vertices[2*nx3+count+2] = 0.5;
      vertices[3*nx3+count] = x_coord;
      vertices[3*nx3+count+1] = y_coord;
      vertices[3*nx3+count+2] = -0.5;

      // pushing the coords of the ith vertex's third face (side_c aka cap)
      vertices[4*nx3+count] = x_coord;
      vertices[4*nx3+count+1] = y_coord;
      vertices[4*nx3+count+2] = 0.5;
      vertices[5*nx3+count] = x_coord;
      vertices[5*nx3+count+1] = y_coord;
      vertices[5*nx3+count+2] = -0.5;

      count += 3;
    }

    // pushing the center vertices of the top and bottom cap
    count = nx3 * 6;
    vertices[count++] = 0.0;
    vertices[count++] = 0.0;
    vertices[count++] = 0.5;
    vertices[count++] = 0.0;
    vertices[count++] = 0.0;
    vertices[count] = -0.5;
    
    return vertices;
  }

  /**
   * generates a Uint16Array object contining the indices of the triangles making up the faces
      Example index progression for n = 4:
                Sides: 
      0a  4a  5a    →   0a  5a  1a
      1b  5b  6a    →   1b  6a  2a
      2b  6b  7a    →   2b  7a  3a
      3b  7b  4b    →   3b  4b  0b

        Top cap:		    Bottom cap:
      8,  0c,  1c	      9,  5c,  4c
      8,  1c,  2c       9,  6c,  5c
      8,  2c,  3c	      9,  7c,  6c
      8,  3c,  0c	      8,  4c,  7c

      How to order indices in the array for n = 4:
                  Sides:
      0    4   5 	  →     0   5   1
      9   13   6	  →     9   6   2
      10  14   7	  →    10   7   3
      11  15  12	  →    11  12   8

      Top cap:           Bottom cap:
      24  16  17	       25  21  20
      24  17  18	       25  22  21
      24  18  19	       25  23  22
      24  19  16	       25  20  23
  * @param {Number} n number of sides of the cylinder
  * @returns Uint16Array object containing the indices of the triangles making up the faces
  */
  generateIndices(n) {
    let indices = new Uint16Array( n*12 );
    let count = 0;
    
    // rotating CCW along the sides' indices two form two triangles out of each side
    let topVer = 0, btmVer = n, top_b = 2*n, btm_b = 2*n;

    // first side
    indices[count++] = topVer;   // top left
    indices[count++] = btmVer;   // bottom left
    indices[count++] = ++btmVer; // bottom right
    
    indices[count++] = topVer;   // top left
    indices[count++] = btmVer;   // bottom right
    indices[count++] = ++topVer; // top right
    // "middle" sides
    for (let i = 1; i < n-1; ++i) {
      indices[count++] = topVer+top_b; // top left
      indices[count++] = btmVer+btm_b; // bottom left
      indices[count++] = ++btmVer;     // bottom right
      
      indices[count++] = topVer+top_b; // top left
      indices[count++] = btmVer;       // bottom right
      indices[count++] = ++topVer;     // top right
    }
    // last side
    indices[count++] = topVer+top_b; // top left
    indices[count++] = btmVer+btm_b; // bottom left
    indices[count++] = n+btm_b;      // bottom right

    indices[count++] = topVer+top_b; // top left
    indices[count++] = n+btm_b;      // bottom right
    indices[count++] = 0+top_b;      // top right

    // rotating CCW along the caps starting from the center vertex
    // top cap
    let topVer_c = 4*n, topCtr = 6*n;
    for (let i = 0; i < n-1; ++i) {
      indices[count++] = topCtr;
      indices[count++] = topVer_c;
      indices[count++] = ++topVer_c;
    }
    indices[count++] = topCtr;
    indices[count++] = topVer_c;
    indices[count++] = 4*n;
    // bottom cap
    let btmVer_c = 5*n, btmCtr = 6*n+1;
    for (let i = 0; i < n-1; ++i) {
      indices[count++] = btmCtr;
      indices[count++] = btmVer_c+1;
      indices[count++] = btmVer_c++;
    }
    indices[count++] = btmCtr;
    indices[count++] = 5*n;
    indices[count++] = btmVer_c;

    return indices;
  }

  /**
   * Calculates the normals of an flat-shaded n-sided cylinder of height 1 along the z-axis
   * @param {Number} n number of sides of the cylinder
   * @param {Object} vertices Float32Array object containing the vertices
   * @param {Object} indices Uint16Array object containing the indices
   * @returns Float32Array object containing the normals
   */
  generateNormals(n, vertices, indices) {
    let nx3 = n * 3; // used to simplify calculations

    let normals = new Float32Array( (nx3*6) + 6 ); // array of normals

    ///////////////////////////////////////////////////////////
    // calculating the normals for each side of the cylinder //
    ///////////////////////////////////////////////////////////
    let count_indices = 0;
    for (let side = 0; side < n; ++side) {
      // getting the indices for the 4 vertices on each side
      let index0 = indices[count_indices]*3;
      let index1 = indices[count_indices+1]*3;
      let index2 = indices[count_indices+2]*3;
      let index3 = indices[count_indices+5]*3;
      count_indices += 6

      // creating the two vectors being crossed from the indices array
      let vecA = new Vector3([vertices[index0], vertices[index0+1], vertices[index0+2]]);
      let vecB = new Vector3([vertices[index1], vertices[index1+1], vertices[index1+2]]);
      let vecC = new Vector3([vertices[index2], vertices[index2+1], vertices[index2+2]]);
      
      // calculating the normal using cross product
      let normal = Vector3.cross(vecB.sub(vecA), vecC.sub(vecA));
      normal.normalize();

      // storing the vertex normals for each vertex on this side
      // vertex 0
      normals[index0] = normal.elements[0];
      normals[index0+1] = normal.elements[1];
      normals[index0+2] = normal.elements[2];
      // vertex 1
      normals[index1] = normal.elements[0];
      normals[index1+1] = normal.elements[1];
      normals[index1+2] = normal.elements[2];
      // vertex 2
      normals[index2] = normal.elements[0];
      normals[index2+1] = normal.elements[1];
      normals[index2+2] = normal.elements[2];
      // vertex 3
      normals[index3] = normal.elements[0];
      normals[index3+1] = normal.elements[1];
      normals[index3+2] = normal.elements[2];
    }

    ///////////////////////////////////////////////////
    // calculating the normals for the cylinder caps //
    ///////////////////////////////////////////////////
    for (let cap = 0; cap < 2; ++cap) {
      // getting the indices for the 3 vertices on each triangle on the cap
      let index0 = indices[count_indices]*3;
      let index1 = indices[count_indices+1]*3;
      let index2 = indices[count_indices+2]*3;
      count_indices += 3;
      
      // creating the two vectors being crossed from the indices array
      let vecA = new Vector3([vertices[index0], vertices[index0+1], vertices[index0+2]]);
      let vecB = new Vector3([vertices[index1], vertices[index1+1], vertices[index1+2]]);
      let vecC = new Vector3([vertices[index2], vertices[index2+1], vertices[index2+2]]);

      // calculating the normal using cross product
      let normal;
      if (cap === 0) normal = Vector3.cross(vecB.sub(vecA), vecC.sub(vecA));
      else normal = Vector3.cross(vecB.sub(vecC), vecA.sub(vecC));
      
      normal.normalize();

      let arr_pos = 4*nx3; // for top cap
      if (cap === 1) arr_pos = 5*nx3; // for bottom cap
      // filling in the cap normals
      for (let i = 0; i < n; ++i) {
        normals[arr_pos] = normal.elements[0];
        normals[arr_pos+1] = normal.elements[1];
        normals[arr_pos+2] = normal.elements[2];
        arr_pos += 3;
      }

      // center vertex top cap, else bottom cap
      if (cap === 0) {
        normals[6*nx3] = normal.elements[0];
        normals[6*nx3+1] = normal.elements[1];
        normals[6*nx3+2] = normal.elements[2];
      } else {
        normals[6*nx3+3] = normal.elements[0];
        normals[6*nx3+4] = normal.elements[1];
        normals[6*nx3+5] = normal.elements[2]
      }
    }

    return normals;
  }
}