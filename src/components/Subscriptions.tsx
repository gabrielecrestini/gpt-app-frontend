// src/components/Subscriptions.tsx

import React from 'react';

// Interfaccia per definire la struttura di un piano
interface Plan {
  name: string;
  price: string;
  priceId?: string;
  features: string[];
  isCurrent?: boolean;
  highlight?: boolean;
}

// === ULTERIORI MIGLIORAMENTI A DESCRIZIONI E STILE ===
const plans: Plan[] = [
  {
    name: 'Creator',
    price: 'Gratuito',
    features: [
      '🤖 **Inizia il tuo viaggio** con l\'aiuto dell\'AI Manager.',
      '🏆 **Mettiti alla prova** con contest settimanali (montepremi fino a 10€).',
      '💡 **Le prime basi** per capire le dinamiche della viralità e del business.',
      '🎨 **Scatena la creatività** con le funzioni base di AI Studio.',
    ],
    isCurrent: true,
  },
  {
    name: 'Manager',
    price: '15€ / mese',
    priceId: process.env.REACT_APP_STRIPE_PRICE_ID_MANAGER!,
    features: [
      '✅ **Tutte le basi del piano Creator**, potenziate.',
      '🧠 **Strategie da Pro:** Piani d\'azione per **Dropshipping, Trading, Social Media, e-Commerce** e altro.',
      '✨ **Dai vita alla creatività:** Genera **foto, video e copertine** uniche con l\'AI Studio Pro.',
      '🚀 **Accelera i guadagni** con i Booster mensili per le tue offerte.',
      '🏆 **Alza la posta in gioco** con l\'accesso a contest con montepremi fino a 30€.',
    ],
    highlight: true,
  },
  {
    name: 'Assistant',
    price: '35€ / mese',
    priceId: process.env.REACT_APP_STRIPE_PRICE_ID_ASSISTANT!,
    features: [
      '✅ **L\'arsenale completo del piano Manager**, e molto di più.',
      '🤝 **Il tuo Co-Pilota per il Successo:** Un\'AI personale dedicata che costruisce la strategia *con te*, 24/7.',
      '📈 **Guida Iper-Personalizzata:** L\'AI adatta le strategie in tempo reale per massimizzare i tuoi risultati.',
      '⚡ **Dominio Totale:** Sfrutta i Booster più potenti per lasciare la concorrenza alle spalle.',
      '🏆 **Entra nell\'élite:** Accedi ai contest esclusivi con i montepremi più alti (fino a 60€).',
    ],
  },
];

const Subscriptions: React.FC = () => {

  const handleCheckout = async (priceId: string) => {
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceId }),
      });

      if (!response.ok) throw new Error('Errore nella creazione della sessione di checkout');
      
      const session = await response.json();
      if (session.url) window.location.href = session.url;

    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Impossibile avviare il pagamento. Riprova più tardi.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Il Tuo Sogno è a un Passo.</h1>
      <p style={styles.subtitle}>Sblocca il tuo vero potenziale e trasforma le tue idee in successo. Inizia la scalata.</p>
      
      <div style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <div key={index} style={{...styles.planCard, ...(plan.highlight ? styles.highlightedCard : {})}}>
             {plan.highlight && <div style={styles.badge}>CONSIGLIATO</div>}
            <h2 style={styles.planName}>{plan.name}</h2>
            <p style={styles.planPrice}>{plan.price}</p>
            <ul style={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <li key={i} style={styles.featureItem} dangerouslySetInnerHTML={{ __html: feature }}></li>
              ))}
            </ul>
            <div style={styles.buttonContainer}>
              {plan.isCurrent ? (
                <button style={{...styles.button, ...styles.currentPlanButton}} disabled>Piano Attuale</button>
              ) : (
                <button 
                  style={{...styles.button, ...(plan.highlight ? styles.highlightedButton : {})}}
                  onClick={() => handleCheckout(plan.priceId!)}
                  disabled={!plan.priceId}
                >
                  Inizia Ora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === STILE AGGIORNATO PER MAGGIORE IMPATTO VISIVO ===
const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(to bottom, #ffffff, #f0f2f5)' },
    title: { fontSize: '3rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '15px' },
    subtitle: { fontSize: '1.4rem', color: '#555', maxWidth: '650px', margin: 'auto', marginBottom: '60px' },
    plansContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' },
    planCard: { backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '15px', padding: '40px 30px', width: '350px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', position: 'relative' },
    highlightedCard: { border: '2px solid #7c3aed', transform: 'scale(1.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    badge: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#7c3aed', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' },
    planName: { fontSize: '2rem', color: '#1a1a1a', margin: '0 0 15px 0' },
    planPrice: { fontSize: '1.8rem', color: '#7c3aed', fontWeight: 'bold', margin: '0 0 30px 0' },
    featuresList: { listStyle: 'none', padding: 0, textAlign: 'left', flexGrow: 1, borderTop: '1px solid #eee', paddingTop: '25px' },
    featureItem: { marginBottom: '18px', fontSize: '1rem', color: '#333', display: 'flex', alignItems: 'center', lineHeight: '1.5' },
    buttonContainer: { marginTop: 'auto', paddingTop: '25px' },
    button: { width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
    currentPlanButton: { backgroundColor: '#bdbdbd', cursor: 'not-allowed' },
    highlightedButton: { background: 'linear-gradient(45deg, #7c3aed, #a855f7)', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' },
};

export default Subscriptions;