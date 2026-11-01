const round2 = (n) => Math.round(n * 100) / 100
export function compareScenarios(baseline, current, variables) {
  const changedVariables = variables
    .filter((v) => baseline.values[v.id] !== current.values[v.id])
    .map((v) => ({
      id: v.id,
      label: v.label,
      unit: v.unit,
      from: baseline.values[v.id],
      to: current.values[v.id],
    }))

  const metricChanges = current.result.metrics.map((m) => {
    const before = baseline.result.metrics.find((b) => b.id === m.id)
    return {
      id: m.id,
      label: m.label,
      unit: m.unit,
      from: before.value,
      to: m.value,
      delta: round2(m.value - before.value),
    }
  })

  return { changedVariables, metricChanges }
}