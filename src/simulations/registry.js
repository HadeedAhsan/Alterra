import { cityVariables, cityDefaults, simulateCity } from './city/model'
import { timeVariables, timeDefaults, simulateTime } from './time/model'
import { natureVariables, natureDefaults, simulateNature } from './nature/model'

export const simulations = {
  city: {
    variables: cityVariables,
    defaults: cityDefaults,
    simulate: simulateCity,
  },
  time: {
    variables: timeVariables,
    defaults: timeDefaults,
    simulate: simulateTime,
  },
  nature: {
    variables: natureVariables,
    defaults: natureDefaults,
    simulate: simulateNature,
  },
}