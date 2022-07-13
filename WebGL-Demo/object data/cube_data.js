/**
 * utility function to generate the text for the cube data file
 * @param {Object} cube cube object
 * @returns string for the text file
 */
 function generateCubeText(cube) {
  let text = '';
  text += `Here is the data for Cube ${parseInt(document.getElementById('model-select').value)+1}\n\n`;
  text += `Note: this is using the right-hand system for the model to describe which side the faces are on.\n`;
  text += '\n-------------------------------------------------------------\n\n';
  text += generateCubeCoorText(cube) + '\n-------------------------------------------------------------\n\n';
  text += generateCubePolyText(cube) + '\n-------------------------------------------------------------\n\n';
  text += generateCubeNormalsText(cube) + '\n';

  return text;
}

/**
 * generates the text for the cube vertices
 * @param {Object} cube cube object
 * @returns string of the output text fot the data file
 */
function generateCubeCoorText(cube) {
  let text = '# cube vertex coordinates\n\n';

  // get the original vertices array
  let oldVertices = cube.vertices;
  let numOfVertices = oldVertices.length;

  // array with the coords of the vertices after transformations
  let newVertices = [];

  // calculate the new vertices' coords by multiplying the old vertices by the modelMatrix
  for (let i = 0; i < numOfVertices; i += 3) {
    let oldVertex = new Vector3([oldVertices[i], oldVertices[i+1], oldVertices[i+2]]);
    let newVertex = modelMatrix.multiplyVector3(oldVertex)

    newVertices.push(newVertex.elements[0]);
    newVertices.push(newVertex.elements[1]);
    newVertices.push(newVertex.elements[2]);
  }

  numOfVertices /= 3;
  text += 'Total number of vertices: ' + numOfVertices + '\n'; // outputs the total number of vertices

  // output each individual coor formatted
  let i = 0, count = 0;
  text += '\nVertices on front face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on right face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on top face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on left face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on bottom face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on back face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}

/**
 * generates the text for the cube polygons
 * @param {Object} cube cube object
 * @returns string of the output text fot the data file
 */
function generateCubePolyText(cube) {
  let text = '# cube polygons\n\n';

  let indices = cube.indices;
  let numOfPolys = indices.length / 3;
  text += 'Total number of polygons: ' + numOfPolys + '\n\n'; // outputs the total number of vertices
  
  // output each individual coor formatted
  let count = 0, i = 0;
  text += '\nPolygons on front face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  text += '\nPolygons on right face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
    }
  text += '\nPolygons on top face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  text += '\nPolygons on left face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  text += '\nPolygons on bottom face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  text += '\nPolygons on back face: \n';
  for (let polys = 0; polys < 2; ++polys) {
    text += `tri${i++}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }

  return text;
}

/**
 * generates the text for the cube normals
 * @param {Object} cube cube object
 * @returns string of the output text fot the data file
 */
function generateCubeNormalsText(cube) {
  let text = '# cube vertex normals\n\n';

  // get the original normals array
  let oldNormals = cube.normals;
  let numOfNormals = oldNormals.length;

  // array with the coords of the vertices after transformations
  let newNormals = [];

  // calculate the new vertices' coords by multiplying the old vertices by the modelMatrix
  for (let i = 0; i < numOfNormals; i += 3) {
    let oldNormal = new Vector3([oldNormals[i], oldNormals[i+1], oldNormals[i+2]]);
    let newNormal = modelMatrix.multiplyVector3(oldNormal)

    newNormals.push(newNormal.elements[0]);
    newNormals.push(newNormal.elements[1]);
    newNormals.push(newNormal.elements[2]);
  }

  numOfNormals /= 3;
  text += 'Total number of vertices: ' + numOfNormals + '\n\n'; // outputs the total number of vertices

  // output each individual coor formatted
  let i = 0, count = 0;
  text += '\nVertices on front face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on right face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on top face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on left face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on bottom face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices on back face: \n';
  for (let verts = 0; verts < 4; ++verts) {
    text += `${i++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}