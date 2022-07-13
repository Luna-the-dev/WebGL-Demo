/**
 * utility function to generate the text for the cylinder data file
 * @param {Object} cylinder Cylinder object
 * @returns string for the text file
 */
 function generateSphereText(cylinder) {
  let text = '';
  text += `Here is the data for Cylinder ${parseInt(document.getElementById('model-select').value)+1}\n\n`;
  text += `Number of sides: ${cylinder.n}\n`;
  text += '\n-------------------------------------------------------------\n\n';
  text += generateSphereCoorText(cylinder) + '\n-------------------------------------------------------------\n\n';
  text += generateSpherePolyText(cylinder) + '\n-------------------------------------------------------------\n\n';
  text += generateSphereNormalsText(cylinder) + '\n';

  return text;
}

/**
 * generates the text for the cylinder vertices
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateSphereCoorText(cylinder) {
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

  // output each individual coor formatted
  let count = 0;
  text += '\nNote: Vertices are going down the latitude lines, traveling counter-clockwise around them. \n\n';
  for (let i = 0; i < numOfVertices; ++i) {
    text += `${i}: ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}, ${newVertices[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}

/**
 * generates the text for the cylinder polygons
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateSpherePolyText(cylinder) {
  let text = '# cylinder polygons\n\n';

  let indices = cylinder.indices;
  let numOfPolys = indices.length / 3;
  text += 'Total number of polygons: ' + numOfPolys + '\n\n'; // outputs the total number of vertices

  // output each individual coor formatted
  let count = 0;
  text += 'Note: Polygons going down the latitude lines, traveling counter-clockwise around them. \n\n';
  for (let i = 0; i < numOfPolys; ++i) {
    text += `tri${i}: ${indices[count++]} ${indices[count++]} ${indices[count++]}\n`;
  }

  return text;
}

/**
 * generates the text for the cylinder normals
 * @param {Object} cylinder Cylinder object
 * @returns string of the output text fot the data file
 */
function generateSphereNormalsText(cylinder) {
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

  // output each individual coor formatted
  let count = 0;
  text += 'Note: Vertices going down the latitude lines, traveling counter-clockwise around them. \n\n';
  for (let i = 0; i < numOfNormals; ++i) {
    text += `${i}: ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}, ${newNormals[count++].toFixed(3).replace('-0.000','0.000')}\n`;
  }

  return text;
}