const input = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,6,19,23,2,23,6,27,1,5,27,31,1,10,31,35,2,6,35,39,1,39,13,43,1,43,9,47,2,47,10,51,1,5,51,55,1,55,10,59,2,59,6,63,2,6,63,67,1,5,67,71,2,9,71,75,1,75,6,79,1,6,79,83,2,83,9,87,2,87,13,91,1,10,91,95,1,95,13,99,2,13,99,103,1,103,10,107,2,107,10,111,1,111,9,115,1,115,2,119,1,9,119,0,99,2,0,14,0];
const modifiedInput = [1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,6,19,23,2,23,6,27,1,5,27,31,1,10,31,35,2,6,35,39,1,39,13,43,1,43,9,47,2,47,10,51,1,5,51,55,1,55,10,59,2,59,6,63,2,6,63,67,1,5,67,71,2,9,71,75,1,75,6,79,1,6,79,83,2,83,9,87,2,87,13,91,1,10,91,95,1,95,13,99,2,13,99,103,1,103,10,107,2,107,10,111,1,111,9,115,1,115,2,119,1,9,119,0,99,2,0,14,0];

const example_input_1 = [1,0,0,3,99];
const expected_output_1 = [1,0,0,2,99];

const example_input_2 = [1,9,10,3,2,3,11,0,99,30,40,50];
const expected_output_2 = [3500,9,10,70,2,3,11,0,99,30,40,50];

const example_input_3 = [1,0,0,0,99]; 
const expected_output_3 = [2,0,0,0,99];

const example_input_4 = [2,3,0,3,99];
const expected_output_4 = [2,3,0,6,99];

const example_input_5 = [2,4,4,5,99,0];
const expected_output_5 = [2,4,4,5,99,9801];

const example_input_6 = [1,1,1,4,99,5,6,0,99];
const expected_output_6 = [30,1,1,4,2,5,6,0,99];

module.exports = {
    input,
    modifiedInput,
    example_input_1,
    expected_output_1,
    example_input_2,
    expected_output_2,
    example_input_3,
    expected_output_3,
    example_input_4,
    expected_output_4,
    example_input_5,
    expected_output_5,
    example_input_6,
    expected_output_6
};