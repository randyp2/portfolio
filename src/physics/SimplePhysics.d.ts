export interface PhysicsEntity {
    id: string;
    type: "ball" | "block";
    x: number;
    y: number;
    vx: number;
    vy: number;
    width?: number;
    height?: number;
    radius?: number;
    mass: number;
    label?: string;
    justCollided?: boolean;
}
export interface ColliderRect {
    leftX: number;
    rightX: number;
    topY: number;
    bottomY: number;
}
export declare class SimplePhysics {
    body: PhysicsEntity;
    blocks: PhysicsEntity[];
    worldWidth: number;
    worldHeight: number;
    viewportCenterX: number;
    colliders: ColliderRect[];
    onCollision?: () => void;
    onLaunch?: () => void;
    private hasLaunched;
    private t;
    private launch;
    constructor(x: number, y: number, radius: number, worldWidth: number, worldHeight: number, viewportCenterX: number, colliders?: ColliderRect[]);
    setColliders(colliders: ColliderRect[]): void;
    setVelocity(vx: number, vy: number): void;
    setPosition(x: number, y: number): void;
    addBlock(id: string, x: number, y: number, width: number, height: number, mass: number, label: string): void;
    update(dt: number): void;
    updateBall(dt: number): void;
    updateBlocks(dt: number): void;
    private ballBlockCollision;
    private blockCollision;
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
    private resolveBallBlockCollision;
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
    private resolveBlockBlockCollision;
}
