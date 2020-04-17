/*
 * World Controller Class
 *
 *   Manage RigidBodies in a box2D world
 *
 *      suffixes $ are jQuery DOM elements to be controlled
 *      suffixes Model are Box2D model elements to be controlled
 *
 *
 *
 * Copyright 2016-2017, VFS.  All Rights Reserved.
 */

// Some global stuff we need
// Shorthand "imports"
const Physics = {
    Vec2:           Box2D.Common.Math.b2Vec2,

    World:          Box2D.Dynamics.b2World,

    BodyDef:        Box2D.Dynamics.b2BodyDef,
    Body:           Box2D.Dynamics.b2Body,
    FixtureDef:     Box2D.Dynamics.b2FixtureDef,
    Fixture:        Box2D.Dynamics.b2Fixture,

    Listener:       Box2D.Dynamics.b2ContactListener,

    MouseJointDef:  Box2D.Dynamics.Joints.b2MouseJointDef,
    MassData:       Box2D.Collision.Shapes.b2MassData,
    PolygonShape:   Box2D.Collision.Shapes.b2PolygonShape,
    CircleShape:    Box2D.Collision.Shapes.b2CircleShape,
    EdgeShape:      Box2D.Collision.Shapes.b2EdgeShape,
    AABB:           Box2D.Collision.b2AABB,

    DebugDraw:      Box2D.Dynamics.b2DebugDraw,

    DEG_2_RAD:      Math.PI / 180,    // CONSTANT to Multiply by to convert degrees to radians.
    RAD_2_DEG:      180 / Math.PI,    // CONSTANT to Multiply by to convert radians to degrees.
    TWO_PI:         Math.PI * 2,     // 360 degrees in radians.

    WORLD_SCALE:    20.0,  // number of pixels per meter in the physics sim
    GRAVITY:        9.8    // The force of gravity
}

export default Physics;