import {
  BLOCK_RESTITUTION,
  COEFFICIENT_OF_FRICTION,
  GRAVITY_Y,
  RESTITUTION,
} from "../typesConstants";

export interface PhysicsEntity {
  id: string;
  type: "ball" | "block";
  x: number;
  y: number;
  vx: number;
  vy: number;

  width?: number; // For falling rects
  height?: number; // For falling rects
  radius?: number; // for ball
  mass: number;

  label?: string; // Optional text display for rects
  justCollided?: boolean; // Optional flag to indicate recent collision
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
  blocks: PhysicsEntity[] = []; // Store falling masses

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
  };

  constructor(
    x: number,
    y: number,
    radius: number,
    worldWidth: number,
    worldHeight: number,
    viewportCenterX: number,
    colliders: ColliderRect[] = [],
  ) {
    // Initialize ball physics body
    this.body = {
      id: "ball",
      type: "ball",
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      mass: 200,
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
    label: string,
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

    // Handle ball <-> block collisions
    for (const block of this.blocks) {
      if (this.ballBlockCollision(this.body, block))
        this.resolveBallBlockCollision(this.body, block, RESTITUTION);
    }

    for (let i = 0; i < this.blocks.length; ++i) {
      for (let j = 0; j < this.blocks.length; ++j) {
        const block1 = this.blocks[i];
        const block2 = this.blocks[j];

        // No self collision
        if (i == j) continue;

        if (this.blockCollision(block1, block2))
          this.resolveBlockBlockCollision(block1, block2, BLOCK_RESTITUTION);
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
    if (radius === undefined) return;

    const rightBoundary = this.worldWidth + 400;

    // floor
    if (this.body.y + radius > this.worldHeight) {
      this.body.y = this.worldHeight - radius;

      // compute new bounce velocities
      const newVx = this.body.vx * 0.98; // friction
      const newVy = -this.body.vy * RESTITUTION;

      // start a new parabola from this point
      this.launch = {
        x0: this.body.x,
        y0: this.body.y,
        vx0: newVx,
        vy0: newVy,
      };
      this.t = 0;

      if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // ceiling
    if (this.body.y - radius < 0) {
      this.body.y = radius;
      const newVy = -this.body.vy * RESTITUTION;
      this.launch = {
        x0: this.body.x,
        y0: this.body.y,
        vx0: this.body.vx,
        vy0: newVy,
      };
      this.t = 0;

      if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }
    // left wall
    if (this.body.x - radius < -this.viewportCenterX) {
      this.body.x = -this.viewportCenterX + radius;
      const newVx = -this.body.vx * RESTITUTION;
      this.launch = {
        x0: this.body.x,
        y0: this.body.y,
        vx0: newVx,
        vy0: this.body.vy,
      };
      this.t = 0;

      if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // right wall
    if (this.body.x + radius > rightBoundary) {
      this.body.x = rightBoundary - radius;
      const newVx = -this.body.vx * RESTITUTION;
      this.launch = {
        x0: this.body.x,
        y0: this.body.y,
        vx0: newVx,
        vy0: this.body.vy,
      };
      this.t = 0;

      if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
    }

    // stop tiny jitter
    if (
      Math.abs(this.body.vy) < 1 &&
      this.body.y + radius >= this.worldHeight - 1
    ) {
      this.body.vy = 0;
      this.launch.vy0 = 0;
      this.hasLaunched = false;
    }

    // --- Glass Cards ---
    for (const rect of this.colliders) {
      if (
        this.body.x + radius >= rect.leftX &&
        this.body.x - radius <= rect.rightX &&
        this.body.y + radius >= rect.topY &&
        this.body.y - radius <= rect.bottomY
      ) {
      }

      // Calculate how much the ball is overlapping onto the rectangle on all sides
      const overlapRightOfBall: number = this.body.x + radius - rect.leftX;
      const overlapLeftOfBall: number = rect.rightX - (this.body.x - radius);
      const overlapBelowBall: number = this.body.y + radius - rect.topY;
      const overlapAboveBall: number = rect.bottomY - (this.body.y - radius);

      // One with minimum overlap is the side we collided with
      const minOverlap: number = Math.min(
        overlapRightOfBall,
        overlapLeftOfBall,
        overlapBelowBall,
        overlapAboveBall,
      );
      if (minOverlap < 0) continue;
      switch (minOverlap) {
        // Rectangle collied with right side of ball
        case overlapRightOfBall:
          this.body.x = rect.leftX - radius;

          // Ensure vx is negative and dampen with restitution
          this.body.vx = -Math.abs(this.body.vx) * (RESTITUTION / 2);
          if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;

        case overlapLeftOfBall:
          this.body.x = rect.rightX + radius;
          this.body.vx = Math.abs(this.body.vx) * (RESTITUTION / 2);
          if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;

        case overlapBelowBall:
          this.body.y = rect.topY - radius;
          this.body.vy = -Math.abs(this.body.vy) * (RESTITUTION / 2);
          if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;

        case overlapAboveBall:
          this.body.y = rect.bottomY + radius;
          this.body.vy = Math.abs(this.body.vy) * (RESTITUTION / 2);
          if (this.hasLaunched) this.onCollision?.(); // Trigger sound effect
          break;

        default:
          break;
      }

      // Reset launch from collision point
      this.launch = {
        x0: this.body.x,
        y0: this.body.y,
        vx0: this.body.vx,
        vy0: this.body.vy,
      };
      this.t = 0;
    }
  }

  /* ============================================================
     BLOCK LOGIC
     ============================================================ */
  updateBlocks(dt: number) {
    for (const block of this.blocks) {
      // Apply gravity
      block.vy += GRAVITY_Y * dt;

      // Update position
      block.y += block.vy * dt;

      // --- World bounds collision ---

      // floor
      if (block.y + block.height! / 2 >= this.worldHeight) {
        block.y = this.worldHeight - block.height! / 2; // Reset y position to be on the floor
        block.vy = -block.vy * BLOCK_RESTITUTION; // Reverse and damepn y velocity -- Comment out for better perf

        if (block.vx !== 0 && !block.justCollided) {
          const frictionForce: number =
            COEFFICIENT_OF_FRICTION * block.mass * GRAVITY_Y; // F_friction = umg
          const sign: number = Math.sign(block.vx); // Direction of motion

          // Apply deceleration
          block.vx -= sign * frictionForce;

          // Prevent direction flip / overshoot
          if (Math.sign(block.vx) !== sign) block.vx = 0;
        }
      }

      // walls possibly implement later
      // Update horizontal position after applying friction
      block.x += block.vx * dt;

      block.justCollided = false;
    }
  }

  /* ============================================================
     COLLISION HELPERS
     ============================================================ */

  // Determine if collision occured between a ball and a block
  private ballBlockCollision(
    ball: PhysicsEntity,
    rect: PhysicsEntity,
  ): boolean {
    const halfWidth: number = rect.width! / 2;
    const halfHeight: number = rect.height! / 2;

    // x, y -> center of rectangle
    const topRect: number = rect.y - halfHeight;
    const bottomRect: number = rect.y + halfHeight;
    const leftRect: number = rect.x - halfWidth;
    const rightRect: number = rect.x + halfWidth;

    const closestX: number = Math.max(leftRect, Math.min(ball.x, rightRect));
    const closestY: number = Math.max(topRect, Math.min(ball.y, bottomRect));

    // Find distance between the ball's center and closest point
    const distanceX: number = ball.x - closestX;
    const distanceY: number = ball.y - closestY;

    // If distance < ball's radius -> collision
    return (
      distanceX * distanceX + distanceY * distanceY <
      ball.radius! * ball.radius!
    );
  }

  // Determine collision between two blocks
  private blockCollision(rect1: PhysicsEntity, rect2: PhysicsEntity): boolean {
    const halfWidth1: number = rect1.width! / 2;
    const halfHeight1: number = rect1.height! / 2;
    const halfWidth2: number = rect2.width! / 2;
    const halfHeight2: number = rect2.height! / 2;

    return !(
      rect1.x + halfWidth1 < rect2.x - halfWidth2 || // rect1 is left of rect2
      rect1.x - halfWidth1 > rect2.x + halfWidth2 || // rect1 is right of rect2
      rect1.y + halfHeight1 < rect2.y - halfHeight2 || // rect1 is above rect2
      rect1.y - halfHeight1 > rect2.y + halfHeight2 // rect1 is below rect2
    );
  }

  /**
   * Resolves collision between the ball and a block using elastic collision physics.
   *
   * This method handles:
   * 1. Collision detection via overlap calculation (minimum penetration depth)
   * 2. Position correction to prevent the ball from getting stuck inside blocks
   * 3. Velocity update using conservation of momentum formulas
   *
   * The ball uses parabolic (projectile) motion, so after collision we must
   * reset the launch parameters to start a new trajectory from the collision point.
   *
   * @param ball - The ball entity (player-controlled projectile)
   * @param block - The block entity (falling mass block)
   * @param restitution - Coefficient of restitution for energy loss
   */
  private resolveBallBlockCollision(
    ball: PhysicsEntity,
    block: PhysicsEntity,
    restitution: number,
  ) {
    /* ============================================================
       STEP 1: Calculate block boundaries
       ============================================================ */
    const rightX: number = block.x + block.width! / 2;
    const leftX: number = block.x - block.width! / 2;
    const topY: number = block.y - block.height! / 2;
    const bottomY: number = block.y + block.height! / 2;

    /* ============================================================
       STEP 2: Calculate overlap (penetration depth) on each side

       We measure how far the ball has penetrated into the block from each
       direction. The side with minimum overlap is where the collision occurred.
       This is the Minimum Translation Vector (MTV) approach.
       ============================================================ */
    const overlapRightOfBall: number = ball.x + ball.radius! - leftX; // Ball's right edge past block's left
    const overlapLeftOfBall: number = rightX - (ball.x - ball.radius!); // Block's right edge past ball's left
    const overlapBelowBall: number = ball.y + ball.radius! - topY; // Ball's bottom past block's top
    const overlapAboveBall: number = bottomY - (ball.y - ball.radius!); // Block's bottom past ball's top

    // Minimum overlap determines collision normal direction
    const minOverlap: number = Math.min(
      overlapRightOfBall,
      overlapLeftOfBall,
      overlapBelowBall,
      overlapAboveBall,
    );

    // Separation buffer prevents repeated collision detection on next frame
    const separationBuffer = 1;

    /* ============================================================
       STEP 3: Handle Y-axis collisions (ball bounces off top/bottom of block)

       For vertical collisions, we use simple reflection with restitution.
       The ball bounces off and continues its parabolic trajectory.
       ============================================================ */

    // Ball hit top of block (ball coming from above)
    if (minOverlap === overlapBelowBall) {
      // Position correction: move ball above the block
      ball.y = topY - ball.radius! - separationBuffer;

      // Velocity reflection: reverse Y velocity with energy loss
      // Using restitution/2 for softer bounces off blocks (vs. walls)
      ball.vy = -Math.abs(ball.vy) * (restitution / 2);

      // Reset parabolic motion from new position/velocity
      this.launch = { x0: ball.x, y0: ball.y, vx0: ball.vx, vy0: ball.vy };
      this.t = 0;
      block.justCollided = true;
      return;
    }

    // Ball hit bottom of block (ball coming from below)
    if (minOverlap === overlapAboveBall) {
      // Position correction: move ball below the block
      ball.y = bottomY + ball.radius! + separationBuffer;

      /**
       * 2D ELASTIC COLLISION for ball hitting block from below
       *
       * When the ball hits underneath a block, we want to LAUNCH the block upward
       * (and any blocks stacked on top via chain reaction). This uses elastic
       * collision formulas in the Y-axis to transfer momentum.
       *
       * The ball is heavy (200) vs block (4), so the ball will barely slow down
       * while the block gets launched with high upward velocity.
       */
      const m1: number = ball.mass; // Ball mass (heavy: 200)
      const m2: number = block.mass; // Block mass (light: 4)
      const vy1: number = ball.vy; // Ball's Y velocity (negative = going up)
      const vy2: number = block.vy; // Block's Y velocity

      // Elastic collision formula for Y-axis
      const newVy1: number = ((m1 - m2) * vy1 + 2 * m2 * vy2) / (m1 + m2);
      const newVy2: number = ((m2 - m1) * vy2 + 2 * m1 * vy1) / (m1 + m2);

      // Ball bounces back down (positive vy) with some energy loss
      ball.vy = newVy1 * (restitution / 2);

      // Block gets LAUNCHED upward with amplification for dramatic effect
      const launchAmplification = 1.5;
      block.vy = newVy2 * restitution * launchAmplification;

      // Also give the block some horizontal push based on ball's horizontal velocity
      const horizontalKnock = 0.3;
      block.vx += ball.vx * horizontalKnock;

      this.launch = { x0: ball.x, y0: ball.y, vx0: ball.vx, vy0: ball.vy };
      this.t = 0;
      block.justCollided = true;
      return;
    }

    /* ============================================================
       STEP 4: Handle X-axis collisions with momentum transfer

       For horizontal collisions, we apply elastic collision formulas
       to transfer momentum from the ball to the block. This creates
       the "blasting through" effect where the ball pushes blocks away.

       CRITICAL: We must separate positions BEFORE velocity calculation
       to prevent the ball from getting lodged inside the block.
       ============================================================ */

    // Position correction: push ball out of block
    if (minOverlap === overlapRightOfBall) {
      // Ball hit left side of block - move ball to the left
      ball.x = leftX - ball.radius! - separationBuffer;
    } else if (minOverlap === overlapLeftOfBall) {
      // Ball hit right side of block - move ball to the right
      ball.x = rightX + ball.radius! + separationBuffer;
    }

    /* ============================================================
       STEP 5: Apply 2D Elastic Collision with Amplification

       Conservation of Momentum:  m1*v1 + m2*v2 = m1*v1' + m2*v2'
       Conservation of Energy:    0.5*m1*v1² + 0.5*m2*v2² = 0.5*m1*v1'² + 0.5*m2*v2'²

       Solving these equations simultaneously:
         v1' = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
         v2' = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)

       Since ball mass (200) >> block mass (4), the ball barely slows down
       while blocks get launched with high velocity. This is intentional
       for the "wrecking ball" gameplay feel.

       AMPLIFICATION: We multiply block velocity by an extra factor to make
       blocks fly farther and create more dramatic collisions.
       ============================================================ */
    const m1: number = ball.mass; // Ball mass (heavy: 200)
    const m2: number = block.mass; // Block mass (light: 4)
    const v1: number = ball.vx; // Ball's initial x-velocity
    const v2: number = block.vx; // Block's initial x-velocity (usually 0)

    // Calculate post-collision velocities using elastic collision formula
    const newV1: number = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    const newV2: number = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

    // Apply restitution to ball (slight slowdown)
    ball.vx = newV1 * restitution;

    /**
     * AMPLIFIED BLOCK RESPONSE:
     * Multiply block velocity by 1.5x to make it fly farther.
     * This creates more dramatic, satisfying collisions.
     */
    const amplificationFactor = 1.5;
    block.vx = newV2 * restitution * amplificationFactor;

    /**
     * VERTICAL "POP" EFFECT:
     * When the ball hits a block horizontally, give the block a slight
     * upward velocity. This makes blocks "pop up" when hit, creating
     * a more dynamic 2D collision feel instead of purely horizontal motion.
     *
     * The pop is proportional to the ball's total speed for consistent feel.
     */
    const ballSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    const verticalPopFactor = 0.4; // 40% of ball speed becomes upward velocity
    block.vy = -ballSpeed * verticalPopFactor; // Negative = upward

    // Reset ball's parabolic motion from collision point
    this.launch = { x0: ball.x, y0: ball.y, vx0: ball.vx, vy0: ball.vy };
    this.t = 0;

    block.justCollided = true;
  }

  /**
   * Resolves collision between two blocks using elastic collision physics.
   *
   * Physics Background:
   * ------------------
   * For 1D elastic collisions, we use conservation of momentum and kinetic energy:
   *
   * Conservation of Momentum:  m1*v1 + m2*v2 = m1*v1' + m2*v2'
   * Conservation of Energy:    0.5*m1*v1² + 0.5*m2*v2² = 0.5*m1*v1'² + 0.5*m2*v2'²
   *
   * Solving these simultaneously gives us the final velocities:
   *   v1' = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
   *   v2' = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
   *
   * The restitution coefficient (e) models energy loss:
   *   e = 1.0 → perfectly elastic (billiard balls)
   *   e = 0.0 → perfectly inelastic (blocks stick together)
   *
   * @param block1 - First block entity
   * @param block2 - Second block entity
   * @param restitution - Coefficient of restitution (0 to 1)
   */
  private resolveBlockBlockCollision(
    block1: PhysicsEntity,
    block2: PhysicsEntity,
    restitution: number,
  ) {
    /* ============================================================
       STEP 1: Calculate block boundaries (AABB - Axis-Aligned Bounding Box)
       ============================================================ */
    const halfW1: number = block1.width! / 2;
    const halfH1: number = block1.height! / 2;
    const halfW2: number = block2.width! / 2;
    const halfH2: number = block2.height! / 2;

    // Block 1 edges
    const left1: number = block1.x - halfW1;
    const right1: number = block1.x + halfW1;
    const top1: number = block1.y - halfH1;
    const bottom1: number = block1.y + halfH1;

    // Block 2 edges
    const left2: number = block2.x - halfW2;
    const right2: number = block2.x + halfW2;
    const top2: number = block2.y - halfH2;
    const bottom2: number = block2.y + halfH2;

    /* ============================================================
       STEP 2: Calculate overlap penetration depth
       The axis with smaller overlap indicates the collision normal direction
       (Separating Axis Theorem - SAT)
       ============================================================ */
    const overlapX: number = Math.min(right1, right2) - Math.max(left1, left2);
    const overlapY: number = Math.min(bottom1, bottom2) - Math.max(top1, top2);

    // No collision if no overlap on either axis
    if (overlapX <= 0 || overlapY <= 0) return;

    /* ============================================================
       STEP 3: Handle collision based on collision axis
       Smaller overlap = collision normal direction (minimum translation vector)
       ============================================================ */

    if (overlapX < overlapY) {
      /* ------- HORIZONTAL COLLISION (blocks hitting side-by-side) ------- */

      // Extract masses and velocities for elastic collision formula
      const m1: number = block1.mass;
      const m2: number = block2.mass;
      const v1: number = block1.vx; // Initial x-velocity of block1
      const v2: number = block2.vx; // Initial x-velocity of block2

      /**
       * Elastic Collision Formulas (derived from conservation laws):
       *
       * v1' = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
       * v2' = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
       *
       * Special cases:
       * - Equal masses (m1 = m2): velocities swap completely (v1' = v2, v2' = v1)
       * - m1 >> m2: block1 barely affected, block2 bounces off
       * - m1 << m2: block1 bounces back, block2 barely moves
       */
      const newV1: number = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      const newV2: number = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

      // Apply restitution to model energy loss (e < 1 means some energy lost to heat/sound)
      block1.vx = newV1 * restitution;
      block2.vx = newV2 * restitution;

      // Position correction: push blocks apart to resolve overlap (prevents tunneling)
      const separation = overlapX / 2 + 0.5; // Extra buffer prevents repeated collision
      if (block1.x < block2.x) {
        block1.x -= separation;
        block2.x += separation;
      } else {
        block1.x += separation;
        block2.x -= separation;
      }

      block1.justCollided = true;
      block2.justCollided = true;
      return;
    }

    /* ------- VERTICAL COLLISION (blocks stacking/colliding vertically) ------- */

    // Position correction: separate blocks vertically
    const separation = overlapY / 2 + 0.5;
    if (block1.y < block2.y) {
      // block1 is above block2
      block1.y -= separation;
      block2.y += separation;
    } else {
      // block2 is above block1
      block1.y += separation;
      block2.y -= separation;
    }

    /**
     * FULL 2D ELASTIC COLLISION for vertical block-block impacts
     *
     * Previously we zeroed out vy which killed all vertical momentum. Now we apply
     * elastic collision formulas to BOTH axes so:
     * - When ball hits blocks from below, the upward momentum transfers through the stack
     * - Blocks above the impact point get "launched" upward
     * - Creates satisfying chain reactions through stacked blocks
     *
     * Physics: 1D Elastic Collision formulas applied to both X and Y independently
     *   v1' = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
     *   v2' = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
     */
    const m1: number = block1.mass;
    const m2: number = block2.mass;

    // Velocity threshold to avoid micro-collisions causing jitter
    const velocityThreshold = 0.5;

    /**
     * Y-AXIS ELASTIC COLLISION (vertical momentum transfer)
     * This is the KEY addition for 2D collisions - blocks now bounce/fly vertically
     */
    if (
      Math.abs(block1.vy) > velocityThreshold ||
      Math.abs(block2.vy) > velocityThreshold
    ) {
      const vy1: number = block1.vy;
      const vy2: number = block2.vy;

      const newVy1: number = ((m1 - m2) * vy1 + 2 * m2 * vy2) / (m1 + m2);
      const newVy2: number = ((m2 - m1) * vy2 + 2 * m1 * vy1) / (m1 + m2);

      // Apply with restitution to control bounciness
      // 0.5 reduces bouncing while still allowing some vertical response
      const verticalRestitution = 0.5;
      block1.vy = newVy1 * verticalRestitution;
      block2.vy = newVy2 * verticalRestitution;
    } else {
      // For very slow collisions, just stop vertical motion (resting contact)
      block1.vy = 0;
      block2.vy = 0;
    }

    /**
     * X-AXIS ELASTIC COLLISION (horizontal momentum transfer / Newton's Cradle)
     * This creates the "domino" effect where horizontal momentum transfers through stacks
     */
    if (
      Math.abs(block1.vx) > velocityThreshold ||
      Math.abs(block2.vx) > velocityThreshold
    ) {
      const vx1: number = block1.vx;
      const vx2: number = block2.vx;

      const newVx1: number = ((m1 - m2) * vx1 + 2 * m2 * vx2) / (m1 + m2);
      const newVx2: number = ((m2 - m1) * vx2 + 2 * m1 * vx1) / (m1 + m2);

      // High restitution (0.9) to preserve energy for flying blocks
      const knockRestitution = 0.9;
      block1.vx = newVx1 * knockRestitution;
      block2.vx = newVx2 * knockRestitution;
    }

    block1.justCollided = true;
    block2.justCollided = true;
  }
}
