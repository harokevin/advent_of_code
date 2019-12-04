const input = require('./3_input');

const parsePathMovementLength = (pathMovement) => {
  return parseInt(pathMovement.substring(1,pathMovement.length));
}

const parsePathMovement = (pathMovement) => {
  const direction = pathMovement.charAt(0);
  const movement = parsePathMovementLength(pathMovement)
  return { direction, movement };
}

const generateNextPoint = (previousPoint, move) => {
  switch (move.direction) {
  case "R":
    return { x1: previousPoint.x1 + move.movement, y1: previousPoint.y1 };
  case "L":
    return { x1: previousPoint.x1 - move.movement, y1: previousPoint.y1 };
  case "U":
    return { x1: previousPoint.x1, y1: previousPoint.y1 + move.movement };
  case "D":
    return { x1: previousPoint.x1, y1: previousPoint.y1 - move.movement };
  default:
    new Error(`Unknown path movement direction for pathMovment "${JSON.stringify(move)}"`)
  }
}

const generateSegments = (path) => {
  const origin = {x1: 0, y1: 0};
  let previousPoint = origin;
  return segments = path.map(movement => {
    const move = parsePathMovement(movement);
    const nextPoint = generateNextPoint(previousPoint, move);
    const result = {
      x1: previousPoint.x1,
      y1: previousPoint.y1,
      x2: nextPoint.x1,
      y2: nextPoint.y1,
      move
    };
    previousPoint = nextPoint;
    return result;
  });
};

const isPointOnSegment = (point, segment) => {
  const crossproduct = (point.y - segment.y1) * (segment.x2 - segment.x1) - (point.x - segment.x1) * (segment.y2 - segment.y1)

  if (Math.abs(crossproduct) != 0)
      return false;

  const dotproduct = (point.x - segment.x1) * (segment.x2 - segment.x1) + (point.y - segment.y1)*(segment.y2 - segment.y1)
  if (dotproduct < 0)
      return false;

  const squaredlengthba = (segment.x2 - segment.x1)*(segment.x2 - segment.x1) + (segment.y2 - segment.y1)*(segment.y2 - segment.y1)
  if (dotproduct > squaredlengthba)
      return false;

  return true
}

const segmentsIntersect = (segment1, segment2) => {
  const x1 = segment1.x1;
  const y1 = segment1.y1;

  const x2 = segment1.x2;
  const y2 = segment1.y2;

  const x3 = segment2.x1;
  const y3 = segment2.y1;

  const x4 = segment2.x2;
  const y4 = segment2.y2;

  const ta_numerator = (y3-y4)*(x1-x3)+(x4-x3)*(y1-y3);
  const ta_denominator = (x4-x3)*(y1-y2)-(x1-x2)*(y4-y3);
  const ta = ta_denominator != 0 ? ta_numerator/ta_denominator : new Error("cannot divide by 0 to get ta");

  const tb_numerator = (y1-y2)*(x1-x3)+(x2-x1)*(y1-y3);
  const tb_denominator = (x4-x3)*(y1-y2)-(x1-x2)*(y4-y3);
  const tb = tb_denominator != 0 ? tb_numerator/tb_denominator : new Error("cannot divide by 0 to get tb");

  const answer = 0 <= ta && ta <= 1 && 0 <= tb && tb <= 1;

  return {answer, ta};
};

const intersectionPoint = (segment1, ta) => {
  const x1 = segment1.x1;
  const y1 = segment1.y1;

  const x2 = segment1.x2;
  const y2 = segment1.y2;

  const x = x1 + ta*(x2-x1);
  const y = y1 + ta*(y2-y1);

  if (Number.isInteger(x) && Number.isInteger(y)) {
    return {x, y};
  } else {
    return undefined;
  }
};

const distanceToOrigin = (point) => {
  const origin = {x1: 0, y1: 0};

  const x1 = point.x;
  const y1 = point.y;

  return Math.abs(origin.x1 - x1) + Math.abs(origin.y1 - y1);
}

const distanceBetweenPoints = (point1, point2) => {
  return Math.abs(point1.x1 - point2.x) + Math.abs(point1.y1 - point2.y);
}

const walkTo = (intersection, wire) => {

  //get segments for each line
  const wireSegemnts = generateSegments(wire);
  let steps = 0;
  const origin = {x1: 0, y1: 0};
  let currentPosition = origin;
  for (const segment in wireSegemnts) {
    if (!isPointOnSegment(intersection, wireSegemnts[segment])){
      steps += wireSegemnts[segment].move.movement;
      currentPosition = {x1: wireSegemnts[segment].x2, y1: wireSegemnts[segment].y2};
    } else {
      steps += distanceBetweenPoints({x1: wireSegemnts[segment].x1, y1: wireSegemnts[segment].y1}, intersection);
      return steps;
    }
  };
  return steps;
}

const run = (wire1, wire2) => {

  //get segments for each line
  const wire1Segemnts = generateSegments(wire1);
  const wire2Segments = generateSegments(wire2);

  //check if any segment intersects with any other segment. If so, report the intersection
  let intersections = [];
  wire1Segemnts.forEach(w1Segment => {
    wire2Segments.forEach(w2Segment => {
      const segmentsIntersectDetails = segmentsIntersect(w1Segment,w2Segment);
      if (segmentsIntersectDetails.answer == true) {
        const intersect = intersectionPoint(
          w1Segment,
          segmentsIntersectDetails.ta
        );
        const origin = {x1: 0, y1: 0};
        if (
          intersect &&
          intersect.x != origin.x1 &&
          intersect.y != origin.y1
        ) {
          intersections.push(intersect);
        }
      }
    })
  });

  //calulate the distance between the starting point and the intersection for all intersections
  // const distances = intersections.map(intersection => {
  //   return distanceToOrigin(intersection);
  // });

  //calulate the number of steps to each intersection, for each wire
  const walks = intersections.map(intersection => {
    const wire1Walk = walkTo(intersection, wire1);
    const wire2Walk = walkTo(intersection, wire2);
    return {
      intersection,
      wire1Walk,
      wire2Walk,
      sum: wire1Walk + wire2Walk
    };
  });

  const distances = walks.map(walk => {
    return walk.sum;
  });

  //return the smallest distance
  return Math.min(...distances);
}

const OriginToR8 = generateNextPoint({x1: 0, y1: 0}, {direction: "R", movement: 8});
console.assert(OriginToR8.x1 === 8);
console.assert(OriginToR8.y1 === 0);


const generateWire1Segment = generateSegments(input.example_input_1.wire_1);
// console.log(JSON.stringify(generateWire1Segment, null, 2));
console.assert(
  generateWire1Segment.length === 4
  // [{x1: 0, y1: 0, x2: 8, y2: 0},
  // {x1: 8, y1: 0, x2: 8, y2: 5},
  // {x1: 8, y1: 5, x2: 3, y2: 5},
  // {x1: 3, y1: 5, x2: 3, y2: 2}]
);

const generateWire2Segment = generateSegments(input.example_input_1.wire_2);
// console.log(JSON.stringify(generateWire2Segment, null, 2));
console.assert(
  generateWire2Segment.length === 4
  // [{"x1": 0,"y1": 0,"x2": 0,"y2": 7},
  // {"x1": 0,"y1": 7,"x2": 6,"y2": 7},
  // {"x1": 6,"y1": 7,"x2": 6,"y2": 3},
  // {"x1": 6,"y1": 3,"x2": 2,"y2": 3}]
);

console.assert(
  segmentsIntersect(
    {x1: 3, y1: 5, x2: 3, y2: 2},
    {x1: 6, y1: 3, x2: 2, y2: 3}
  ).answer === true
);

console.assert(
  isPointOnSegment(
    {x: 1, y: 0},
    {x1: 0, y1: 0, x2: 8, y2: 0}
  ) === true
);

const result  = segmentsIntersect(
  {x1: 3, y1: 5, x2: 3, y2: 2},
  {x1: 6, y1: 3, x2: 2, y2: 3}
);
console.assert(
  intersectionPoint(
    {x1: 3, y1: 5, x2: 3, y2: 2},
    result.ta
  )
);

// console.assert(run(input.example_input_1.wire_1, input.example_input_1.wire_2) == input.expected_output_1);
// console.assert(run(input.example_input_2.wire_1, input.example_input_2.wire_2) == input.expected_output_2);
// console.assert(run(input.example_input_3.wire_1, input.example_input_3.wire_2) == input.expected_output_3);
// console.log(run(input.wire_1, input.wire_2));

console.assert(run(input.example_input_1.wire_1, input.example_input_1.wire_2) == 30);
console.assert(walkTo({x: 3, y: 3}, input.example_input_1.wire_1) == 20);
console.assert(walkTo({x: 3, y: 3}, input.example_input_1.wire_2) == 20);
console.assert(walkTo({x: 6, y: 5}, input.example_input_1.wire_1) == 15);
console.assert(walkTo({x: 6, y: 5}, input.example_input_1.wire_2) == 15);

console.assert(run(input.example_input_2.wire_1, input.example_input_2.wire_2) == 610);
console.assert(run(input.example_input_3.wire_1, input.example_input_3.wire_2) == 410);
console.log(run(input.wire_1, input.wire_2));
