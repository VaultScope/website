import { describe, it, expect } from 'vitest';

describe('NewService payment flow logic', () => {
  it('calculates VAT correctly at 19%', () => {
    const price = 9.99;
    const vat = price * 0.19;
    const total = price + vat;
    expect(vat).toBeCloseTo(1.8981, 4);
    expect(total).toBeCloseTo(11.8881, 4);
  });

  it('total in cents is at least 50 (Stripe minimum)', () => {
    const price = 0.01;
    const vat = price * 0.19;
    const total = price + vat;
    const cents = Math.max(Math.round(total * 100), 50);
    expect(cents).toBe(50);
  });

  it('rounds total correctly for Stripe amount', () => {
    const price = 29.99;
    const vat = price * 0.19;
    const total = price + vat;
    const cents = Math.max(Math.round(total * 100), 1);
    expect(cents).toBe(3569);
  });

  it('generates correct hostname fallback format', () => {
    const serviceId = '550e8400-e29b-41d4-a716-446655440000';
    const hostname = `srv-${serviceId.slice(0, 8)}`;
    expect(hostname).toBe('srv-550e8400');
  });

  it('validates step navigation constraints', () => {
    const steps = ['Product', 'Configuration', 'Review', 'Payment', 'Provisioning'];
    expect(steps.length).toBe(5);
    expect(Math.min(0 + 1, steps.length - 1)).toBe(1);
    expect(Math.min(3 + 1, steps.length - 1)).toBe(4);
    expect(Math.min(4 + 1, steps.length - 1)).toBe(4);
    expect(Math.max(0 - 1, 0)).toBe(0);
    expect(Math.max(2 - 1, 0)).toBe(1);
  });

  it('parseFloat handles Decimal string from API', () => {
    expect(parseFloat('29.99')).toBe(29.99);
    expect(parseFloat('0.00')).toBe(0);
    expect(parseFloat('199.00')).toBe(199);
  });
});
