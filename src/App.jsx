import { useEffect, useState } from 'react'

const CENTIMETERS = 20
const PIXELS_PER_CM = 40

function App() {
  const [measurement, setMeasurement] = useState(() => {
    const savedMeasurement = window.localStorage.getItem('ruler-measurement')
    if (savedMeasurement === null) return null

    const value = Number(savedMeasurement)
    return Number.isFinite(value) && value >= 0 && value <= CENTIMETERS ? value : null
  })

  useEffect(() => {
    if (measurement === null) {
      window.localStorage.removeItem('ruler-measurement')
    } else {
      window.localStorage.setItem('ruler-measurement', String(measurement))
    }
  }, [measurement])

  function measure(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const position = Math.max(0, Math.min(CENTIMETERS, (event.clientX - bounds.left) / PIXELS_PER_CM))
    setMeasurement(Math.round(position * 10) / 10)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      setMeasurement((value) => Math.min(CENTIMETERS, (value ?? 0) + 0.1))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      setMeasurement((value) => Math.max(0, (value ?? 0) - 0.1))
    }
  }

  function clearMeasurement() {
    setMeasurement(null)
  }

  return (
    <main className="page-shell">
      <section className="ruler-card" aria-labelledby="page-title">
        <div className="ruler-icon" aria-hidden="true">📏</div>
        <p className="eyebrow">Paprastas įrankis</p>
        <h1 id="page-title">Mano liniuotė</h1>
        <p className="intro">Paspausk ant liniuotės ir sužinok pasirinktos vietos ilgį.</p>

        <div className="measure-result" aria-live="polite">
          <span>Pasirinktas ilgis</span>
          <strong>{measurement === null ? '—' : `${measurement.toFixed(1).replace('.', ',')} cm`}</strong>
        </div>

        <div className="millimeter-result" aria-live="polite">
          <span>Ilgis milimetrais</span>
          <strong>{measurement === null ? '— mm' : `${Math.round(measurement * 10)} mm`}</strong>
          <p>{measurement === null ? 'Pasirink vietą liniuotėje – čia matysi milimetrus.' : '1 centimetras = 10 milimetrų'}</p>
        </div>

        <div className="ruler-scroll" aria-label="Liniuotė nuo 0 iki 20 centimetrų">
          <div className="ruler" onClick={measure} onKeyDown={handleKeyDown} role="slider" tabIndex={0} aria-label="Pasirinkti ilgį centimetrais" aria-valuetext={`${measurement ?? 0} centimetro`} aria-valuemin="0" aria-valuemax="20" aria-valuenow={measurement ?? 0}>
            {Array.from({ length: CENTIMETERS * 10 + 1 }, (_, index) => {
              const isCentimeter = index % 10 === 0
              const isHalfCentimeter = index % 5 === 0
              return (
                <span className="tick-wrap" key={index} style={{ left: `${index * 4}px` }}>
                  <span className={`tick ${isCentimeter ? 'tick-centimeter' : isHalfCentimeter ? 'tick-half' : ''}`} />
                  {isCentimeter && <span className="tick-label">{index / 10}</span>}
                </span>
              )
            })}
            {measurement !== null && <span className="marker" style={{ left: `${measurement * PIXELS_PER_CM}px` }} />}
          </div>
        </div>

        <p className="hint">Kiekvienas mažas brūkšnelis žymi 1 mm.</p>
        <button className="clear-measurement" type="button" onClick={clearMeasurement} disabled={measurement === null}>
          Išvalyti matavimą
        </button>
      </section>
      <div className="hamster-runner" aria-hidden="true">
        <span className="hamster">
          <span className="hamster-ear hamster-ear-left" />
          <span className="hamster-ear hamster-ear-right" />
          <span className="hamster-body">
            <span className="hamster-face" />
            <span className="hamster-eye hamster-eye-left" />
            <span className="hamster-eye hamster-eye-right" />
            <span className="hamster-cheek hamster-cheek-left" />
            <span className="hamster-cheek hamster-cheek-right" />
            <span className="hamster-nose" />
          </span>
          <span className="hamster-paw hamster-paw-left" />
          <span className="hamster-paw hamster-paw-right" />
        </span>
      </div>
    </main>
  )
}

export default App
