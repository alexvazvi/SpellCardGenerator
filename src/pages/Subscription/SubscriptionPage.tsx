import React from 'react';
import PageContainer from '../../components/PageContainer';
import './SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
    // TODO: Connect this to a real subscription service (e.g., Stripe)
    const plans = [
        {
            name: 'Gratuito',
            price: '0€',
            period: '/mes',
            features: [
                'Creación de hasta 20 cartas',
                'Acceso a marcos básicos',
                'Guardado de 1 baraja',
                'Exportación en baja resolución'
            ],
            icon: 'fa-dungeon',
            tier: 'free'
        },
        {
            name: 'Plus',
            price: '4.99€',
            period: '/mes',
            features: [
                'Creación de cartas ilimitada',
                'Acceso a todos los marcos',
                'Guardado de hasta 20 barajas',
                'Exportación en alta resolución',
                '50 créditos de IA para imágenes /mes'
            ],
            icon: 'fa-hat-wizard',
            tier: 'plus',
            recommended: true
        },
        {
            name: 'Pro',
            price: '9.99€',
            period: '/mes',
            features: [
                'Todo lo del plan Plus',
                '200 créditos de IA para imágenes /mes',
                'Acceso a fuentes premium',
                'Soporte prioritario',
                'Acceso beta a nuevas funciones'
            ],
            icon: 'fa-dragon',
            tier: 'pro'
        }
    ];

  return (
    <PageContainer>
      <div className="subscription-page">
        <div className="page-header">
          <h1 className="page-title">Elige tu Plan de Aventura</h1>
        <p className="page-subtitle">Desbloquea nuevas herramientas para forjar tus leyendas.</p>
      </div>

      <div className="plans-container">
                {plans.map(plan => (
                    <div key={plan.name} className={`plan-card ${plan.tier} ${plan.recommended ? 'recommended' : ''}`}>
                        {plan.recommended && <div className="recommended-badge">Recomendado</div>}
                        <div className="plan-header">
                            <i className={`fas ${plan.icon} plan-icon`}></i>
                            <h2 className="plan-name">{plan.name}</h2>
                            <div className="plan-price">
                                <span className="price-amount">{plan.price}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map(feature => (
                                <li key={feature}><i className="fas fa-check-circle"></i> {feature}</li>
                            ))}
                        </ul>
                        <div className="plan-footer">
                            <button className="spell-form-button select-plan-button">Seleccionar Plan</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="todo-section spell-form-as-card">
              <h3 className="section-title">Development To-Do</h3>
              <ul className="todo-list">
                <li><i className="far fa-square"></i> Integrate with Stripe or another payment provider.</li>
                <li><i className="far fa-square"></i> Create checkout sessions for each plan.</li>
                <li><i className="far fa-square"></i> Implement logic to unlock features based on the user's active subscription.</li>
                <li><i className="far fa-square"></i> Build a customer portal to manage subscriptions.</li>
              </ul>
            </div>
        </div>
    </PageContainer>
  );
};

export default SubscriptionPage;
