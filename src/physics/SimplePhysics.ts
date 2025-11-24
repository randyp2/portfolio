import { BLOCK_RESTITUTION, COEFFICIENT_OF_FRICTION, GRAVITY_Y, RESTITUTION } from "../typesConstants";

// export interface PhysicsBody {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   radius: number;
// }

export interface PhysicsEntity {
  id: string;
  type: "ball" | "block";
  x: number;
  y: number;
  vx: number;
  vy: number;
  

  width?: number;   // for blocks
  height?: number;  // for blocks
  radius?: number;  // for ball
  mass: number;

  label?: string;  // optional display text (e.g., "5N")
  justCollided?: boolean; // optional flag to indicate recent collision
}

export interface ColliderRect {
  leftX: number; // Left x coordinate
  rightX: number; // Right x coordinate
  topY: number; // Top y coordinate
  bottomY: number; // Bottom y coordinate
}


export class SimplePhysics {
  /* ---------- Primary Ball (single projectile) ---------- */
  body: PhysicsEntity;

  /* ---------- Dynamic Entities ---------- */
  blocks: PhysicsEntity[] = []; // Falling masses

  /* ---------- World Settings ---------- */
  worldWidth: number;
  worldHeight: number;
  viewportCenterX: number;
  colliders: ColliderRect[] = []; // Array of rectangles the ball can collide with

  /* ---------- Event Callbacks ---------- */
  onCollision?: () => void; // Optional collision callback function
  onLaunch?: () => void; // Optional launch callback function

  /* ---------- Internal Launch State ---------- */
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

    // this.body = { x, y, vx: 0, vy: 0, radius };

    // Initialize ball physics body
    this.body = {
      id: "ball",
      type: "ball",
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      mass: 1,
    };

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.viewportCenterX = viewportCenterX;
    this.colliders = colliders;

    // Initialize launch state
    this.launch = { x0: x, y0: y, vx0: 0, vy0: 0 };
  }

  /* ============================================================
     PUBLIC SETTERS
     ============================================================ */
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

  /* ============================================================
     BLOCK MANAGEMENT
     ============================================================ */
  
  addBlock(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    mass: number,
    label: string
  ) {
    this.blocks.push({
      id,
      type: "block",
      x,
      y,
      vx: 0,
      vy: 0,
      width,
      height,
      mass,
      label,
      justCollided: false,
    });
  }


  /* ============================================================
     UPDATE LOOP
     ============================================================ */

  update(dt: number) {
    this.updateBall(dt); // Update ball position
    this.updateBlocks(dt); // Update block positions 

    // Handle ball ↔ block collisions
    for (const block of this.blocks) {
      if (this.ballBlockCollision(this.body, block)) {
        this.resolveBallBlockCollision(this.body, block, RESTITUTION);
      }

      // if(this.blockCollision(this.body, block)) {
      //   this.resolveBlockBlockCollision(this.body, block, RESTITUTION);
      // }

      
    }


    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = i + 1; j < this.blocks.length; j++) {
        const block1 = this.blocks[i];
        const block2 = this.blocks[j];
    
        if (this.blockCollision(block1, block2)) {
          this.resolveBlockBlockCollision(block1, block2, BLOCK_RESTITUTION);
        }
      }
    }
  }

  /* ============================================================
     BALL LOGIC 
     ============================================================ */
  updateBall(dt: number) {
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
    const radius: number | undefined = this.body.radius;
    if(radius === undefined) return;


    const rightBoundary = this.worldWidth + 400;

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

  /* ============================================================
     BLOCK LOGIC
     ============================================================ */
  updateBlocks(dt: number) {

    for(const block of this.blocks) {

      //Apply gravity 
      block.vy += GRAVITY_Y * dt;

      // Update position 
      // block.x += block.vx * dt; // No acceleration applied
      block.y += block.vy * dt;

      // --- World Bounds Collision ---

      // floor  
      if(block.y + (block.height! / 2) >= this.worldHeight) {
        block.y = this.worldHeight - (block.height! / 2); // Reset y position to be on the floor
        block.vy = -block.vy * BLOCK_RESTITUTION; // Reverse and dampen y velocity

        // if(block.vy < 0.5) { // Stop tiny jitter
        //   block.vy = 0; // Set to rest
        // }

        if(block.vx !== 0 && !block.justCollided) { // Moving horizontally
          const frictionForce: number = COEFFICIENT_OF_FRICTION * block.mass * GRAVITY_Y; // F_friction = μ * m * g
          const sign: number = Math.sign(block.vx); // Direction of motion
          // Apply deceleration
          block.vx -= sign * frictionForce;

          // Prevent direction flip / overshoot
          if (Math.sign(block.vx) !== sign) block.vx = 0;
        }
      }

      // Walls possibly impelment later
      // Update horizontal position after applying friction
      block.x += block.vx * dt;

      block.justCollided = false; // Reset collision flag
    }
  }

  /* ============================================================
     COLLISION HELPERS
     ============================================================ */

  // Determine 
  private ballBlockCollision(ball: PhysicsEntity, rect: PhysicsEntity): boolean { 
    const halfWidth: number = rect.width! / 2;
    const halfHeight: number = rect.height! / 2;

    const topRect: number = rect.y - halfHeight;
    const bottomRect: number = rect.y + halfHeight;
    const leftRect: number = rect.x - halfWidth;
    const rightRect: number = rect.x + halfWidth;

    const closestX: number = Math.max(leftRect, Math.min(ball.x, rightRect));
    const closestY: number = Math.max(topRect, Math.min(ball.y, bottomRect));

    // Find the distance between the ball's center and this closest point
    const distanceX: number = ball.x - closestX;
    const distanceY: number = ball.y - closestY;

    // If the distance is less than the ball's radius, there's a collision
    return distanceX * distanceX + distanceY * distanceY < (ball.radius! * ball.radius!);
  }

  private blockCollision(rect1: PhysicsEntity, rect2: PhysicsEntity): boolean { 
    const halfWidth1: number = rect1.width! / 2;
    const halfHeight1: number = rect1.height! / 2;
    const halfWidth2: number = rect2.width! / 2;
    const halfHeight2: number = rect2.height! / 2;

    return !(
      rect1.x + halfWidth1 < rect2.x - halfWidth2 || // rect1 is left of rect2
      rect1.x - halfWidth1 > rect2.x + halfWidth2 || // rect1 is right of rect2
      rect1.y + halfHeight1 < rect2.y - halfHeight2 || // rect1 is above rect2
      rect1.y - halfHeight1 > rect2.y + halfHeight2    // rect1 is below rect2
    );
  }

  // Resolve ballBlockCollision 
  private resolveBallBlockCollision(ball: PhysicsEntity, block: PhysicsEntity, restitution: number) {
    
    /* ------- Determine Collision ------- */

    const rightX: number = block.x + (block.width! / 2);
    const leftX: number = block.x - (block.width! / 2);
    const topY: number = block.y - (block.height! / 2);
    const bottomY: number = block.y + (block.height! / 2);

    // Calculate how much the ball is overlapping onto the rectangle on all sides
    const overlapRightOfBall: number = (ball.x + ball.radius!) - leftX;
    const overlapLeftOfBall: number = (rightX) - (ball.x - ball.radius!);
    const overlapBelowBall: number = (ball.y + ball.radius!) - topY;
    const overlapAboveBall: number = (bottomY) - (ball.y - ball.radius!);

    // One with minimum overlap is the side we collided with
    const minOverlap: number = Math.min(overlapRightOfBall, overlapLeftOfBall, overlapBelowBall, overlapAboveBall);
    
    // Collision with bottom of ball and top of mass
    if(minOverlap == overlapBelowBall) {  
      ball.y = topY - ball.radius!;
      ball.vy = -Math.abs(ball.vy) * (RESTITUTION/2); 
      this.launch = {x0: ball.x, y0: ball.y, vx0: ball.vx, vy0: ball.vy,};
      this.t = 0;

      return;
    }

    /* ------- Determine Possible X Collision ------- */
    // Negative -> ball is left of block
    // Positive -> ball is right of block
    const ballPositionRelativeToBlockX: number = ball.x - block.x; 

    // Negative -> ball moving left
    // Positive -> ball moving right
    const relVx: number  = ball.vx - block.vx; // relative velocity x of ball to block

    // If ball is moving away from block, no collision possible
    // Positive -> Moving away
    // Negative -> Moving towards
    if(ballPositionRelativeToBlockX * relVx >= 0) return; // No collision possible

    /* ------- Collision Handling (Conservation of momentum) ------- */
    // Assume 1D elastic collision

    const m1: number = ball.mass; // Mass of ball
    const m2: number = block.mass; // Mass of block
    const v1: number = ball.vx; // Initial velocity of ball
    const v2: number = block.vx; // Initial velocity of block
  
    /**
     * Conservation of momentum: m1*v1 + m2*v2 = m1*v1' + m2*v2'
     * v1 + v1' = v2 + v2'
     */

    // Calculate new velocities after collision
    const newV1: number = ((m1 - m2) * v1 + 2*m2*v2) / (m1 + m2); // Final velocity of ball
    const newV2: number = (2*m1*v1  + (m2 - m1)*v2) / (m1 + m2); // Final velocity of block

    ball.vx = newV1 * restitution; // Apply restitution to ball
    block.vx = newV2 * restitution; // Apply restitution to block

    this.launch = {x0: ball.x, y0: ball.y, vx0: ball.vx, vy0: ball.vy,};
    this.t = 0;


    block.justCollided = true; // Optional flag for styling

  }

  private resolveBlockBlockCollision(block1: PhysicsEntity, block2: PhysicsEntity, restitution: number) { 
    
    // Detect collision side
    const halfW1: number = block1.width! / 2;
    const halfH1: number = block1.height! / 2;
    const halfW2: number = block2.width! / 2;
    const halfH2: number = block2.height! / 2;

    // Determine edge positions
    // Block 1
    const left1: number = block1.x - halfW1;
    const right1: number = block1.x + halfW1;
    const top1: number = block1.y - halfH1;
    const bottom1: number = block1.y + halfH1;

    // Block 2
    const left2: number = block2.x - halfW2;
    const right2: number = block2.x + halfW2;
    const top2: number = block2.y - halfH2;
    const bottom2: number = block2.y + halfH2;


    // Compute overlaps
    const overlapX: number = Math.min(right1, right2) - Math.max(left1, left2);
    const overlapY: number = Math.min(bottom1, bottom2) - Math.max(top1, top2);

    if(overlapX <= 0 || overlapY <= 0) return; // No collision occured

    // Horizontal collision
    if(overlapX < overlapY) {
      // Assume elastic collision handling
      const m1: number = block1.mass; // Mass of ball
      const m2: number = block2.mass; // Mass of block
      const v1: number = block1.vx; // Initial velocity of ball
      const v2: number = block2.vx; // Initial velocity of block


      const newV1: number = ((m1 - m2) * v1 + 2*m2*v2) / (m1 + m2); // Final velocity of ball
      const newV2: number = (2*m1*v1  + (m2 - m1)*v2) / (m1 + m2); // Final velocity of block

      block1.vx = newV1 * restitution; // Apply restitution to ball
      block2.vx = newV2 * restitution; // Apply restitution to block

      const separation = overlapX / 2;
      if (block1.x < block2.x) {
        block1.x -= separation;
        block2.x += separation;
      } else {
        block1.x += separation;
        block2.x -= separation;
      }

      return;
    }

    // Vertical Collisino (no bouncing just stack)
    // Come to rest
    block1.vy = 0;
    block2.vy = 0;

    block1.justCollided = true;
    block2.justCollided = true;
  }

  
}
