import { ArrowRight, Boxes, ChartNoAxesCombined, CircleCheck, HeartHandshake, Leaf, ShieldCheck, ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  { icon: Boxes, title: 'Orden para crecer', text: 'Un catálogo claro hace más fácil controlar cada producto, desde su ingreso hasta su reposición.' },
  { icon: ShieldCheck, title: 'Información confiable', text: 'Un registro centralizado ayuda a disminuir errores y facilita decisiones de inventario.' },
  { icon: HeartHandshake, title: 'Simplicidad primero', text: 'Una herramienta pensada para realizar las tareas del día a día sin complicaciones.' },
];

export default function About() {
  return (
    <div className="page-enter info-page">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> CONOCE GETIOMARK <span className="eyebrow-separator">/</span> Quiénes somos</div>
      <section className="info-hero about-hero">
        <div className="info-hero-copy"><span className="white-eyebrow"><span className="kicker-point" /> NUESTRA IDENTIDAD</span><h1>El inventario simple.<br /><em>Las ideas grandes.</em></h1><p>Creemos que administrar un supermercado no tiene por qué ser complicado. Por eso nace getiomark: una forma clara y organizada de controlar productos y existencias.</p></div>
        <div className="about-illustration" aria-hidden="true"><div className="illustration-card card-behind" /><div className="illustration-card card-front"><span><ShoppingBasket size={24} /> getiomark.</span><i /><i /><i /></div><div className="floating-check"><CircleCheck size={25} /></div></div>
      </section>
      <section className="story-section"><div><span className="section-kicker">EL PROPÓSITO</span><h2>Una mejor manera de <span className="accent-underline">organizar</span> tu negocio.</h2></div><div><p>getiomark es un proyecto demostrativo de gestión de inventario para supermercados, desarrollado con React. Su objetivo es facilitar el registro de productos, el control de cantidades y la identificación de mercadería que necesita reposición.</p><p>Un sistema de inventario útil empieza por lo esencial: información ordenada, navegación sencilla y acciones fáciles de realizar.</p></div></section>
      <section className="value-section"><div className="section-heading"><div><span className="section-kicker">LO QUE NOS DEFINE</span><h2>Nuestros principios</h2></div></div><div className="value-grid">{values.map(({ icon: Icon, title, text }) => <article key={title} className="value-card"><span className="value-icon"><Icon size={25} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="about-cta"><div className="cta-medallion"><ChartNoAxesCombined size={29} /></div><div><h2>Tu inventario, más organizado desde hoy.</h2><p>Explora las herramientas disponibles en el panel principal.</p></div><Link className="button button-lime" to="/">Ir al inventario <ArrowRight size={17} /></Link></section>
    </div>
  );
}
