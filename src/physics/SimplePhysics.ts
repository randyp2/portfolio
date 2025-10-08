import { GRAVITY_Y, RESTITUTION, SECTION_X } from "../typesConstants";

export interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface ColliderRect {
  leftX: number; // Left x coordinate
  rightX: number; // Right x coordinate
  topY: number; // Top y coordinate
  bottomY: number; // Bottom y coordinate
}


export class SimplePhysics {
  body: PhysicsBody;
  worldWidth: number;
  worldHeight: number;
  viewportCenterX: number;
  colliders: ColliderRect[] = []; // Array of rectangles the ball can collide with

  onCollision?: () => void; // Optional collision callback function
  onLaunch?: () => void; // Optional launch callback function

  private hasLaunched: boolean = false; // track if ball has been launched
  private t: number = 0; // track time since last launched
  private launch = {
    x0: 0,
    y0: 0,
    vx0: 0,
    vy0: 0,
  }

  constructor(
    x: number, y: number, 
    radius: number, worldWidth: number, worldHeight: number,
    viewportCenterX: number, 
    colliders: ColliderRect[] = []
  ) {

    this.body = { x, y, vx: 0, vy: 0, radius };
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.viewportCenterX = viewportCenterX;
    this.colliders = colliders;

    // Initialize launch state
    this.launch = { x0: x, y0: y, vx0: 0, vy0: 0 };
  }

  /* SETTERS */
  setColliders(colliders: ColliderRect[]) {
    colliders.forEach(c => {
      console.log(`Collider: leftX:${c.leftX}, rightX:${c.rightX}, topY:${c.topY}, bottomY:${c.bottomY}`);
    });
    this.colliders = colliders; 
  }

  setVelocity(vx: number, vy: number) {
    this.launch = { x0: this.body.x, y0: this.body.y, vx0: vx, vy0: vy };
    this.t = 0;
    this.hasLaunched = true;
    this.onLaunch?.(); // Trigger launch sound effect
  }

  setPosition(x: number, y: number) {
    this.body.x = x;
    this.body.y = y;
    this.body.vx = 0;
    this.body.vy = 0;
    this.launch = { x0: x, y0: y, vx0: 0, vy0: 0 };
    this.t = 0;
    this.hasLaunched = false;
  }

  update(dt: number) {

    this.t += dt; // advance time in seconds
    const { x0, y0, vx0, vy0 } = this.launch;

    // closed-form kinematic equations
    this.body.x = x0 + vx0 * this.t;
    this.body.y = y0 + vy0 * this.t + 0.5 * GRAVITY_Y * this.t * this.t;

    // instantaneous velocity (for bounce handling)
    this.body.vx = vx0;
    this.body.vy = vy0 + GRAVITY_Y * this.t;

    /* ====== COLLISION HANDLING ====== */
    // --- World Bounds ---
    const radius: number = this.body.radius;


    const rightBoundary = SECTION_X.thanks + 400;

    // floor
    if (this.body.y + radius > this.worldHeight) {
      this.body.y = this.worldHeight - radius;

      // compute new bounce velocities
      const newVx = this.body.vx * 0.98; // friction
      const newVy = -this.body.vy * RESTITUTION;

      // start a new parabola from this point
      this.launch = { x0: this.body.x, y0: this.body.y, vx0: newVx, vy0: newVy };
      this.t = 0;

      if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // ceiling
    if (this.body.y - radius < 0) {
      this.body.y = radius;
      const newVy = -this.body.vy * RESTITUTION;
      this.launch = { x0: this.body.x, y0: this.body.y, vx0: this.body.vx, vy0: newVy };
      this.t = 0;

      if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // left wall
    if (this.body.x - radius < -this.viewportCenterX) {
      this.body.x = -this.viewportCenterX + radius;
      const newVx = -this.body.vx * RESTITUTION;
      this.launch = { x0: this.body.x, y0: this.body.y, vx0: newVx, vy0: this.body.vy };
      this.t = 0;

      if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // right wall
    if (this.body.x + radius > rightBoundary) {
      this.body.x = rightBoundary - radius;
      const newVx = -this.body.vx * RESTITUTION;
      this.launch = { x0: this.body.x, y0: this.body.y, vx0: newVx, vy0: this.body.vy };
      this.t = 0;

      if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // stop tiny jitter
    if (Math.abs(this.body.vy) < 1 && this.body.y + radius >= this.worldHeight - 1) {
      this.body.vy = 0;
      this.launch.vy0 = 0;
      this.hasLaunched = false;
    }

    // --- Glass Cards ---
    for(const rect of this.colliders) {
      if(
        this.body.x + radius >= rect.leftX &&
        this.body.x - radius <= rect.rightX &&
        this.body.y + radius >= rect.topY &&
        this.body.y - radius <= rect.bottomY
      ) {

      }
      
      // Calculate how much the ball is overlapping onto the rectangle on all sides
      const overlapRightOfBall: number = (this.body.x + radius) - rect.leftX;
      const overlapLeftOfBall: number = (rect.rightX) - (this.body.x - radius);
      const overlapBelowBall: number = (this.body.y + radius) - rect.topY;
      const overlapAboveBall: number = (rect.bottomY) - (this.body.y - radius);

      // One with minimum overlap is the side we collided with
      const minOverlap: number = Math.min(overlapRightOfBall, overlapLeftOfBall, overlapBelowBall, overlapAboveBall);
      if(minOverlap < 0) continue;
      switch(minOverlap) {
        
        // Rectangle collied with right side of ball 
        case overlapRightOfBall:
          this.body.x = rect.leftX - radius;

          // Ensure vx is negative and dampen with restitution
          this.body.vx = -Math.abs(this.body.vx) * (RESTITUTION/2); 
          if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;

        case overlapLeftOfBall:
          this.body.x = rect.rightX + radius;
          this.body.vx = Math.abs(this.body.vx) * (RESTITUTION/2); 
          if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;  
        
        case overlapBelowBall:
          this.body.y = rect.topY - radius;
          this.body.vy = -Math.abs(this.body.vy) * (RESTITUTION/2); 
          if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;
        
        case overlapAboveBall:
          this.body.y = rect.bottomY + radius;
          this.body.vy = Math.abs(this.body.vy) * (RESTITUTION/2); 
          if(this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;
        
        default: break;
      }

      // Reset launch from collision point
      this.launch = { x0: this.body.x, y0: this.body.y, vx0: this.body.vx, vy0: this.body.vy };
      this.t = 0;


    }





  }
}