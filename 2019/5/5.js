const IntcodePrograms = require('./5_input');

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

const getNextLineFromProgram = (program, startIndex) => {
  const line = program.slice(startIndex, startIndex+4);

  const opcode = () => {
    if ([99,1,2,3,4,5,6,7,8].includes(line[0])) {
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
    const op = opcode();
    switch (op) {
      case 99:
      case "99":
        return 1;
      case 1:
      case "1":
      case "01":
      case 2:
      case "2":
      case "02":
      case 7:
      case "7":
      case "07":
      case 8:
      case "8":
      case "08":
        return 4;
      case 3:
      case "3":
      case "03":
      case 4:
      case "4":
      case "04":
        return 2;
      case 5:
      case "5":
      case "05":
      case 6:
      case "6":
      case "06":
        return 3;
      default:
        new Error(`Opcode(${op}) is invalid`)
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
    length: length(),
    line
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
    let startIndexAlreadySet = false;
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
    const input1 = getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy);
    const input2 = getInputGivenMode(currentProgram.input2, currentProgram.input2Mode, programCopy);
    switch (currentProgram.opcode) {
      case "99":
        return programCopy;
      case "1":
      case "01":
        programCopy[currentProgram.writeOutIndex] = input1 + input2;
        break;
      case "2":
      case "02":
        programCopy[currentProgram.writeOutIndex] = input1 * input2;
        break;
      case "3":
      case "03":
        programCopy[currentProgram.input1] = 5; //getInputGivenMode(currentProgram.input1, currentProgram.input1Mode, programCopy);
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
      case "5":
      case "05":
        if ( input1 != 0 ) {
          startIndex = input2;
          startIndexAlreadySet = true;
        }
        break;
      case "6":
      case "06":
        if ( input1 == 0 ) {
          startIndex = input2;
          startIndexAlreadySet = true;
        }
        break;
      case "7":
      case "07":
        if ( input1 < input2 ) {
          programCopy[currentProgram.writeOutIndex] = 1;
        } else {
          programCopy[currentProgram.writeOutIndex] = 0;
        }
        break;
      case "8":
      case "08":
        if ( input1 == input2 ) {
          programCopy[currentProgram.writeOutIndex] = 1;
        } else {
          programCopy[currentProgram.writeOutIndex] = 0;
        }
        break;
      default:
        new Error(`Opcode(${currentProgram.opcode}) is invalid for program (${programCopy})`)
    }
    if ( !startIndexAlreadySet ) {
      startIndex = currentProgram.startIndex+currentProgram.length;
    }
  } while (true)
}

const eq = (array1, array2) => {
  return array1.length === array2.length &&
    array1.every((e, index) => e === array2[index]);
}

// console.log(`example_input_1: ${eq(run(IntcodePrograms.example_input_1), IntcodePrograms.expected_output_1) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_1)}] == [${IntcodePrograms.expected_output_1}]\n`);

// console.log(`example_input_2: ${eq(run(IntcodePrograms.example_input_2), IntcodePrograms.expected_output_2) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_2)}] == [${IntcodePrograms.expected_output_2}]\n`);

// console.log(`example_input_3: ${eq(run(IntcodePrograms.example_input_3), IntcodePrograms.expected_output_3) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_3)}] == [${IntcodePrograms.expected_output_3}]\n`);

// console.log(`example_input_4: ${eq(run(IntcodePrograms.example_input_4), IntcodePrograms.expected_output_4) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_4)}] == [${IntcodePrograms.expected_output_4}]\n`);

// console.log(`example_input_5: ${eq(run(IntcodePrograms.example_input_5), IntcodePrograms.expected_output_5) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_5)}] == [${IntcodePrograms.expected_output_5}]\n`);

// console.log(`example_input_6: ${eq(run(IntcodePrograms.example_input_6), IntcodePrograms.expected_output_6) ? "Passed" : "Failed"}`);
// console.log(`[${run(IntcodePrograms.example_input_6)}] == [${IntcodePrograms.expected_output_6}]\n`);

console.log(`Input: [${run(IntcodePrograms.input)}]`);