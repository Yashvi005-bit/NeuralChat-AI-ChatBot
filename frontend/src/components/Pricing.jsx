import { useScrollAnimation, staggerDelay } from '../hooks/useScrollAnimation';
import './Pricing.css';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal projects and early exploration.',
    highlight: false,
    features: [
      '100 messages / day',
      'GPT-3.5 powered',
      '1 workspace',
      'Community support',
      'API access (limited)',
    ],
    cta: 'Get started free',
    ctaStyle: 'ghost',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'The full NeuralChat experience for serious builders.',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Unlimited messages',
      'GPT-4 powered',
      '10 workspaces',
      'Priority support',
      'Full API access',
      'Custom system prompts',
      'Analytics dashboard',
    ],
    cta: 'Start Pro trial',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored infrastructure for large-scale deployments.',
    highlight: false,
    features: [
      'Unlimited everything',
      'Dedicated models',
      'SSO & SAML',
      'SLA guarantee',
      'On-premise option',
      'Dedicated CSM',
    ],
    cta: 'Contact sales',
    ctaStyle: 'ghost',
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Pricing({ onSignup }) {
  const sectionRef = useScrollAnimation();

  return (
    <section className="pricing section" id="pricing" ref={sectionRef} aria-label="Pricing section">
      <div className="container">
        <div className="pricing__header reveal">
          <span className="section-label">Simple pricing</span>
          <h2 className="section-title">Pay for what you use</h2>
          <p className="section-subtitle">
            No hidden fees. No surprises. Cancel any time.
          </p>
        </div>

        <div className="pricing__grid">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`pricing-card reveal ${plan.highlight ? 'pricing-card--highlight' : ''}`}
              style={staggerDelay(i, 100)}
            >
              {plan.badge && (
                <div className="pricing-card__badge" aria-label="Most popular plan">{plan.badge}</div>
              )}

              <div className="pricing-card__top">
                <h3 className="pricing-card__name">{plan.name}</h3>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">{plan.price}</span>
                  {plan.period && <span className="pricing-card__period">{plan.period}</span>}
                </div>
                <p className="pricing-card__desc">{plan.description}</p>
              </div>

              <ul className="pricing-card__features" role="list">
                {plan.features.map((feat) => (
                  <li key={feat} className="pricing-card__feature">
                    <span className="pricing-card__check"><CheckIcon /></span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-${plan.ctaStyle} pricing-card__cta`}
                onClick={onSignup}
                id={`pricing-${plan.name.toLowerCase()}-btn`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
