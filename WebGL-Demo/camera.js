class Camera {
  constructor(eyePos=[0, 0, 5]) {
    this.near = 0.1;
    this.far = 1000;
    this.fov = 60;

    this.eye = new Vector3(eyePos);
    this.center = new Vector3([0, 0, 0]);
    this.up = new Vector3([0, 1, 0]);

    this.projMatrix = new Matrix4();
    this.projMatrix.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);

    this.viewMatrix = new Matrix4();
    this.updateView();
  }

  // moves the camera forward/backward
  moveForward(scale) {
    // calculate forward vector
    let forward = new Vector3(this.center.elements);
    forward.sub(this.eye);
    forward.normalize();
    forward.mul(scale);

    // add forward vector to eye and center
    this.eye.add(forward);
    this.center.add(forward);

    this.updateView();
  }

  // move the camera sideways
  moveSideways(scale) {
    // calculate forward vector
    let forward = new Vector3(this.center.elements);
    forward.sub(this.eye);

    // calculate sideways vector
    let sideways = Vector3.cross(forward, this.up)
    sideways.normalize();
    sideways.mul(scale);

    // add sideways movement vector to eye and center
    this.eye.add(sideways);
    this.center.add(sideways);

    this.updateView();
  }

  // move the camera up/down
  moveVertically(scale) {
    // create a vector to move in the y axis
    let distance = new Vector3([0, scale, 0]);

    // add forward vector to eye and center
    this.eye.add(distance);
    this.center.add(distance);

    this.updateView();
  }

  // zooms in/out by changing the pov
  zoom(scale) {
    this.fov *= scale;
    if (this.fov > 179) this.fov = 179;
    this.projMatrix.setPerspective(this.fov, canvas.width/canvas.height, this.near, this.far);
  }

  // arcball camera rotate
  rotateCamera(pitch, yaw) {
    // calculate forward vector
    let forward = new Vector3(this.center.elements);
    forward.sub(this.eye);

    // calculate right vector: up x forward
    let right = Vector3.cross(forward, this.up);
    right.normalize();

    // create rotation matrices
    let rotMatrixPitch = new Matrix4();
    rotMatrixPitch.setRotate(pitch, right.elements[0],
                                    right.elements[1],
                                    right.elements[2]
    );
    let rotMatrixYaw = new Matrix4();
    rotMatrixYaw.setRotate(yaw, this.up.elements[0],
                                this.up.elements[1],
                                this.up.elements[2]
    );

    // rotate the pitch and yaw of the forward vector
    let forward_prime = rotMatrixPitch.multiplyVector3(forward);
    forward_prime = rotMatrixYaw.multiplyVector3(forward_prime);

    this.center.set(forward_prime);

    this.updateView();
  }

  // pans the camera left/right
  pan(angle) {
    // rotate center point around the up vector
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(angle, this.up.elements[0],
                               this.up.elements[1],
                               this.up.elements[2]
    );

   // calculate forward vector
   let forward = new Vector3(this.center.elements);
   forward.sub(this.eye);

   // rotate forward vector around up vector
   let forward_prime = rotMatrix.multiplyVector3(forward);
   this.center.set(forward_prime);

   this.updateView();
  }

  // tilts the camera up/down
  tilt(angle) {
    // calculate forward vector: center - eye
    let forward = new Vector3(this.center.elements);
    forward.sub(this.eye);

    // calculate right vector: up x forward
    let right = Vector3.cross(forward, this.up)
    right.normalize();

    // create a rotation matrix with angle and the right vector
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(angle, right.elements[0],
                               right.elements[1],
                               right.elements[2]
    );

    // rotate forward vector around right vector
    let forward_prime = rotMatrix.multiplyVector3(forward);
    this.center.set(forward_prime);

    // rotate forward up around right vector
    this.up = rotMatrix.multiplyVector3(this.up).normalize();
    
    this.updateView();
  }

  // updates the camera's view using it's view matrix
  updateView() {
    this.viewMatrix.setLookAt(
        this.eye.elements[0],
        this.eye.elements[1],
        this.eye.elements[2],
        this.center.elements[0],
        this.center.elements[1],
        this.center.elements[2],
        this.up.elements[0],
        this.up.elements[1],
        this.up.elements[2]
    );
  }
}
