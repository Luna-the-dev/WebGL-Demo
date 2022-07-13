/**
 * downloads a formatted text file for the vertices, indices, and normals of a model
 * NOTE: this code is heavily inspired from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
 */
 function handleDownloadEvent() {
  let selector = document.getElementById('model-select');

  let model = models[parseInt(selector.value)+1];
  // alerting an error message to the user if they did not generate a model before trying to download its data
  if (typeof model == 'undefined') {
    alert("You must generate a model before downloading it's data.");
    return;
  }

  let object = selector.options[selector.selectedIndex].text;
  object = object.split(' ')[0];
  object = object[0].toLowerCase() + object.slice(1);

  // specifying whether the user is downloading coors or poly
  let filename = '', text = '';
  if (object === 'cylinder') {
    filename = `Cylinder_${parseInt(document.getElementById('model-select').value)+1}_data.txt`;
    text = generateCylinderText(model);
  } else if (object === 'cube') {
    filename = `Cube_${parseInt(document.getElementById('model-select').value)+1}_data.txt`;
    text = generateCubeText(model);
  } else if (object === 'sphere') {
    filename = `Sphere_${parseInt(document.getElementById('model-select').value)+1}_data.txt`;
    text = generateSphereText(model);
  } else {
    alert("Error: object type doesn't exist");
    return;
  }

  // creating a hidden html element to download the file
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  // automatically clicking this element to download the file
  element.click();

  // removing the element from the webpage
  document.body.removeChild(element);
}