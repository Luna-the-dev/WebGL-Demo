/**
 * utility function to generate the text for the cylinder data file
 * @param {Object} cylinder Cylinder object
 * @returns string for the text file
 */
function generateCylinderText(cylinder) {
  let text = '';
  text += `Here is the data for Cylinder ${parseInt(document.getElementById('model-select').value)+1}\n\n`;
  text += `Number of sides: ${cylinder.n}\n`;
  text += '\n-------------------------------------------------------------\n\n';
  text += generateCylinderCoorText(cylinder) + '\n-------------------------------------------------------------\n\n';
  text += generateCylinderPolyText(cylinder) + '\n-------------------------------------------------------------\n\n';
  text += generateCylinderNormalsText(cylinder) + '\n';

  return text;
}

/**
 * generates the text for the cylinder vertices
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateCylinderCoorText(cylinder) {
  let text = '# cylinder vertex coordinates\n\n';

  // get the original vertices array
  let oldVertices = cylinder.vertices;
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

  numOfVertices -= 2;
  numOfVertices /= 3;

  // output each individual coor formatted
  let count = 0, i = 0;
  text += '\nVertices with normals_a: \n';
  for (i; i < numOfVertices; ++i) {
    text += `${i}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  numOfVertices *= 2;
  text += '\nVertices with normals_b: \n';
  for (i; i < numOfVertices; ++i) {
    text += `${i}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  numOfVertices *= 1.5;
  text += '\nVertices with normals_c: \n';
  for (i; i < numOfVertices; ++i) {
    text += `${i}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices in center of caps: \n';
  for (let i = 0; i < 2; ++i) {
    text += `${numOfVertices++}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}

/**
 * generates the text for the cylinder polygons
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateCylinderPolyText(cylinder) {
  let text = '# cylinder polygons\n\n';

  let indices = cylinder.indices;
  let numOfPolys = indices.length / 3;
  text += 'Total number of polygons: ' + numOfPolys + '\n\n'; // outputs the total number of vertices

  numOfPolys /= 2;

  // output each individual coor formatted
  let count = 0, i = 0;
  text += 'Polygons along the cylinder sides: \n';
  for (i; i < numOfPolys; ++i) {
    text += `tri${i}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  numOfPolys = (numOfPolys / 2) * 3;
  text += '\nPolygons along top cap: \n';
  for (i; i < numOfPolys; ++i) {
    text += `tri${i}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }
  numOfPolys = (numOfPolys / 3) * 4;
  text += '\nPolygons along bottom cap: \n';
  for (i; i < numOfPolys; ++i) {
    text += `tri${i}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }

  return text;
}

/**
 * generates the text for the cylinder normals
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateCylinderNormalsText(cylinder) {
  let text = '# cylinder vertex normals\n\n';

  // get the original normals array
  let oldNormals = cylinder.normals;
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

  numOfNormals -= 2;
  numOfNormals /= 3;

  // output each individual coor formatted
  let count = 0, i = 0;
  text += 'Vertices with normals_a: \n';
  for (i; i < numOfNormals; ++i) {
    text += `${i}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  numOfNormals *= 2;
  text += '\nVertices with normals_b: \n';
  for (i; i < numOfNormals; ++i) {
    text += `${i}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  numOfNormals *= 1.5
  text += '\nVertices with normals_c: \n';
  for (i; i < numOfNormals; ++i) {
    text += `${i}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }
  text += '\nVertices in center of caps: \n';
  for (let i = 0; i < 2; ++i) {
    text += `${numOfNormals++}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}