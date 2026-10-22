import { useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck, Headphones, LockKeyhole, Mail, MessageSquareText, Send } from 'lucide-react';
import { MESSAGES_KEY } from '../utils/inventory.js';

const initial = { name: '', email: '', subject: 'Consulta general', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (sent) setSent(false);
  }

  function submit(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    try {
      const old = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
      const list = Array.isArray(old) ? old : [];
      localStorage.setItem(MESSAGES_KEY, JSON.stringify([...list, { ...form, date: new Date().toISOString() }]));
    } catch {
      // El formulario funciona como demostración incluso si no hay almacenamiento.
    }
    setForm({ ...initial });
    setSent(true);
  }

  return (
    <div className="page-enter info-page">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> ESTAMOS PARA AYUDARTE <span className="eyebrow-separator">/</span> Contacto</div>
      <section className="contact-title"><div><span className="section-kicker">HABLEMOS</span><h1>¿Tienes una <span className="accent-underline">pregunta?</span></h1><p>Cuéntanos qué necesitas saber sobre getiomark. Estamos felices de escuchar tus comentarios y sugerencias.</p></div><div className="contact-title-icon"><MessageSquareText size={58} strokeWidth={1.4} /></div></section>
      <div className="contact-layout">
        <section className="contact-form-card" aria-labelledby="form-heading">
          <div className="contact-form-head"><span className="value-icon"><Mail size={23} /></span><div><h2 id="form-heading">Envíanos un mensaje</h2><p>Completa el formulario a continuación.</p></div></div>
          {sent && <div className="form-success" role="status"><CheckCircle2 size={20} /><div><strong>Mensaje registrado correctamente.</strong><span>Este sitio es una demostración: tu mensaje se guardó de forma local, no se envió por correo.</span></div></div>}
          <form onSubmit={submit} className="contact-form">
            <div className="form-row"><label className="form-field">Tu nombre <input name="name" value={form.name} onChange={update} type="text" placeholder="Escribe tu nombre" maxLength="80" autoComplete="name" required /></label><label className="form-field">Correo electrónico <input name="email" value={form.email} onChange={update} type="email" placeholder="nombre@ejemplo.com" maxLength="120" autoComplete="email" required /></label></div>
            <label className="form-field">Motivo de contacto <select name="subject" value={form.subject} onChange={update}><option>Consulta general</option><option>Soporte de inventario</option><option>Sugerencias</option><option>Otro motivo</option></select></label>
            <label className="form-field">Tu mensaje <textarea name="message" value={form.message} onChange={update} placeholder="Cuéntanos en qué podemos ayudarte..." rows="6" minLength="10" maxLength="1500" required /></label>
            <div className="form-bottom"><span><LockKeyhole size={15} /> Demostración sin envío a servidores</span><button className="button button-primary" type="submit"><Send size={17} /> Registrar mensaje</button></div>
          </form>
        </section>
        <aside className="contact-aside"><div className="contact-help-card"><span className="contact-help-icon"><Headphones size={28} /></span><h2>Estamos aquí para ayudarte.</h2><p>getiomark te permite controlar productos y cantidades desde una sola interfaz.</p><div className="help-separator" /><h3>¿Qué puedes consultar?</h3><ul><li><ClipboardCheck size={17} /> Cómo agregar o editar productos</li><li><ClipboardCheck size={17} /> Cómo revisar alertas de stock</li><li><ClipboardCheck size={17} /> Cómo exportar el inventario</li></ul></div><div className="demo-note"><span><LockKeyhole size={20} /></span><div><strong>Importante</strong><p>Este formulario es parte de un proyecto académico. No realiza envíos reales; los mensajes se almacenan únicamente en el navegador utilizado.</p></div></div></aside>
      </div>
    </div>
  );
}
