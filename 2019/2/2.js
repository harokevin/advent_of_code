const IntcodePrograms = require('./2_input');

const getNextLineFromProgram = (program, startIndex) => {
  const line = program.slice(startIndex, startIndex+4);
  return {
    startIndex,
    opcode: line[0],
    input1: line[1],
    input2: line[2],
    writeOutIndex: line[3]
  } 
}

const run = (program, startIndex) => {
  var programCopy = [...program];
  var currentProgram = {
    startIndex: startIndex || 0,
    opcode: undefined,
    input1: undefined,
    input2: undefined,
    writeOutIndex: undefined
  };
  currentProgram = getNextLineFromProgram(programCopy, currentProgram.startIndex);
  switch (currentProgram.opcode) {
    case 99:
      return programCopy;
    case 1:
      programCopy[currentProgram.writeOutIndex] = programCopy[currentProgram.input1] + programCopy[currentProgram.input2]
      break;
    case 2:
      programCopy[currentProgram.writeOutIndex] = programCopy[currentProgram.input1] * programCopy[currentProgram.input2]
      break;
    default:
      new Error(`Opcode(${currentProgram.opcode}) is invalid for program (${programCopy})`)
  }
  return run(programCopy, currentProgram.startIndex+4);
}

const eq = (array1, array2) => {
  return array1.length === array2.length &&
    array1.every((e, index) => e === array2[index]);
}

console.log(`example_input_1: ${eq(run(IntcodePrograms.example_input_1), IntcodePrograms.expected_output_1) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_1)}] == [${IntcodePrograms.expected_output_1}]\n`);

console.log(`example_input_2: ${eq(run(IntcodePrograms.example_input_2), IntcodePrograms.expected_output_2) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_2)}] == [${IntcodePrograms.expected_output_2}]\n`);

console.log(`example_input_3: ${eq(run(IntcodePrograms.example_input_3), IntcodePrograms.expected_output_3) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_3)}] == [${IntcodePrograms.expected_output_3}]\n`);

console.log(`example_input_4: ${eq(run(IntcodePrograms.example_input_4), IntcodePrograms.expected_output_4) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_4)}] == [${IntcodePrograms.expected_output_4}]\n`);

console.log(`example_input_5: ${eq(run(IntcodePrograms.example_input_5), IntcodePrograms.expected_output_5) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_5)}] == [${IntcodePrograms.expected_output_5}]\n`);

console.log(`example_input_6: ${eq(run(IntcodePrograms.example_input_6), IntcodePrograms.expected_output_6) ? "Passed" : "Failed"}`);
console.log(`[${run(IntcodePrograms.example_input_6)}] == [${IntcodePrograms.expected_output_6}]\n`);

console.log(`Input: [${run(IntcodePrograms.modifiedInput)}]`);