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
      y2: nextPoint.y1
    };
    previousPoint = nextPoint;
    return result;
  });
};

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
  const distances = intersections.map(intersection => {
    return distanceToOrigin(intersection);
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

console.assert(run(input.example_input_1.wire_1, input.example_input_1.wire_2) == input.expected_output_1);
console.assert(run(input.example_input_2.wire_1, input.example_input_2.wire_2) == input.expected_output_2);
console.assert(run(input.example_input_3.wire_1, input.example_input_3.wire_2) == input.expected_output_3);
console.log(run(input.wire_1, input.wire_2));