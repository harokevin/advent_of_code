const IntcodePrograms = require('./5_input');

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

const getNextLineFromProgram = (program, startIndex) => {
  const line = program.slice(startIndex, startIndex+4);

  const opcode = () => {
    if ([99,1,2,3,4].includes(line[0])) {
      return line[0].toString();
    } else if (line[0]>9) {
      const modesAndOpcode = line[0].toString();
      const opcode = modesAndOpcode.substring(modesAndOpcode.length-2);
      return opcode;
    } else {
      new Error(`Unknown opcode ${line[0]} in instruction ${line}`);
    }
  };

  // expect 1 or 2
  const inputModeForInput = (inputIndex) => {
    if (line[0]>9) {
      const modesAndOpcode = line[0].toString();
      const modes = modesAndOpcode.substring(0, modesAndOpcode.length-2);
      try {
        return parseInt(modes.charAt(modes.length-inputIndex));
      } catch (e) {
        new Error(`Input mode for inputIndex ${inputIndex} is not currently supported for line ${line}`);
      }
    } else {
      new Error(`Unknown opcode ${line[0]} in instruction ${line}`);
    }
  }

  const writeOutIndex = () => {
    if ( line[3] == 0 || line[3] ) {
      return line[3];
    } else if ( line[1] == 0 || line[1] ){
      return line [1];
    } else {
      new Error(`Writeout index does not exist for line ${line}`);
    }
  };

  const length = () => {
    switch (opcode()) {
      case 99:
      case "99":
        return 1;
      case 1:
      case "1":
      case "01":
      case 2:
      case "2":
      case "02":
        return 4;
      case 3:
      case "3":
      case "03":
      case 4:
      case "4":
      case "04":
        return 2;
      default:
        new Error(`Opcode(${opcode()}) is invalid`)
    }
  }

  return {
    startIndex,
    opcode: opcode(),
    input1: line[1],
    input2: line[2],
    input1Mode: inputModeForInput(1),
    input2Mode: inputModeForInput(2),
    writeOutIndex: writeOutIndex(),
    length: length()
  } 
}

const run = (program) => {
  var programCopy = [...program];

  const throwModeError = () => {
    new Error(`Mode ${currentProgram.writeOutIndex} is not supported in instuction ${JSON.stringify(currentProgram)}`);
  }

  const getInputGivenMode = (input, mode, program) => {
    if ( !mode || mode == POSITION_MODE ) {
      return program[input];
    } else if ( mode == IMMEDIATE_MODE ) {
      return input;
    } else {
      throwModeError();
    }
  }
  let startIndex = 0;
  do {
    var currentProgram = {
      startIndex,
      opcode: undefined,
      input1: undefined,
      input2: undefined,
      input1Mode: undefined,
      input2Mode: undefined,
      writeOutIndex: undefined
    };
    currentProgram = getNextLineFromProgram(programCopy, currentProgram.startIndex);
    switch (currentProgram.opcode) {
      case "99":
        return programCopy;
      case "1":
      case "01":
        programCopy[currentProgram.writeOutIndex] = 
          getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy) +
          getInputGivenMode(currentProgram.input2, currentProgram.input2Mode, programCopy)
        break;
      case "2":
      case "02":
        programCopy[currentProgram.writeOutIndex] = 
          getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy) *
          getInputGivenMode(currentProgram.input2, currentProgram.input2Mode, programCopy)
        break;
      case "3":
      case "03":
        programCopy[currentProgram.input1] = 1;//getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy);
        break;
      case "4":
      case "04":
        const output = getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy);
        console.log(`${JSON.stringify({
          opcode: currentProgram.opcode, 
          mode: currentProgram.input1Mode, 
          output
        })}`);
        break;
      default:
        new Error(`Opcode(${currentProgram.opcode}) is invalid for program (${programCopy})`)
    }
    startIndex = currentProgram.startIndex+currentProgram.length;
  } while (true)
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

console.log(`Input: [${run(IntcodePrograms.input)}]`);