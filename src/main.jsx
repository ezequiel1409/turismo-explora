import { useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './styles.css'

const services = [
  'Aéreos Buenos Aires - Punta Cana con carry on',
  '7 noches de alojamiento con desayuno en Coconut inn',
  'Traslados aeropuerto - hotel - aeropuerto',
  'Auto toda la estadía para recorrer la isla',
  'Ed Card',
]

function App() {
  const [quote, setQuote] = useState({ destination: 'ARUBA', nights: '7', dates: '21/11 al 28/11', price: '1390' })
  const [selected, setSelected] = useState(services)
  const [flightImage, setFlightImage] = useState(null)
  const [fileName, setFileName] = useState('Todavía no se adjuntó una imagen.')
  const [exporting, setExporting] = useState(false)
  const sheetRef = useRef(null)

  const update = (key) => (event) => setQuote((current) => ({ ...current, [key]: event.target.value }))
  const output = useMemo(() => ({
    destination: quote.destination.trim().toUpperCase() || 'DESTINO',
    nights: quote.nights || '0',
    dates: quote.dates.trim().toUpperCase() || 'FECHAS A DEFINIR',
    price: quote.price.trim().replace(/^USD\s*/i, '') || '0',
  }), [quote])

  function toggleService(service) {
    setSelected((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service])
  }

  function chooseFlight(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setFlightImage(reader.result)
    reader.readAsDataURL(file)
  }

  async function exportPdf() {
    if (!sheetRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(sheetRef.current, { scale: 2, backgroundColor: '#fffaf3', useCORS: true })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297)
      pdf.save(`Cotizacion-${output.destination}.pdf`)
    } catch (error) {
      console.error(error)
      window.alert('No se pudo crear el PDF. Intentá nuevamente.')
    } finally {
      setExporting(false)
    }
  }

  return <>
    <header className="topbar">
      <div className="brand"><img src="./assets/reference-image.png" alt="Turismo Explora" /><span>Cotizador</span></div>
      <button onClick={exportPdf} className="btn-primary" disabled={exporting}>{exporting ? 'Generando PDF...' : 'Descargar PDF'}</button>
    </header>
    <main className="workspace">
      <aside className="form-panel">
        <div className="form-heading"><p className="eyebrow">Nueva cotización</p><h1>Armá tu propuesta</h1><p>Completá los datos y descargá una cotización lista para enviar.</p></div>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Destino<input value={quote.destination} onChange={update('destination')} maxLength="45" /></label>
          <div className="fields-2"><label>Noches<input type="number" min="1" value={quote.nights} onChange={update('nights')} /></label><label>Fechas<input value={quote.dates} onChange={update('dates')} maxLength="40" /></label></div>
          <label className="upload-label">Imagen con detalle de vuelos<span className="file-picker"><input type="file" accept="image/*" onChange={chooseFlight} />Elegir imagen</span></label>
          <p className="hint">{fileName}</p>
          <fieldset><legend>Incluye</legend>{services.map((service) => <label className="check" key={service}><input type="checkbox" checked={selected.includes(service)} onChange={() => toggleService(service)} /><span>{service}</span></label>)}</fieldset>
          <label>Precio total por persona (base doble)<span className="price-field"><span>USD</span><input value={quote.price} onChange={update('price')} inputMode="numeric" maxLength="12" /></span></label>
        </form>
      </aside>
      <section className="preview-area"><div className="preview-label"><span>Vista previa</span><small>Formato A4</small></div>
        <article ref={sheetRef} className="pdf-sheet">
          <div className="sheet-header"><p>COTIZACIÓN</p><img src="./assets/reference-image.png" alt="Turismo Explora" /></div>
          <div className="trip-title"><h2>{output.destination}</h2><span>{output.nights} NOCHES</span><i></i><span>{output.dates}</span></div>
          <section className="flight-section"><h3>Detalle vuelos</h3>{flightImage ? <img src={flightImage} className="flight-preview" alt="Detalle de vuelos adjunto" /> : <div className="flight-placeholder"><span>✈</span><strong>Detalle de vuelos</strong><small>Adjuntá una imagen desde el formulario</small></div>}</section>
          <section className="included-section"><h3>INCLUYE</h3><ul>{selected.length ? selected.map((service) => <li key={service}>{service}</li>) : <li>Consultá los servicios incluidos</li>}</ul></section>
          <section className="price-section"><p>Total por persona en base doble: <strong>USD {output.price}</strong></p></section>
          <section className="payment-section"><h3>FORMAS DE PAGO</h3><p>Anticipo USD 600 por persona para emitir aéreos y congelar el precio. Saldo en cuotas no necesariamente fijas, debe estar abonado el total 15 días antes del viaje.</p><p className="disclaimer">TARIFAS SUJETAS A DISPONIBILIDAD O MODIFICACIÓN AL MOMENTO DE LA RESERVA.</p></section>
          <footer><span>@turismoexplora_</span><span>+54 9 261 777 0250</span></footer>
        </article>
      </section>
    </main>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
