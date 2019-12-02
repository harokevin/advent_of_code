const moduleMasses = require("./1_input").input;

// Calculates the amount of fuel required to launch a module given its mass.
const fuelRequiredToLaunchModule = (mass) => {
  return Math.floor(mass / 3) - 2;
};

// Calculates the amount of fuel required to launch fuel.
// Adds fuel to account for weight of fuel.
const fuelRequiredToLaunchModuleAccountingForFuel = (mass) => {
  const fuelRequired = fuelRequiredToLaunchModule(mass);
  if (fuelRequired <= 0) {
    return 0;
  } else {
    return fuelRequired + fuelRequiredToLaunchModuleAccountingForFuel(fuelRequired);
  }
};


const fuelRequiredToLaunchModules = moduleMasses.map(mass => {
  return fuelRequiredToLaunchModuleAccountingForFuel(mass);
});

const totalFuelRequiredToLaunchModules = fuelRequiredToLaunchModules.reduce((accumulator, currentValue) => accumulator + currentValue);

console.log(`Total Fuel Required: ${totalFuelRequiredToLaunchModules}`);